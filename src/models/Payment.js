import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
    refundId: String,
    amount: Number,
    status: String,
    reason: String,
    createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    type: {
        type: String,
        enum: ['full_payment', 'deposit'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String
    },
    metadata: {
        type: Object,
        default: {}
    },
    refunds: [refundSchema]
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;
