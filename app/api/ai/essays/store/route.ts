import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase-admin";

interface Essay {
  id: string;
  email: string;
  title: string;
  type: string;
  prompt?: string;
  content: string;
  status: string;
  createdAt: string;
  lastUpdated: string;
  feedback?: {
    comments: Array<{
      text: string;
      type: string;
      range?: { start: number; end: number };
    }>;
    summary: string;
  };
  evaluation?: {
    dimensions: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
    overallScore: number;
    summary: string;
  };
  takeaways?: {
    keyPoints: string[];
    strengths: string[];
    improvements: string[];
    summary: string;
  };
}

// POST new essay
export async function POST(request: NextRequest) {
  try {
    const { email, title, type, prompt, content } = await request.json();

    if (!email || !title || !type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const essayRef = db
      .collection('users')
      .doc(email)
      .collection('essays')
      .doc();

    const essay: Essay = {
      id: essayRef.id,
      email,
      title,
      type,
      prompt,
      content,
      status: 'Analyzing',
      createdAt: now,
      lastUpdated: now
    };

    await essayRef.set(essay);

    return NextResponse.json({ 
      success: true, 
      essayId: essayRef.id 
    });
  } catch (error) {
    console.error('Error creating essay:', error);
    return NextResponse.json(
      { error: 'Failed to create essay' },
      { status: 500 }
    );
  }
}

// PATCH existing essay with feedback
export async function PATCH(request: NextRequest) {
  try {
    const { email, essayId, feedback, evaluation, takeaways, status } = await request.json();

    if (!email || !essayId) {
      return NextResponse.json(
        { error: 'Email and essayId are required' },
        { status: 400 }
      );
    }

    const essayRef = db
      .collection('users')
      .doc(email)
      .collection('essays')
      .doc(essayId);

    const essayDoc = await essayRef.get();
    if (!essayDoc.exists) {
      return NextResponse.json(
        { error: 'Essay not found' },
        { status: 404 }
      );
    }

    const updateData: Partial<Essay> = {
      lastUpdated: new Date().toISOString()
    };

    if (feedback) updateData.feedback = feedback;
    if (evaluation) updateData.evaluation = evaluation;
    if (takeaways) updateData.takeaways = takeaways;
    if (status) updateData.status = status;

    await essayRef.update(updateData);

    return NextResponse.json({ 
      success: true,
      essayId
    });
  } catch (error) {
    console.error('Error updating essay:', error);
    return NextResponse.json(
      { error: 'Failed to update essay' },
      { status: 500 }
    );
  }
}
