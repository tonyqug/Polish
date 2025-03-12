// pages/api/user/get-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebase-admin"; // Ensure your Firebase admin SDK is initialized

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userSnap.data());
  } catch (error: any) {
    return res.status(500).json({ error: "Error fetching user data", details: error.message });
  }
}
