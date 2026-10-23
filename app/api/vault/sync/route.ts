import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ReelItem } from '@/types';
import { INITIAL_SAMPLE_REELS } from '@/lib/sampleData';

export const dynamic = 'force-dynamic';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'vault.json');

/**
 * Ensures the data directory and vault.json file exist
 */
async function ensureVaultFile(): Promise<void> {
  const dir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.access(DATA_FILE_PATH);
  } catch {
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(INITIAL_SAMPLE_REELS, null, 2),
      'utf-8'
    );
  }
}

/**
 * GET /api/vault/sync
 * Returns the current cached reels from data/vault.json
 */
export async function GET() {
  try {
    await ensureVaultFile();
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const reels: ReelItem[] = JSON.parse(raw);
    return NextResponse.json({
      success: true,
      count: reels.length,
      reels,
    });
  } catch (error) {
    console.error('Failed to read vault.json:', error);
    return NextResponse.json(
      { error: 'Failed to read vault data', reels: INITIAL_SAMPLE_REELS },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vault/sync
 * Syncs incoming reels from the browser dashboard or extension into data/vault.json
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incomingReels: ReelItem[] = body.reels || body.payload || [];

    if (!Array.isArray(incomingReels) || incomingReels.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty reels payload' },
        { status: 400 }
      );
    }

    await ensureVaultFile();

    // Read existing file to merge without destructive loss
    let existing: ReelItem[] = [];
    try {
      const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      existing = JSON.parse(raw);
    } catch {
      existing = [];
    }

    // Map by URL to deduplicate and update
    const urlMap = new Map<string, ReelItem>();
    existing.forEach((item) => {
      if (item.url) urlMap.set(item.url, item);
    });
    incomingReels.forEach((item) => {
      if (item.url) urlMap.set(item.url, item);
    });

    const merged = Array.from(urlMap.values());

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      totalCount: merged.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to sync vault.json:', error);
    return NextResponse.json(
      { error: 'Failed to write vault data' },
      { status: 500 }
    );
  }
}
