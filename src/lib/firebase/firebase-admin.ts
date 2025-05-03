// src/lib/firebase/firebase-admin.ts
import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add other config if needed, like databaseURL
      // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Example if using Realtime DB
    });
     console.log('Firebase Admin SDK Initialized');
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

export const adminDb = admin.firestore();
export const auth = admin.auth();
export const adminStorage = admin.storage();

export default admin;
