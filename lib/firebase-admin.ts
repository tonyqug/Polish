import * as admin from "firebase-admin";
import path from "path";

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  const serviceAccount = path.join(
    process.cwd(),
    process.env.FIREBASE_ADMIN_SDK_PATH || "config/firebase-admin-sdk.json"
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth(); // Add this line

export { db, auth };
