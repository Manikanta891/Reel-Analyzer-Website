import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  FileCode2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  ExternalLink,
  Database,
  Lock,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Free Instagram Reel Scraper & Transcriber | Reel Analyzer',
  description:
    'Scrape clean transcripts, code, and captions from Instagram Reels without API keys or Python scripts. Free, local-first extension by Manikanta Sandula.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-reel-scraper',
  },
  keywords: [
    'Instagram Reel Scraper',
    'Extract Transcript from Instagram Reels',
    'Instagram Video Text Scraper',
    'Instagram Reel Data Extractor',
    'Scrape Instagram Reels without API',
    'Instagram Video to Text',
    'Free Instagram Scraper Chrome Extension',
    'Manikanta Sandula',
  ],
  openGraph: {
    title: 'Free Instagram Reel Scraper & Transcriber | Reel Analyzer',
    description:
      'Scrape clean transcripts, code, and captions from Instagram Reels without API keys or Python scripts. Free & local-first by Manikanta Sandula.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-reel-scraper',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function InstagramReelScraperPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Scrape Transcripts and Text from Instagram Reels in 1 Click',
    description:
      'A practical guide to extracting clean text, audio transcripts, and structured notes from Instagram Reels using the Reel Analyzer Chrome extension by Manikanta Sandula.',
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
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>Browser-Native Video Data Extractor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Free Instagram Reel Scraper &amp;{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              AI Transcript Extractor
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            No Python scrapers. No RapidAPI subscriptions. No account bans. Reel Analyzer runs 100% locally in your browser, using Meta AI to parse any public or saved Instagram Reel in under 5 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-xs sm:text-sm font-semibold border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <span>Explore Knowledge Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Comparison: Reel Analyzer vs Traditional Scrapers */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            Reel Analyzer vs. Traditional Python / API Scrapers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 sm:p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/20 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <span>Traditional Scrapers (Selenium / Instaloader)</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li>❌ Requires session cookies &amp; risks account shadowbans</li>
                <li>❌ Breaks every time Instagram updates DOM classes</li>
                <li>❌ Expensive third-party API monthly quotas</li>
                <li>❌ Dumps raw audio files without semantic structuring</li>
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-indigo-500/[0.05] border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Reel Analyzer (Local-First AI Extraction)</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2">
                <li>✅ 100% Client-Side in your existing Chrome browser</li>
                <li>✅ Zero API keys or tokens required &mdash; 100% Free</li>
                <li>✅ Extracts key insights, code snippets, and frameworks</li>
                <li>✅ One-click export to Markdown, Obsidian, and Notion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* E-E-A-T Author Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#12131a] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl shrink-0">
            MS
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-100">
              Built by Manikanta Sandula
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Software and AI engineer designing local-first developer utilities. Built Reel Analyzer to provide a clean, secure, and privacy-respecting alternative to unreliable cloud scrapers.
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-xs text-indigo-400">
              <a href="https://manikanta.co.in" target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>
              <span>&bull;</span>
              <a href="https://github.com/Manikanta891" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
              <span>&bull;</span>
              <a href="https://www.linkedin.com/in/manikantasandula/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
