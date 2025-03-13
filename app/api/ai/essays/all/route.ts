import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const status = request.nextUrl.searchParams.get('status');
    const lastVisible = request.nextUrl.searchParams.get('lastVisible');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    let query: any = db
      .collection('users')
      .doc(email)
      .collection('essays');

    // if (status) {
    //   query = query.where('status', '==', status);
    // }
    
    query = query.orderBy('lastUpdated', 'desc').limit(limit);
    console.log(limit)
    if (lastVisible) {
      const lastVisibleDoc = await query.doc(lastVisible).get();
      query = query.startAfter(lastVisibleDoc);
    }

    const snapshot = await query.get();
 
    if (snapshot.size === 0) {
     
      return NextResponse.json({
        essays: [],
        pagination: {
          total: 0,
          lastVisible: null,
          limit,
        },
      });
    }

    const essays = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return NextResponse.json({
      essays,
      pagination: {
        total: snapshot.size,
        lastVisible: lastDoc.id,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching essays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch essays' },
      { status: 500 }
    );
  }
}
