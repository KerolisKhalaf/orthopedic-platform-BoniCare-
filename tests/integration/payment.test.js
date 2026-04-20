import { jest } from '@jest/globals';

// Mock Stripe
jest.unstable_mockModule('stripe', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                paymentIntents: {
                    create: jest.fn().mockResolvedValue({
                        id: 'pi_test_123',
                        client_secret: 'secret_123',
                        currency: 'usd',
                        metadata: { appointmentId: 'mockId' }
                    }),
                },
                webhooks: {
                    constructEvent: jest.fn().mockImplementation((body, sig, secret) => {
                        if (!body) throw new Error('No body provided');
                        return JSON.parse(body.toString());
                    })
                },
                refunds: {
                    create: jest.fn().mockResolvedValue({
                        id: 're_test_123',
                        status: 'succeeded'
                    })
                }
            };
        })
    };
});

// Mock authMiddleware
jest.unstable_mockModule('../../src/middleware/authMiddleware.js', () => {
    return {
        protect: (roles = []) => (req, res, next) => {
            req.user = { id: req.headers['x-user-id'] || '661858c707d89066986518a2', role: roles.includes('doctor') ? 'doctor' : 'patient' };
            next();
        }
    };
});

// Import everything else after mocking
const { default: request } = await import('supertest');
const { default: express } = await import('express');
const { default: mongoose } = await import('mongoose');
const { connect, closeDatabase, clearDatabase } = await import('../utils/dbHandler.js');
const { default: paymentRouter } = await import('../../src/routes/payment.js');
const { default: Appointment } = await import('../../src/models/Appointment.js');
const { default: User } = await import('../../src/models/User.js');
const { default: Payment } = await import('../../src/models/Payment.js');
const { APPOINTMENT_STATUS } = await import('../../src/config/constants.js');

const app = express();
app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/payment/webhook') {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        express.json()(req, res, next);
    }
});
app.use('/api/v1/payment', paymentRouter);

describe('Payment Integration Tests', () => {
    let testUser;
    let testDoctor;
    let testAppointment;

    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
        
        testUser = await User.create({
            name: 'Test Patient',
            email: 'patient@test.com',
            passwordHash: 'hashed',
            role: 'patient'
        });

        testDoctor = await User.create({
            name: 'Test Doctor',
            email: 'doctor@test.com',
            passwordHash: 'hashed',
            role: 'doctor'
        });

        testAppointment = await Appointment.create({
            patientId: testUser._id,
            doctorId: testDoctor._id,
            scheduledDate: new Date(),
            startTime: new Date(),
            endTime: new Date(Date.now() + 3600000),
            status: APPOINTMENT_STATUS.SCHEDULED
        });
    });

    it('should create a payment intent and log initial payment record', async () => {
        const res = await request(app)
            .post('/api/v1/payment/create-intent')
            .set('x-user-id', testUser._id.toString())
            .send({
                appointmentId: testAppointment._id,
                amount: 5000,
                type: 'full_payment'
            });

        expect(res.status).toBe(200);
        expect(res.body.clientSecret).toBeDefined();

        const payment = await Payment.findOne({ appointmentId: testAppointment._id });
        expect(payment).toBeDefined();
        expect(payment.status).toBe('pending');
        expect(payment.transactionId).toBe('pi_test_123');

        const updatedAppointment = await Appointment.findById(testAppointment._id);
        expect(updatedAppointment.status).toBe(APPOINTMENT_STATUS.AWAITING_PAYMENT);
    });

    it('should process payment_intent.succeeded webhook and confirm appointment', async () => {
        const payment = await Payment.create({
            transactionId: 'pi_test_123',
            userId: testUser._id,
            appointmentId: testAppointment._id,
            amount: 5000,
            type: 'full_payment',
            status: 'pending'
        });

        const webhookPayload = {
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    id: 'pi_test_123',
                    payment_method: 'pm_mock_123'
                }
            }
        };

        const res = await request(app)
            .post('/api/v1/payment/webhook')
            .set('stripe-signature', 'mock_sig')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(webhookPayload));

        expect(res.status).toBe(200);

        const updatedPayment = await Payment.findById(payment._id);
        expect(updatedPayment.status).toBe('completed');
        expect(updatedPayment.paymentMethod).toBe('pm_mock_123');

        const updatedAppointment = await Appointment.findById(testAppointment._id);
        expect(updatedAppointment.status).toBe(APPOINTMENT_STATUS.SCHEDULED);
    });

    it('should process payment_intent.payment_failed webhook', async () => {
        const payment = await Payment.create({
            transactionId: 'pi_test_123',
            userId: testUser._id,
            appointmentId: testAppointment._id,
            amount: 5000,
            type: 'full_payment',
            status: 'pending'
        });

        const webhookPayload = {
            type: 'payment_intent.payment_failed',
            data: {
                object: {
                    id: 'pi_test_123'
                }
            }
        };

        const res = await request(app)
            .post('/api/v1/payment/webhook')
            .set('stripe-signature', 'mock_sig')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(webhookPayload));

        expect(res.status).toBe(200);

        const updatedPayment = await Payment.findById(payment._id);
        expect(updatedPayment.status).toBe('failed');

        const updatedAppointment = await Appointment.findById(testAppointment._id);
        expect(updatedAppointment.status).toBe(APPOINTMENT_STATUS.PAYMENT_FAILED);
    });

    it('should confirm appointment within 10 seconds of webhook (SC-001)', async () => {
        await Payment.create({
            transactionId: 'perf_test_123',
            userId: testUser._id,
            appointmentId: testAppointment._id,
            amount: 5000,
            type: 'full_payment',
            status: 'pending'
        });

        const webhookPayload = {
            type: 'payment_intent.succeeded',
            data: { object: { id: 'perf_test_123', payment_method: 'pm_perf' } }
        };

        const start = Date.now();
        const res = await request(app)
            .post('/api/v1/payment/webhook')
            .set('stripe-signature', 'mock_sig')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(webhookPayload));
        const end = Date.now();

        expect(res.status).toBe(200);
        expect(end - start).toBeLessThan(10000); // 10 seconds

        const updatedAppointment = await Appointment.findById(testAppointment._id);
        expect(updatedAppointment.status).toBe(APPOINTMENT_STATUS.SCHEDULED);
    });

    it('should issue a refund', async () => {
        const payment = await Payment.create({
            transactionId: 'pi_test_123',
            userId: testUser._id,
            appointmentId: testAppointment._id,
            amount: 5000,
            type: 'full_payment',
            status: 'completed'
        });

        const res = await request(app)
            .post('/api/v1/payment/refund')
            .set('x-user-id', testDoctor._id.toString())
            .send({
                paymentId: payment._id,
                amount: 2000,
                reason: 'Partial refund'
            });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('refunded');
        expect(res.body.data.refunds.length).toBe(1);
        expect(res.body.data.refunds[0].amount).toBe(2000);
    });
});
