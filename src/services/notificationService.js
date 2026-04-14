import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendNotification = async (userId, type, channel, content) => {
  if (channel === 'push') {
    const message = {
      notification: {
        title: 'New Chat Message',
        body: content,
      },
      token: 'user_fcm_token_here', // Logic to fetch FCM token for userId
    };
    try {
      await admin.messaging().send(message);
    } catch (err) {
      console.error('Firebase notification failed:', err.message);
    }
  } else if (channel === 'email') {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: 'user_email_here', // Logic to fetch user email for userId
      subject: 'New Message on BoniCare',
      text: content,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('Email notification failed:', err.message);
    }
  }
};
