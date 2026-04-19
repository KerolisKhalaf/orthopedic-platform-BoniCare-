import firebaseApp from './firebase.js';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import Notification from '../models/Notification.js';
import NotificationPreferences from '../models/NotificationPreferences.js';
import User from '../models/User.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendNotification = async (userId, type, channel, content) => {
    try {
        // 1. Fetch user preferences
        let prefs = await NotificationPreferences.findOne({ userId });
        if (!prefs) {
            // Default preferences if not set
            prefs = await NotificationPreferences.create({ userId });
        }

        // Check if enabled for the channel
        if (channel === 'push' && !prefs.pushEnabled) return;
        if (channel === 'email' && !prefs.emailEnabled) return;

        // 2. Fetch user details
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        let status = 'pending';

        // 3. Send notification
        if (channel === 'push') {
            if (!firebaseApp || !user.fcmToken) {
                console.warn(`[Notification] PUSH_SKIPPED userId=${userId} reason=${!firebaseApp ? 'Firebase_Not_Init' : 'No_FCM_Token'}`);
                status = 'failed';
            } else {
                const message = {
                    notification: {
                        title: type === 'chat_message' ? 'New Chat Message' : 'Notification',
                        body: content,
                    },
                    token: user.fcmToken,
                };
                await admin.messaging().send(message);
                console.log(`[Notification] PUSH_SENT userId=${userId} type=${type}`);
                status = 'delivered';
            }
        } else if (channel === 'email') {
            if (!user.email) {
                console.warn(`[Notification] EMAIL_SKIPPED userId=${userId} reason=No_Email`);
                status = 'failed';
            } else {
                const mailOptions = {
                    from: process.env.FROM_EMAIL,
                    to: user.email,
                    subject: type === 'chat_message' ? 'New Message on BoniCare' : 'Update from BoniCare',
                    text: content,
                };
                await transporter.sendMail(mailOptions);
                console.log(`[Notification] EMAIL_SENT userId=${userId} type=${type}`);
                status = 'delivered';
            }
        }

        // 4. Log notification
        await Notification.create({
            userId,
            type,
            channel,
            status
        });

    } catch (err) {
        console.error(`Notification failed for user ${userId}:`, err.message);
        // Log failure
        await Notification.create({
            userId,
            type,
            channel,
            status: 'failed'
        });
    }
};
