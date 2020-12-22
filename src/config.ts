/**
 * The application name to be displayed in the document title.
 */
export const APP_NAME = process.env.REACT_APP_NAME || 'Simple Invoicing';

/**
 * Whether the app is set up to run demo sessions.
 */
export const IS_DEMO_MODE = process.env.REACT_APP_IS_DEMO_MODE === 'true';

/**
 * A Firebase object associates an app with a specific Firebase project and its
 * resources (databases, storage buckets, etc.). The configuration includes "Firebase
 * options", which are parameters required by Firebase and Google services to communicate
 * with Firebase server APIs and to associate client data with the Firebase project and
 * Firebase app. Here are the required, minimum "Firebase options":
 *
 *    - API key: a simple encrypted string used when calling certain APIs that don't need to
 *      access private user data (example value: AIzaSyDOCAbC123dEf456GhI789jKl012-MnO)
 *
 *    - Project ID: a user-defined unique identifier for the project across all of Firebase
 *      and GCP. This identifier may appear in URLs or names for some Firebase resources,
 *      but it should generally be treated as a convenience alias to reference the project.
 *      (example value: myapp-project-123)
 *
 *    - Application ID ("AppID"): the unique identifier for the Firebase app across all
 *      of Firebase with a platform-specific format:
 *      Firebase Web apps: appId (example value: 1:65211879909:web:3ae38ef1cdcb2e01fe5f0c)
 */
export const FIREBASE = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Auth / General Use
  appId: process.env.REACT_APP_FIREBASE_APP_ID, // General Use
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, // General Use
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, // Auth with popup/redirect
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL, // Realtime Database
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,// Firebase Storage
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,// Firebase Cloud Messaging
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID, // Analytics
};
