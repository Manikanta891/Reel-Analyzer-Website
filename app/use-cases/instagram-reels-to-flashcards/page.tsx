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
  GraduationCap,
  Layers,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Turn Instagram Reels into Study Flashcards | Reel Analyzer',
  description:
    'Convert educational Instagram Reels into interactive study flashcards and active recall notes. Free, local-first learning tool by Manikanta Sandula.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-reels-to-flashcards',
  },
  keywords: [
    'Instagram Reels to Flashcards',
    'Turn Instagram Reels into Study Notes',
    'Active Recall Instagram Reels',
    'Instagram Study Flashcards',
    'Educational Reels to Flashcards',
    'Manikanta Sandula',
    'Student Knowledge Base Instagram',
  ],
  openGraph: {
    title: 'Turn Instagram Reels into Study Flashcards | Reel Analyzer',
    description:
      'Convert educational Instagram Reels into interactive study flashcards and active recall notes. Free & local-first by Manikanta Sandula.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/instagram-reels-to-flashcards',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function InstagramToFlashcardsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Turn Instagram Reels into Interactive Study Flashcards',
    description:
      'Step-by-step guide to converting educational Instagram video reels into active recall flashcards and structured study notes using Reel Analyzer.',
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
            <GraduationCap className="w-4 h-4" />
            <span>Active Recall &amp; Micro-Learning</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Turn <span className="text-indigo-400">Instagram Reels</span> into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Study Flashcards
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop saving hundreds of educational reels you never review. <strong className="text-zinc-200">Reel Analyzer</strong> extracts core concepts, formulas, and Q&amp;A summaries into an interactive study deck with spaced repetition.
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
              <span>Launch Flashcard Deck</span>
            </Link>
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Active Recall Mode</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-formats key takeaways into question/answer test cards to test your retention instantly.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Topic Categorization</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Group flashcards by domain: Medicine, Engineering, Languages, History, Finance, or Coding.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">100% Offline &amp; Private</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All flashcards remain on your local machine in IndexedDB. Study anywhere with zero subscriptions.
            </p>
          </div>
        </div>

        {/* Visual Flashcard Example */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-bold text-zinc-200">
              Interactive Study Card Output
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-[#12141e] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-mono text-indigo-300">Domain: Psychology &amp; Habit Design</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                Card 1 of 12
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Concept Question</div>
              <p className="text-sm text-zinc-100 font-medium">
                What is the &quot;2-Minute Rule&quot; for overcoming procrastination in new habits?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090a0f] border border-white/[0.06] space-y-1.5">
              <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Key Answer &amp; Logic</div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Scale down any new habit so it takes under 2 minutes to start (e.g. &quot;Read 1 page&quot; instead of &quot;Study 3 hours&quot;). Establishing the ritual creates psychological momentum.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Walkthrough */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
              How to Build Your Study Deck in 3 Steps
            </h2>
            <p className="text-xs text-zinc-400">
              Fast, zero friction, and works directly on Instagram desktop.
            </p>
          </div>

          <StepAutoCarousel
            steps={[
              {
                number: '01',
                title: 'Open Educational Reel',
                desc: 'Browse saved educational reels or study accounts on Instagram desktop.',
                badge: 'Input',
              },
              {
                number: '02',
                title: 'Click 1-Click Analyze',
                desc: 'The extension extracts core mental models, definitions, and key takeaways.',
                badge: 'Extraction',
              },
              {
                number: '03',
                title: 'Study in Vault Deck',
                desc: 'Open the Knowledge Vault to flip through interactive study cards and test memory.',
                badge: 'Active Recall',
              },
            ]}
          />
        </div>

        {/* CTA Footer Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#12141e] to-purple-950/40 border border-indigo-500/20 text-center space-y-4 shadow-2xl">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100">
            Ready to Turn Saved Reels into Permanent Retention?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Install the free extension by Manikanta Sandula and build your personalized study deck today.
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
