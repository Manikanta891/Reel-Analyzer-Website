import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { StepAutoCarousel } from '@/components/landing/StepAutoCarousel';
import {
  FolderTree,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  FileText,
  Tag,
  CheckCircle2,
  Share2,
  ExternalLink,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Export Instagram Reels to Obsidian Notes | Reel Analyzer',
  description:
    'Convert Instagram Reels into Obsidian Markdown notes with YAML frontmatter and bi-directional backlinks. Free, local-first tool by Manikanta Sandula.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-to-obsidian',
  },
  keywords: [
    'Instagram Reels to Obsidian',
    'Export Instagram Reels to Markdown',
    'Instagram Video to Obsidian Notes',
    'Obsidian PKM Instagram Reels',
    'Instagram Saved Reels to Markdown',
    'Manikanta Sandula',
    'Personal Knowledge Management Instagram',
  ],
  openGraph: {
    title: 'Export Instagram Reels to Obsidian Notes | Reel Analyzer',
    description:
      'Convert Instagram Reels into Obsidian Markdown notes with YAML frontmatter and backlinks. Free & local-first by Manikanta Sandula.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-to-obsidian',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function InstagramToObsidianPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Export Instagram Reels to Obsidian Markdown Notes',
    description:
      'A complete step-by-step guide to turning Instagram video tutorials into structured, searchable Obsidian notes using Reel Analyzer.',
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
            <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
            <span>Personal Knowledge Management (PKM)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Turn Saved Instagram Reels into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Obsidian Markdown Notes
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop letting valuable tutorials, system design breakdowns, and frameworks get trapped inside video. Reel Analyzer transforms any Instagram Reel into clean, structured Markdown ready for Obsidian.
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

        {/* Live YAML Frontmatter Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Standard Obsidian Export Format (.md)
            </span>
            <span className="font-mono text-[11px] text-indigo-300">YAML Frontmatter + Markdown</span>
          </div>

          <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-7 font-mono text-xs sm:text-sm text-zinc-300 shadow-2xl relative overflow-x-auto leading-relaxed">
            <div className="text-zinc-500">---</div>
            <div><span className="text-indigo-400">title:</span> &quot;FastAPI Authentication &amp; JWT Tokens Guide&quot;</div>
            <div><span className="text-indigo-400">creator:</span> &quot;@techlead_dev&quot;</div>
            <div><span className="text-indigo-400">domain:</span> Technology</div>
            <div><span className="text-indigo-400">tags:</span> [python, backend, jwt, fastapi, architecture]</div>
            <div><span className="text-indigo-400">source:</span> &quot;https://instagram.com/reel/...&quot;</div>
            <div><span className="text-indigo-400">created_by:</span> Reel Analyzer by Manikanta Sandula</div>
            <div className="text-zinc-500 mb-4">---</div>

            <div className="text-indigo-300 font-bold text-base mb-2"># FastAPI Authentication &amp; JWT Tokens Guide</div>
            <div className="text-zinc-400 mb-3"><span className="text-zinc-200 font-semibold">## Core Takeaway:</span> Stateless authentication pattern separating refresh and access tokens for high-throughput APIs.</div>
            
            <div className="text-indigo-300 font-bold mb-2">## Step-by-Step Framework</div>
            <div className="text-zinc-400 space-y-1 pl-4 mb-4">
              <div>1. Generate 15-minute access token signed with HS256 algorithm.</div>
              <div>2. Store 7-day refresh token in HttpOnly SameSite cookie.</div>
              <div>3. Validate authorization header on protected middleware routes.</div>
            </div>

            <div className="text-indigo-300 font-bold mb-2">## Tools &amp; Libraries Mentioned</div>
            <div className="text-zinc-400 pl-4 mb-2">
              <div>- `python-jose` for JWT signing and decoding</div>
              <div>- `passlib[bcrypt]` for password hashing</div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            How It Works in 3 Simple Steps
          </h2>

          <StepAutoCarousel />
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
              Software and AI engineer designing local-first developer utilities. Built Reel Analyzer to bridge transient social media discovery into permanent Obsidian personal knowledge bases.
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
