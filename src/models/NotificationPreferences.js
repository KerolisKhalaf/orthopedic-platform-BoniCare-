import mongoose from 'mongoose';

const notificationPreferencesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    pushEnabled: {
        type: Boolean,
        default: true
    },
    emailEnabled: {
        type: Boolean,
        default: true
    },
    inAppEnabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Best practice: Check if model already exists before defining (prevents OverwriteModelError)
const NotificationPreferences = mongoose.models.NotificationPreferences || mongoose.model('NotificationPreferences', notificationPreferencesSchema);

export default NotificationPreferences;
