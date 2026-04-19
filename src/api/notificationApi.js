import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import NotificationPreferences from '../models/NotificationPreferences.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route GET /api/v1/notification/preferences
 * @desc Get current user notification preferences
 */
router.get('/preferences', protect(), async (req, res) => {
    try {
        let prefs = await NotificationPreferences.findOne({ userId: req.user.id });
        if (!prefs) {
            prefs = await NotificationPreferences.create({ userId: req.user.id });
        }
        res.status(200).json({
            status: 'success',
            data: prefs
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route PATCH /api/v1/notification/preferences
 * @desc Update notification preferences
 */
router.patch('/preferences', protect(), async (req, res) => {
    try {
        const { pushEnabled, emailEnabled } = req.body;
        
        const prefs = await NotificationPreferences.findOneAndUpdate(
            { userId: req.user.id },
            { pushEnabled, emailEnabled },
            { new: true, upsert: true }
        );

        res.status(200).json({
            status: 'success',
            data: prefs
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route POST /api/v1/notification/token
 * @desc Update FCM token for push notifications
 */
router.post('/token', protect(), async (req, res) => {
    try {
        const { fcmToken } = req.body;
        
        await User.findByIdAndUpdate(req.user.id, { fcmToken });

        res.status(200).json({
            status: 'success',
            message: 'FCM token updated successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
