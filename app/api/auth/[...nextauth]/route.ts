import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../../lib/firebase-admin";
import { Timestamp } from "firebase/firestore";
import admin from "firebase-admin";
// Define the NextAuth configuration
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      try {
        // Check if the user already exists in Firestore by email
        const userRef = db.collection("users").doc(user.email);
        const userDoc = await userRef.get();

        // If the user does not exist, create them in Firestore
        if (!userDoc.exists) {
          await userRef.set({
            email: user.email,
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ")[1] || "",
            school: "", // Default empty, can be updated later
            bio: "",    // Default empty, can be updated later
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      } catch (error) {
        console.error("Error signing in user:", error);
        return false;
      }

      return true; // Allow the sign-in process to complete
    },
  },
};

// Named exports for HTTP methods
export const POST = async (req: any, res: any) => {
  return NextAuth(req, res, authOptions);
};

export const GET = async (req: any, res: any) => {
  return NextAuth(req, res, authOptions);
};
