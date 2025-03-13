import { NextResponse } from "next/server";
import { db, auth } from "../../../../lib/firebase-admin";  // Backend auth and firestore

export async function GET(req: Request) {
  if (req.method === "GET") {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.get("Authorization")?.split("Bearer ")[1];
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Verify Firebase token (server-side validation)
      const decodedToken = await auth.verifyIdToken(token);
      const userEmail = decodedToken.email;  // Get the email from the decoded token

      if (!userEmail) {
        return NextResponse.json({ error: "No email found in token" }, { status: 400 });
      }

      // Get the user data from Firestore using the email as the doc ID
      const userRef = db.collection("users").doc(userEmail);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(userSnap.data());
    } catch (error: any) {
      return NextResponse.json(
        { error: "Error fetching user data", details: error.message },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
