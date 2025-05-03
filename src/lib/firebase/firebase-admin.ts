// src/lib/firebase/firebase-admin.ts
import * as admin from 'firebase-admin';

let serviceAccount: object;

// Ensure the environment variable exists before attempting to parse
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error("CRITICAL ERROR: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK cannot be initialized. Middleware functionality will be affected.");
  // Decide on behavior: throw error to halt, or proceed without admin features?
  // Throwing an error is usually better during setup/build to catch missing config.
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing.");
}

try {
    serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
} catch (e: any) {
    console.error("CRITICAL ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid JSON string.", e.message);
    // Throwing here makes the failure explicit and prevents silent failures later.
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ${e.message}. Check environment variables.`);
}


if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add other config if needed, like databaseURL
      // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Example if using Realtime DB
    });
     console.log('Firebase Admin SDK Initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    // If initialization fails, subsequent imports might fail.
    throw new Error(`Firebase Admin Initialization failed: ${error.message || error}`);
  }
} else {
    console.log('Firebase Admin SDK already initialized.');
}

// Ensure exports are only defined after successful initialization check
export const adminDb = admin.firestore();
export const auth = admin.auth(); // Renamed to adminAuthInternal to avoid conflict if 'auth' is imported from client SDK elsewhere
export const adminStorage = admin.storage();

export default admin;
