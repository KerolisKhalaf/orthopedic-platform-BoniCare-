import { connect, closeDatabase, clearDatabase } from '../utils/dbHandler.js';
import Notification from '../../src/models/Notification.js';
import NotificationPreferences from '../../src/models/NotificationPreferences.js';
import User from '../../src/models/User.js';
import mongoose from 'mongoose';

describe('Chat Infrastructure & Notification Integration', () => {
    let testUser;

    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
        testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            passwordHash: 'hashedpassword',
            role: 'patient'
        });
    });

    it('should be able to create notification preferences for a user', async () => {
        const prefs = await NotificationPreferences.create({
            userId: testUser._id,
            pushEnabled: true,
            emailEnabled: false
        });

        expect(prefs.userId).toEqual(testUser._id);
        expect(prefs.pushEnabled).toBe(true);
        expect(prefs.emailEnabled).toBe(false);
    });

    it('should be able to log a notification', async () => {
        const notification = await Notification.create({
            userId: testUser._id,
            type: 'chat_message',
            channel: 'push',
            status: 'pending'
        });

        expect(notification.userId).toEqual(testUser._id);
        expect(notification.status).toBe('pending');
        expect(notification.createdAt).toBeDefined();
    });
});
