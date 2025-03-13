import { NextResponse } from "next/server";
import { db, auth } from "../../../../lib/firebase-admin";  // Backend auth and Firestore

export async function POST(req: Request) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Firebase token (server-side validation)
    const decodedToken = await auth.verifyIdToken(token);
    const userEmail = decodedToken.email; // Get the email from the decoded token

    if (!userEmail) {
      return NextResponse.json({ error: "No email found in token" }, { status: 400 });
    }

    // Parse the request body to get the user data
    const { firstName, lastName, school, bio } = await req.json();

    // Get the user reference in Firestore using the email as the document ID
    const userRef = db.collection("users").doc(userEmail);

    // Update the user data in Firestore
    await userRef.update({
      firstName,
      lastName,
      school,
      bio,
      updatedAt: new Date().toISOString(), // Optionally add an updated timestamp
    });

    return NextResponse.json({ message: "User data updated successfully" });
  } catch (error: any) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { error: "Error saving user data", details: error.message },
      { status: 500 }
    );
  }
}
