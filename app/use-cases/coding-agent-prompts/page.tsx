import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ToolAutoCarousel } from '@/components/landing/ToolAutoCarousel';
import {
  Terminal,
  ArrowRight,
  Code2,
  Cpu,
  Sparkles,
  ExternalLink,
  Zap,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Instagram Reels to AI Prompts (Cursor) | Reel Analyzer',
  description:
    'Turn Instagram Reel tutorials into prompts for Cursor IDE, Claude Code, and ChatGPT. Extract code snippets and system designs with Manikanta Sandula\'s tool.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/coding-agent-prompts',
  },
  keywords: [
    'Instagram Reels to AI Coding Prompts',
    'Extract Code from Instagram Reels',
    'Instagram Reel to Cursor IDE',
    'ChatGPT Instagram Reels Prompt',
    'Claude Code Instagram Prompt',
    'Manikanta Sandula',
    'Developer Reels Workflows',
  ],
  openGraph: {
    title: 'Instagram Reels to AI Prompts (Cursor) | Reel Analyzer',
    description:
      'Turn 60-second video tutorials into executable prompts for Cursor, ChatGPT, and Claude Code with 1 click.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/coding-agent-prompts',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function CodingAgentPromptsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Turn Instagram Reels into Prompts for AI Coding Agents',
    description:
      'A practical developer guide on transforming video tutorials into structured prompts for Cursor, Claude Code, and ChatGPT using Reel Analyzer by Manikanta Sandula.',
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
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Developer Interoperability Workflow</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop Saving AI Tutorials.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Turn Them into Coding Prompts.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Video is a dead end for developers. You can&apos;t copy code from a video or feed an MP4 into your IDE. Reel Analyzer extracts the architecture and code in one click so your agent can build it.
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

        {/* Live IDE Prompt Transformation Example */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Example: Reel Extraction to Cursor Prompt
            </span>
            <span className="font-mono text-[11px] text-emerald-400">Copy-Ready Format</span>
          </div>

          <div className="rounded-2xl bg-[#0e0f15] border border-white/[0.08] p-5 sm:p-7 font-mono text-xs sm:text-sm shadow-2xl space-y-4">
            <div className="text-xs text-zinc-500 flex items-center gap-2 pb-2 border-b border-white/[0.06]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-zinc-400 ml-2">Cursor / Claude Code Prompt</span>
            </div>

            <div className="text-zinc-300 space-y-2 leading-relaxed">
              <p className="text-indigo-300">
                &quot;Here is the architectural pattern extracted from an Instagram technical reel by Reel Analyzer:&quot;
              </p>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.04] text-zinc-400 text-xs space-y-1">
                <div><strong className="text-zinc-200">Architecture:</strong> Distributed Rate Limiter with Redis Token Bucket</div>
                <div><strong className="text-zinc-200">Key Logic:</strong> 10 requests/second per IP with sliding window Redis sorted set.</div>
                <div><strong className="text-zinc-200">Libraries:</strong> ioredis, express, rate-limiter-flexible</div>
              </div>
              <p className="text-emerald-300">
                &quot;Scaffold a TypeScript Express middleware implementing this exact token bucket pattern with unit tests.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Supported AI Coding Agents */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Supported AI Tools &amp; Agents
          </h2>

          <ToolAutoCarousel />
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
              Software and AI engineer designing local-first developer utilities. Built Reel Analyzer to bridge transient social media discovery into permanent Obsidian personal knowledge bases and AI coding workflows.
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
