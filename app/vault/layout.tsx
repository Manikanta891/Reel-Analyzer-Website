import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knowledge Vault — Reel Analyzer',
  description:
    'Browse, search, filter, and study your saved Instagram Reel AI summaries, frameworks, and Obsidian Markdown notes.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/vault',
  },
  openGraph: {
    title: 'Knowledge Vault — Reel Analyzer',
    description:
      'Browse, search, filter, and study your saved Instagram Reel AI summaries, frameworks, and Obsidian Markdown notes.',
    url: 'https://reelanalyzer.manikanta.co.in/vault',
  },
};

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
