// src/lib/firebase/firebase-admin.ts
import * as admin from 'firebase-admin';

let serviceAccount: object | undefined;
let adminInitialized = false;

console.log('[firebase-admin] Attempting to initialize Firebase Admin SDK...');

// Check if the environment variable exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error("CRITICAL ERROR: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK cannot be initialized. Middleware functionality will be affected.");
  // No point in continuing if the key is missing
  // throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing."); // This might stop the build/server start entirely. Logging might be preferred in some CI/CD.
} else {
    try {
        // Ensure it's parsed correctly
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (e: any) {
        console.error("CRITICAL ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid JSON string.", e.message);
        serviceAccount = undefined; // Ensure it's undefined if parsing fails
        // throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ${e.message}. Check environment variables.`);
    }
}


// Initialize only if not already initialized and service account is valid
if (!admin.apps.length && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add other config if needed, like databaseURL
      // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Example if using Realtime DB
    });
    adminInitialized = true;
    console.log('[firebase-admin] Firebase Admin SDK Initialized successfully.');
  } catch (error: any) {
    console.error('[firebase-admin] Firebase Admin Initialization Error:', error.stack || error);
    // If initialization fails, subsequent imports might fail.
    // throw new Error(`Firebase Admin Initialization failed: ${error.message || error}`);
  }
} else if (admin.apps.length) {
    adminInitialized = true; // Already initialized
    console.log('[firebase-admin] Firebase Admin SDK already initialized.');
} else {
    console.error('[firebase-admin] Firebase Admin SDK could not be initialized because the service account key was missing or invalid.');
}

// Define exports conditionally or handle the uninitialized state
let adminDb: admin.firestore.Firestore | undefined;
let auth: admin.auth.Auth | undefined; // Use a different name like 'adminAuth' to avoid conflicts
let adminStorage: admin.storage.Storage | undefined;

if (adminInitialized) {
    adminDb = admin.firestore();
    auth = admin.auth();
    adminStorage = admin.storage();
} else {
    // Provide dummy objects or throw errors when accessed?
    // Log a warning that features requiring admin SDK won't work.
    console.warn("[firebase-admin] WARNING: Firebase Admin SDK is not initialized. Features requiring admin privileges (like middleware token verification) may fail.");
    // You might assign mock functions or objects here if needed for type safety,
    // but they would log errors or do nothing.
}


// Export potentially undefined values or throw if accessed when not initialized.
// It's generally safer to export them and let the consuming code check.
export { adminDb, auth, adminStorage };

// Export the admin namespace itself, but be aware it might not be fully functional if init failed.
export default admin;
