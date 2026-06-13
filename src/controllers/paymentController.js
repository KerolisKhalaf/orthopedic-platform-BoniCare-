import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import { APPOINTMENT_STATUS } from '../config/constants.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';

// Lazy initialize stripe
let stripe;
const getStripe = () => {
    if (!stripe) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key');
    }
    return stripe;
};

/**
 * @openapi
 * /payment/create-intent:
 *   post:
 *     tags: [Payments]
 *     summary: Create Stripe payment intent for an appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - amount
 *               - type
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 example: 65f1c9a8b12a4c0012abc123
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [full_payment, deposit]
 *                 example: full_payment
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 clientSecret:
 *                   type: string
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
export const createPaymentIntent = async (req, res, next) => {
    const { appointmentId, amount, type } = req.body;
    const userId = req.user.id;
    const stripeInstance = getStripe();

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return next(new AppError('Appointment not found', 404));
        }

        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: amount,
            currency: process.env.PAYMENT_CURRENCY || 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                appointmentId: appointmentId.toString(),
                userId: userId.toString(),
                type: type
            }
        });

        await Payment.create({
            transactionId: paymentIntent.id,
            userId: userId,
            appointmentId: appointmentId,
            amount: amount,
            currency: paymentIntent.currency,
            type: type || 'full_payment',
            status: 'pending',
            metadata: paymentIntent.metadata
        });

        appointment.status = APPOINTMENT_STATUS.AWAITING_PAYMENT;
        await appointment.save();

        res.status(200).json({
            status: 'success',
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @openapi
 * /payment/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Stripe webhook handler (payment status updates)
 *     description: Handles Stripe events like payment_intent.succeeded and payment_intent.payment_failed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw Stripe event payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook signature
 *       500:
 *         description: Processing error
 */
export const handleWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    const stripeInstance = getStripe();
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || 'dummy_secret'
        );
    } catch (err) {
        console.error(`[Stripe Webhook Verification Error] ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = await mongoose.startSession();
    let transactionStarted = false;

    try {
        if (mongoose.connection.config?.replicaSet || process.env.NODE_ENV === 'production') {
            session.startTransaction();
            transactionStarted = true;
        }

        const paymentIntent = event.data.object;

        if (event.type === 'payment_intent.succeeded') {
            const payment = await Payment.findOne({ transactionId: paymentIntent.id }).session(session);
            if (payment) {
                payment.status = 'completed';
                payment.paymentMethod = paymentIntent.payment_method;
                await payment.save();

                const appointment = await Appointment.findById(payment.appointmentId).session(session);
                if (appointment) {
                    appointment.status = APPOINTMENT_STATUS.SCHEDULED; 
                    await appointment.save();
                }
            }
            console.log(`[Stripe Webhook] PaymentIntent succeeded: ${paymentIntent.id}`);
        } else if (event.type === 'payment_intent.payment_failed') {
            const payment = await Payment.findOne({ transactionId: paymentIntent.id }).session(session);
            if (payment) {
                payment.status = 'failed';
                await payment.save();

                const appointment = await Appointment.findById(payment.appointmentId).session(session);
                if (appointment) {
                    appointment.status = APPOINTMENT_STATUS.PAYMENT_FAILED;
                    await appointment.save();
                }
            }
            console.log(`[Stripe Webhook] PaymentIntent failed: ${paymentIntent.id}`);
        }

        if (transactionStarted) {
            await session.commitTransaction();
        }
        res.status(200).json({ received: true });
    } catch (err) {
        if (transactionStarted) {
            await session.abortTransaction();
        }
        console.error(`[Stripe Webhook] Processing Error: ${err.message}`);
        res.status(500).json({ error: 'Webhook processing failed' });
    } finally {
        session.endSession();
    }
};

/**
 * @openapi
 * /payment/refund:
 *   post:
 *     tags: [Payments]
 *     summary: Issue refund for a completed payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: 65f1c9a8b12a4c0012abc999
 *               amount:
 *                 type: number
 *                 example: 5000
 *               reason:
 *                 type: string
 *                 example: requested_by_customer
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request or payment not eligible for refund
 *       404:
 *         description: Payment not found
 */
export const issueRefund = async (req, res, next) => {
    const { paymentId, amount, reason } = req.body;
    const stripeInstance = getStripe();

    try {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return next(new AppError('Payment record not found', 404));
        }

        if (payment.status !== 'completed' && payment.status !== 'refunded') {
            return next(new AppError('Only completed payments can be refunded', 400));
        }

        // Process refund via Stripe
        const refund = await stripeInstance.refunds.create({
            payment_intent: payment.transactionId,
            amount: amount, 
            reason: reason || 'requested_by_customer'
        });

        // Log refund in database
        payment.refunds.push({
            refundId: refund.id,
            amount: amount || payment.amount,
            status: refund.status,
            reason: reason,
            createdAt: new Date()
        });

        payment.status = 'refunded';
        await payment.save();

        res.status(200).json({
            status: 'success',
            data: payment
        });
    } catch (err) {
        next(err);
    }
};
