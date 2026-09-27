import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, message, reason, rating, senderEmail } = body;

    const db = await getDatabase();
    const timestamp = new Date();

    const record = {
      type: type || 'creator_message', // 'creator_message' | 'uninstall_survey'
      message: message || '',
      reason: reason || null,
      rating: rating || null,
      senderEmail: senderEmail || 'anonymous',
      userAgent: req.headers.get('user-agent') || 'unknown',
      createdAt: timestamp,
    };

    if (db) {
      const collection = type === 'uninstall_survey' 
        ? db.collection('uninstall_surveys')
        : db.collection('creator_messages');

      await collection.insertOne(record);
      return NextResponse.json({ success: true, persisted: true });
    }

    // Fallback if database is offline
    console.log('[Feedback Received - Offline Fallback]:', record);
    return NextResponse.json({ success: true, persisted: false, message: 'Received locally' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
