// pages/api/user/save-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebase-admin"; // Ensure you export your initialized admin SDK here
import admin from "firebase-admin";

interface SaveUserRequestBody {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  school?: string;
  bio?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    userId,
    email,
    firstName,
    lastName,
    school = "",
    bio = "",
  } = req.body as SaveUserRequestBody;

  try {
    // Use the userId as the document ID in the "users" collection
    const userRef = db.collection("users").doc(userId);
    await userRef.set({
      email,
      firstName,
      lastName,
      school,
      bio,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ message: "User data saved successfully!" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error saving user data", details: error.message });
  }
}
