import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, name, image } = await request.json();

    // Create or update user in Firebase Auth
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(email);
    } catch (error) {
      // If user doesn't exist, create them
      firebaseUser = await auth.createUser({
        email,
        displayName: name,
        photoURL: image,
      });
    }

    // Store additional user data in Firestore
    await db.collection('users').doc(email).set({
      email,
      name,
      image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      userId: firebaseUser.uid 
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const userDoc = await db.collection('users').doc(email).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
