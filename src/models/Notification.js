import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['chat_message', 'status_change'],
        required: true
    },
    channel: {
        type: String,
        enum: ['push', 'email'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
