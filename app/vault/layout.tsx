import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Knowledge Vault — Saved Instagram Reels | Reel Analyzer',
  },
  description:
    'Browse, search, filter, and study your saved Instagram Reel AI summaries, frameworks, and Obsidian Markdown notes.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/vault',
  },
  openGraph: {
    title: 'Knowledge Vault — Saved Instagram Reels | Reel Analyzer',
    description:
      'Browse, search, filter, and study your saved Instagram Reel AI summaries, frameworks, and Obsidian Markdown notes.',
    url: 'https://reelanalyzer.manikanta.co.in/vault',
  },
};

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
