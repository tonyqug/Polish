import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authenticated using the Firebase token.
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const decodedToken = await auth.verifyIdToken(token);
    const userEmail = decodedToken.email;
    if (!userEmail) {
      return NextResponse.json({ error: "No email found in token" }, { status: 400 });
    }

    // Parse the request body
    const { title, type, prompt, content } = await request.json();
    if (!title || !type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure the user document exists in the "users" collection.
    const userRef = db.collection("users").doc(userEmail);
    await userRef.set({ email: userEmail }, { merge: true });

    // Prepare the new essay data.
    const newEssayData = {
      title,
      type,
      prompt: prompt || "",
      content,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add a new document in the "essays" subcollection.
    const essayCollection = userRef.collection("essays");
    const newEssayDocRef = await essayCollection.add(newEssayData);
    
    // Optionally update the document with its auto-generated id.
    await newEssayDocRef.update({ id: newEssayDocRef.id });

    return NextResponse.json({ success: true, essayId: newEssayDocRef.id });
  } catch (error: any) {
    console.error("Error uploading essay:", error);
    return NextResponse.json(
      { error: "Failed to upload essay", details: error.message },
      { status: 500 }
    );
  }
}
