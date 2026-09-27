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
  Code2,
  Terminal,
  Cpu,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Extract Code & Snippets from Instagram Reels | Reel Analyzer',
  description:
    'Extract clean syntax-highlighted code snippets from Instagram Reels without pausing or manual typing. Free, local-first developer tool by Manikanta Sandula.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/extract-code-from-instagram',
  },
  keywords: [
    'Extract Code from Instagram Reels',
    'Instagram Reels Code Snippet Extractor',
    'Copy Code from Instagram Video',
    'Developer Reels Code Scraper',
    'Instagram Video OCR Code',
    'Manikanta Sandula',
    'Turn Video Code into Markdown',
  ],
  openGraph: {
    title: 'Extract Code & Snippets from Instagram Reels | Reel Analyzer',
    description:
      'Extract clean code snippets from Instagram Reels without pausing or typing. Free & local-first by Manikanta Sandula.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/extract-code-from-instagram',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function ExtractCodeFromInstagramPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Extract Clean Code Blocks and Snippets from Instagram Reels',
    description:
      'A complete developer guide to extracting syntax-highlighted code, shell commands, and framework logic from Instagram video tutorials using Reel Analyzer.',
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
            <Terminal className="w-4 h-4" />
            <span>Developer Code OCR &amp; Syntax Extractor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Extract <span className="text-indigo-400">Clean Code</span> from{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Instagram Reels
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Never pause at 0:24 to manually re-type 6 lines of code from a reel. <strong className="text-zinc-200">Reel Analyzer</strong> extracts formatted, syntax-highlighted code blocks, CLI flags, and architectural patterns directly into your clipboard.
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
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Explore Code Vault</span>
            </Link>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Syntax-Highlighted Blocks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-formats JavaScript, TypeScript, Python, CSS, SQL, and Shell scripts in clean Markdown.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Zero Typo Transcription</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Eliminates transcription mistakes in variable names, regex patterns, or API endpoints.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">100% Free &amp; Private</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Runs in your local browser session. No API tokens, subscriptions, or telemetry required.
            </p>
          </div>
        </div>

        {/* Visual Code Box Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-bold text-zinc-200">
              Clean Extracted Code Output
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-zinc-500">// Extracted from @css_wizard Reel</span>
              <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                CSS / Tailwind
              </span>
            </div>
            <pre className="text-indigo-200 bg-[#07080c] p-4 rounded-xl border border-white/[0.06] overflow-x-auto leading-relaxed">
{`.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`}
            </pre>
          </div>
        </div>

        {/* Stepper */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
              How to Extract Code in 3 Steps
            </h2>
            <p className="text-xs text-zinc-400">
              Copy code from any developer reel without stopping your build flow.
            </p>
          </div>

          <StepAutoCarousel
            steps={[
              {
                number: '01',
                title: 'Open Developer Reel',
                desc: 'Browse any coding trick, Tailwind snippet, or Python automation reel on Instagram.',
                badge: 'Browse',
              },
              {
                number: '02',
                title: 'Click Extract Code',
                desc: 'Reel Analyzer extracts the exact code block, logic breakdown, and dependencies.',
                badge: 'Extract',
              },
              {
                number: '03',
                title: 'Paste into IDE / Cursor',
                desc: 'Click Copy to clipboard and drop directly into VS Code, Cursor, or your terminal.',
                badge: 'Paste',
              },
            ]}
          />
        </div>

        {/* CTA Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#12141e] to-purple-950/40 border border-indigo-500/20 text-center space-y-4 shadow-2xl">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100">
            Start Extracting Code from Reels in Seconds
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            100% free Chrome extension built for developers by Manikanta Sandula.
          </p>
          <div className="pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Install Reel Analyzer Free</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
