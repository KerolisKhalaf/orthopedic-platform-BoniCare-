import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseApp = null;


try {
    // Priority: 1. ENV variable, 2. Default hardcoded path (relative to root)
    const serviceAccountRelativePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../config/bonicare-notifications-sys-firebase-adminsdk-fbsvc-71583c7a6d.json';
    
    // Resolve path relative to this file
    const resolvedPath = path.resolve(__dirname, serviceAccountRelativePath);
    
    const serviceAccount = JSON.parse(readFileSync(resolvedPath, 'utf8'));

    firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
    console.warn('⚠️ Push notifications will be disabled.');
}

export default firebaseApp;