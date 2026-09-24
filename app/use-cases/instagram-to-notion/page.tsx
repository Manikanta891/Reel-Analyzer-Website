import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { StepAutoCarousel } from '@/components/landing/StepAutoCarousel';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Database,
  FolderTree,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Export Instagram Reels to Notion Database | Reel Analyzer',
  description:
    'Save and organize Instagram Reels into Notion databases with clean Markdown, tags, and creator backlinks. Free, local-first tool by Manikanta Sandula.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-to-notion',
  },
  keywords: [
    'Instagram Reels to Notion',
    'Export Instagram Reels to Notion Database',
    'Instagram Saved Reels to Notion',
    'Notion Second Brain Instagram',
    'Save Instagram Reels as Notes in Notion',
    'Manikanta Sandula',
    'Notion Video Knowledge Base',
  ],
  openGraph: {
    title: 'Export Instagram Reels to Notion Database | Reel Analyzer',
    description:
      'Save and organize Instagram Reels into Notion databases with clean Markdown, tags, and backlinks. Free & local-first by Manikanta Sandula.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-to-notion',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function InstagramToNotionPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Export Instagram Reels to Notion Databases and Workspaces',
    description:
      'A complete guide to importing Instagram saved reels, summaries, and tags directly into Notion databases and Second Brain templates using Reel Analyzer.',
    author: {
      '@type': 'Person',
      name: 'Manikanta Sandula',
      url: 'https://manikanta.co.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reel Analyzer',
      url: 'https://reelanalyzer.manikanta.co.in',
    },
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Database className="w-4 h-4" />
            <span>Notion Second Brain Integration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Export <span className="text-indigo-400">Instagram Reels</span> into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Notion Databases
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Organize all your saved tutorials, recipes, frameworks, and business playbooks directly inside Notion. <strong className="text-zinc-200">Reel Analyzer</strong> formats extracted reels with clean properties and Markdown ready for instant import.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
            >
              <span>Add to Chrome &mdash; 100% Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-xs sm:text-sm font-semibold border border-white/[0.08] flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Preview Markdown Vault</span>
            </Link>
          </div>
        </div>

        {/* 3 Core Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Database Properties</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-extracts Creator Handle, Source URL, Topic Domain, and Date as structured table properties.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Drag &amp; Drop Import</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Download your complete `.zip` vault and drag formatted Markdown notes directly into any Notion page.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Zero Cloud Intermediaries</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Runs locally in your browser. No 3rd-party servers reading your notes or Instagram session.
            </p>
          </div>
        </div>

        {/* Notion Markdown Representation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-bold text-zinc-200">
              Notion-Ready Markdown Format
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141e] border border-white/[0.08] space-y-3 font-mono text-xs shadow-xl">
            <div className="text-zinc-500">// Notion Page YAML Header</div>
            <div className="text-indigo-300">
              <span className="text-zinc-400">title:</span> &quot;PostgreSQL Index Optimization Strategies&quot;<br />
              <span className="text-zinc-400">creator:</span> &quot;@databasedev&quot;<br />
              <span className="text-zinc-400">domain:</span> [Backend, Databases]<br />
              <span className="text-zinc-400">source:</span> &quot;https://instagram.com/reel/xyz123&quot;
            </div>
            <div className="border-t border-white/[0.06] pt-3 text-zinc-300 space-y-1.5">
              <div className="font-bold text-zinc-100">## Key Implementation Framework</div>
              <div className="text-zinc-400">1. Prefer Partial B-Trees for queries with high-selectivity boolean filters.</div>
              <div className="text-zinc-400">2. Use `EXPLAIN ANALYZE` to compare buffer reads before adding composite indexes.</div>
            </div>
          </div>
        </div>

        {/* 3 Step Stepper */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
              How to Sync Reels to Notion in 3 Steps
            </h2>
            <p className="text-xs text-zinc-400">
              The fastest way to build a personal video reference library in Notion.
            </p>
          </div>

          <StepAutoCarousel
            steps={[
              {
                number: '01',
                title: 'Capture with 1-Click',
                desc: 'Open your saved Instagram reels on desktop and let Reel Analyzer summarize each one.',
                badge: 'Capture',
              },
              {
                number: '02',
                title: 'Export Markdown Vault',
                desc: 'Click Export in the web dashboard to download your organized notes with tags and YAML.',
                badge: 'Export',
              },
              {
                number: '03',
                title: 'Import to Notion',
                desc: 'Drag the Markdown notes into your Notion database or import via the Notion workspace menu.',
                badge: 'Sync',
              },
            ]}
          />
        </div>

        {/* CTA Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#12141e] to-purple-950/40 border border-indigo-500/20 text-center space-y-4 shadow-2xl">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100">
            Build Your Notion Knowledge Base from Reels
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            100% free and open workflow designed by Manikanta Sandula.
          </p>
          <div className="pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Get Reel Analyzer Free</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
