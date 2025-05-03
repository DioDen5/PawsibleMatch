declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    // NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string; // Optional
    FIREBASE_SERVICE_ACCOUNT_KEY: string; // For Firebase Admin SDK
    GOOGLE_GENAI_API_KEY?: string; // If using GenAI
  }
}
