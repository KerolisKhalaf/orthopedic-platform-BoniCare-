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

const getNotificationPreferences = async (userId) => {
    let prefs = await NotificationPreferences.findOne({ userId });
    if (!prefs) {
        prefs = await NotificationPreferences.create({ userId });
    }
    return prefs;
};

const sendPushNotification = async (user, type, content, userId) => {
    if (!firebaseApp || !user.fcmToken) {
        const reason = firebaseApp ? 'No_FCM_Token' : 'Firebase_Not_Init';
        console.warn(
            `[Notification] PUSH_SKIPPED userId=${userId} reason=${reason}`
        );
        return 'failed';
    }

    const message = {
        notification: {
            title: type === 'chat_message' ? 'New Chat Message' : 'Notification',
            body: content,
        },
        token: user.fcmToken,
    };

    await admin.messaging().send(message);
    console.log(`[Notification] PUSH_SENT userId=${userId} type=${type}`);
    return 'delivered';
};

const sendEmailNotification = async (user, type, content, userId) => {
    if (!user.email) {
        console.warn(`[Notification] EMAIL_SKIPPED userId=${userId} reason=No_Email`);
        return 'failed';
    }

    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: type === 'chat_message' ? 'New Message on BoniCare' : 'Update from BoniCare',
        text: content,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Notification] EMAIL_SENT userId=${userId} type=${type}`);
    return 'delivered';
};

const logNotification = async ({ userId, type, channel, status }) => {
    await Notification.create({
        userId,
        type,
        channel,
        status,
    });
};

export const sendNotification = async (userId, type, channel, content) => {
    try {
        const prefs = await getNotificationPreferences(userId);

        if ((channel === 'push' && !prefs.pushEnabled) || (channel === 'email' && !prefs.emailEnabled)) {
            return;
        }

        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        let status = 'pending';

        if (channel === 'push') {
            status = await sendPushNotification(user, type, content, userId);
        } else if (channel === 'email') {
            status = await sendEmailNotification(user, type, content, userId);
        }

        await logNotification({ userId, type, channel, status });
    } catch (err) {
        console.error(`Notification failed for user ${userId}:`, err.message);
        await logNotification({ userId, type, channel, status: 'failed' });
    }
};
