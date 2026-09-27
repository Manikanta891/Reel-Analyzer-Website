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
  Bookmark,
  Flame,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Video,
  Target,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Instagram Reels Viral Hook Swipe File | Reel Analyzer',
  description:
    'Turn Instagram Reels into a viral hook swipe file. Extract opening formulas, retention pacing, and script blueprints in 1 click. 100% free & local.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/viral-hooks-swipe-file',
  },
  keywords: [
    'Instagram Reels Hook Swipe File',
    'Extract Viral Hooks from Instagram Reels',
    'Instagram Reel Script Breakdown',
    'Creator Swipe File Generator',
    'Viral Hook Formulas Instagram',
    'Analyze Competitor Reels',
    'Instagram Reels Script Analyzer',
    'Turn Reels into Creator Playbooks',
    'Manikanta Sandula',
  ],
  openGraph: {
    title: 'Instagram Reels Viral Hook Swipe File | Reel Analyzer',
    description:
      'Turn Instagram Reels into a viral hook swipe file. Extract opening formulas, retention pacing, and script blueprints in 1 click. 100% free & local.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/viral-hooks-swipe-file',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function ViralHooksSwipeFilePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Build a Viral Hooks Swipe File from Instagram Reels',
    description:
      'A step-by-step creator guide to extracting viral hook formulas, retention pacing, and script blueprints from Instagram Reels with Reel Analyzer.',
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Content Creator &amp; Growth Marketer Workflow</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Build a <span className="text-amber-400">Viral Hooks Swipe File</span> from{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-white to-orange-300">
              Instagram Reels
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing what makes 1,000,000+ view reels work. <strong className="text-zinc-200">Reel Analyzer</strong> breaks down competitor reels into hook formulas, retention triggers, visual pacing, and script blueprints in one click.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
            >
              <span>Add to Chrome &mdash; 100% Free</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#14151e] hover:bg-[#1a1c26] text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold border border-white/[0.08] flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Creator Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Account Login Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Local Analysis</span>
            </div>
          </div>
        </div>

        {/* Live Swipe File Breakdown Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-200 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              Extracted Hook Formula &amp; Script Breakdown (.md)
            </span>
            <span className="font-mono text-[11px] text-amber-300">Creator Swipe File Format</span>
          </div>

          <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-7 font-mono text-xs sm:text-sm text-zinc-300 shadow-2xl relative overflow-x-auto leading-relaxed">
            <div className="text-zinc-500">---</div>
            <div><span className="text-amber-400">hook_type:</span> &quot;Negative Constraint / Secret Reveal&quot;</div>
            <div><span className="text-amber-400">hook_text:</span> &quot;Stop building full stack apps with 10 different tools. Here is the 1 stack that made me $40k.&quot;</div>
            <div><span className="text-amber-400">target_audience:</span> Junior to mid-level developers, solopreneurs</div>
            <div><span className="text-amber-400">retention_mechanism:</span> &quot;Visual countdown + Bullseye Proof at 0:18&quot;</div>
            <div><span className="text-amber-400">tags:</span> [hooks, creator-economy, viral-formula, tech-marketing]</div>
            <div className="text-zinc-500 mb-4">---</div>

            <div className="text-amber-300 font-bold text-base mb-2"># Hook Anatomy &amp; Viral Breakdown</div>
            
            <div className="text-zinc-400 mb-3">
              <span className="text-zinc-200 font-semibold">1. The 3-Second Hook:</span>
              <div className="pl-4 text-zinc-300 mt-1">
                &ldquo;Stop building full stack apps with 10 different tools...&rdquo; <br/>
                <span className="text-zinc-500 text-[11px]">&rarr; Pattern Interrupt (Negative Constraint) + Curiosity Gap</span>
              </div>
            </div>

            <div className="text-zinc-400 mb-3">
              <span className="text-zinc-200 font-semibold">2. Retention Anchor (0:04 - 0:25):</span>
              <div className="pl-4 text-zinc-300 mt-1">
                Contrasts traditional complex AWS/Docker setups against a unified framework (Next.js + Supabase + Tailwind). Keeps eyes glued with rapid screen transitions every 1.8 seconds.
              </div>
            </div>

            <div className="text-zinc-400 mb-2">
              <span className="text-zinc-200 font-semibold">3. The High-Converting CTA (0:45):</span>
              <div className="pl-4 text-zinc-300 mt-1">
                &ldquo;Comment STACK and I&apos;ll DM you the starter template for free.&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* Why Creators Need a Dedicated Swipe File */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-[#12131a] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Deconstruct Viral Hooks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Identify proven opening frameworks: Pattern Interrupts, Contrarian Claims, Numbers Hooks, and Open Loops that stop the infinite scroll.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12131a] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Export to Notion &amp; Obsidian</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Organize your swipe file with YAML frontmatter tags for niche, audience, retention mechanism, and call-to-action type.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12131a] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Script Your Next Video in Minutes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use tested pacing structures and visual cues to write high-retention short-form video scripts without staring at a blank screen.
            </p>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              How to Build Your Swipe File in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              From discovering a viral reel to a categorized swipe file entry in seconds.
            </p>
          </div>

          <StepAutoCarousel />
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-5 rounded-xl bg-[#12131a] border border-white/[0.08] space-y-2">
              <h3 className="text-sm font-bold text-zinc-200">
                Can I analyze competitor reels without them knowing?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes. Reel Analyzer operates 100% locally in your Chrome browser. It does not send notifications, ping external servers, or alert the reel creator in any way.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#12131a] border border-white/[0.08] space-y-2">
              <h3 className="text-sm font-bold text-zinc-200">
                How does it identify the hook formula and retention mechanisms?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Reel Analyzer uses intelligent transcription and semantic analysis to dissect the first 3 seconds of the reel, segment the pacing transitions, and tag the specific psychological trigger used (e.g., Fear of Missing Out, Negative Constraint, Curiosity Gap).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#12131a] border border-white/[0.08] space-y-2">
              <h3 className="text-sm font-bold text-zinc-200">
                Is Reel Analyzer free to use for creators?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes, Reel Analyzer is completely free and local-first. No subscriptions, no credits, and no API keys required.
              </p>
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
              Software engineer and creator tools architect. Built Reel Analyzer to turn fleeting social media inspiration into structured, actionable swipe files and permanent knowledge assets.
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
