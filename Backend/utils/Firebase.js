// Import the Firebase Admin SDK
import admin from "firebase-admin";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

// Load the service account key JSON file
const serviceAccount = JSON.parse(process.env.FIREBASEADMINSDK);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optionally, you can add other properties like databaseURL, storageBucket, etc.
});

// Export the initialized admin instance for use in other parts of the project
export default admin;
