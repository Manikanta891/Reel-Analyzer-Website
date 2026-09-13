import { ReelItem, TaxonomyTree } from '@/types';
import { INITIAL_SAMPLE_REELS } from './sampleData';

const REELS_STORAGE_KEY = 'reel_analyzer_data';

export function getStoredReels(): ReelItem[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_REELS;
  try {
    const raw = localStorage.getItem(REELS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_REELS));
      return INITIAL_SAMPLE_REELS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_REELS;
  } catch {
    return INITIAL_SAMPLE_REELS;
  }
}

export function saveStoredReels(reels: ReelItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(reels));
  } catch (err) {
    console.error('Failed to save reels in localStorage:', err);
  }
}

export function buildTaxonomyFromReels(reels: ReelItem[]): TaxonomyTree {
  const tree: TaxonomyTree = {};
  reels.forEach((item) => {
    const d = item.domain || 'General';
    const s = item.subdomain || 'General';
    if (!tree[d]) tree[d] = [];
    if (!tree[d].includes(s)) tree[d].push(s);
  });
  return tree;
}

/**
 * Direct Extension Bridge Communication
 */
export function requestExtensionData(): void {
  if (typeof window === 'undefined') return;
  window.postMessage(
    {
      source: 'REEL_ANALYZER_WEB',
      action: 'GET_REELS_DATA',
    },
    '*'
  );
}

export function subscribeToExtensionBridge(
  onDataReceived: (data: ReelItem[]) => void,
  onExtensionDetected?: () => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: MessageEvent) => {
    if (!event.data || event.data.source !== 'REEL_ANALYZER_EXT') return;

    if (event.data.action === 'EXTENSION_READY' || event.data.action === 'PONG_EXTENSION') {
      onExtensionDetected?.();
      // Immediately request current reels data
      requestExtensionData();
    } else if (event.data.action === 'SYNC_REELS_DATA') {
      if (Array.isArray(event.data.data) && event.data.data.length > 0) {
        onDataReceived(event.data.data);
      }
    }
  };

  window.addEventListener('message', handler);

  // Send initial ping
  window.postMessage({ source: 'REEL_ANALYZER_WEB', action: 'PING_EXTENSION' }, '*');
  requestExtensionData();

  return () => window.removeEventListener('message', handler);
}
