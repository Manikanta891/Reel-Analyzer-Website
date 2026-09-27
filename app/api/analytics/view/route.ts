import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const BASELINE_COUNT = 15;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();
    if (!db) {
      // Return baseline metrics if MongoDB is not connected
      return NextResponse.json({
        connected: false,
        uniqueVisitors: BASELINE_COUNT,
        totalPageViews: BASELINE_COUNT * 3,
        todayUnique: 1,
        source: 'local_baseline',
      });
    }

    const metricsCol = db.collection('site_metrics');
    const visitorsCol = db.collection('unique_visitors');

    const [metricsDoc, uniqueCount, todayCount] = await Promise.all([
      metricsCol.findOne({ _id: 'global' as unknown as import('mongodb').ObjectId }),
      visitorsCol.countDocuments(),
      visitorsCol.countDocuments({
        lastSeen: { $gte: new Date(Date.now() - TWENTY_FOUR_HOURS_MS) },
      }),
    ]);

    const totalDisplayCount = BASELINE_COUNT + uniqueCount;
    const totalViews = (metricsDoc?.totalPageViews || 0) + BASELINE_COUNT * 3;

    return NextResponse.json({
      connected: true,
      uniqueVisitors: totalDisplayCount,
      totalPageViews: totalViews,
      todayUnique: Math.max(todayCount, 1),
      source: 'mongodb_atlas',
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics', uniqueVisitors: BASELINE_COUNT },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const now = new Date();
    const nowMs = now.getTime();

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Generate SHA-256 fingerprint hash
    const visitorHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}`)
      .digest('hex');

    // Check last_visit_24h cookie
    const lastVisitCookie = req.cookies.get('last_visit_24h')?.value;
    let is24hExpired = true;

    if (lastVisitCookie) {
      const lastVisitTime = new Date(lastVisitCookie).getTime();
      if (!isNaN(lastVisitTime) && nowMs - lastVisitTime < TWENTY_FOUR_HOURS_MS) {
        is24hExpired = false;
      }
    }

    const db = await getDatabase();
    let totalUnique = 0;
    let totalPageViews = 0;

    if (db) {
      const visitorsCol = db.collection('unique_visitors');
      const metricsCol = db.collection('site_metrics');

      const existingRecord = await visitorsCol.findOne({ visitorHash });

      if (!existingRecord) {
        // First-time visitor
        await visitorsCol.insertOne({
          visitorHash,
          userAgent,
          ip: ip.substring(0, 8) + '...', // privacy-masked
          firstSeen: now,
          lastSeen: now,
          visitCount: 1,
        });

        await metricsCol.updateOne(
          { _id: 'global' as unknown as import('mongodb').ObjectId },
          { $inc: { totalPageViews: 1, totalUniqueVisitors: 1 }, $set: { lastUpdated: now } },
          { upsert: true }
        );
      } else {
        const lastSeenTime = existingRecord.lastSeen ? new Date(existingRecord.lastSeen).getTime() : 0;
        const recordExpired = nowMs - lastSeenTime >= TWENTY_FOUR_HOURS_MS;

        await visitorsCol.updateOne(
          { visitorHash },
          {
            $set: { lastSeen: now, userAgent },
            $inc: {
              visitCount: 1,
              ...(recordExpired ? { dailyActiveCount: 1 } : {}),
            },
          }
        );

        await metricsCol.updateOne(
          { _id: 'global' as unknown as import('mongodb').ObjectId },
          { $inc: { totalPageViews: 1 }, $set: { lastUpdated: now } },
          { upsert: true }
        );
      }

      const count = await visitorsCol.countDocuments();
      const metricsDoc = await metricsCol.findOne({ _id: 'global' as unknown as import('mongodb').ObjectId });

      totalUnique = BASELINE_COUNT + count;
      totalPageViews = (metricsDoc?.totalPageViews || 0) + BASELINE_COUNT * 3;
    } else {
      // Local fallback with baseline
      totalUnique = BASELINE_COUNT + (is24hExpired ? 1 : 0);
      totalPageViews = BASELINE_COUNT * 3;
    }

    const response = NextResponse.json({
      recorded: true,
      uniqueVisitors: totalUnique,
      totalPageViews,
      isNew24hSession: is24hExpired,
    });

    // Set 24h expiration cookie
    response.cookies.set('last_visit_24h', now.toISOString(), {
      maxAge: 86400, // 24 hours in seconds
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error logging visitor view:', error);
    return NextResponse.json({ error: 'Failed to record visitor', uniqueVisitors: BASELINE_COUNT }, { status: 500 });
  }
}
