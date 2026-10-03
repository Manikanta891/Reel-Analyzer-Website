import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PillarAutoCarousel } from '@/components/landing/PillarAutoCarousel';
import { StepAutoCarousel } from '@/components/landing/StepAutoCarousel';
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ExternalLink,
  Check,
  X,
  Layers,
  FileCode2,
  Lock,
  Search,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const metadata: Metadata = {
  title: 'Free Instagram Reel Transcript Generator',
  description:
    'Extract free unlimited transcripts, AI summaries, and notes from Instagram Reels. Zero paywalls, no transcript limits, and 100% private.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/use-cases/free-instagram-reel-transcript',
  },
  keywords: [
    'Free Instagram Reel Transcript',
    'Instagram Reel Transcript Generator',
    'Extract Transcript from Instagram Reels',
    'iShort Alternative Free',
    'Skimming AI Alternative',
    'Saveto AI Alternative',
    'Memories AI Alternative',
    'Convert Instagram Reel to Text',
    'Free Instagram Video Transcriber',
    'Instagram Audio to Text Extension',
    'Manikanta Sandula',
  ],
  openGraph: {
    title: 'Free Instagram Reel Transcript Generator',
    description:
      'Extract free unlimited transcripts, code snippets, and notes from Instagram Reels. Zero paywalls and 100% private.',
    url: 'https://reelanalyzer.manikanta.co.in/use-cases/free-instagram-reel-transcript',
    images: ['https://reelanalyzer.manikanta.co.in/og-image.png'],
  },
};

export default function FreeInstagramReelTranscriptPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        name: 'How to Extract Unlimited Free Transcripts from Instagram Reels',
        description:
          'A comprehensive guide to generating accurate verbatim transcripts, code blocks, and structured summaries from Instagram Reels without monthly subscriptions or token limits.',
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
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Reel Analyzer',
        applicationCategory: 'ProductivityApplication, UtilityApplication',
        operatingSystem: 'Google Chrome, Brave, Microsoft Edge',
        url: 'https://reelanalyzer.manikanta.co.in',
        downloadUrl: CHROME_STORE_URL,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I extract a transcript from an Instagram Reel for free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Install the free Reel Analyzer extension on Chrome, Brave, or Edge. When viewing any Reel, open the extension in your browser side panel and click "Analyze Reel". Reel Analyzer extracts the complete verbatim transcript, key takeaways, and code snippets in under 5 seconds with zero API fees.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why do competitor tools like iShort limit users to only 10 free transcripts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most tools rely on expensive third-party cloud transcription APIs (like OpenAI Whisper or cloud speech APIs) on remote servers, forcing them to charge $10-$29/month to cover server costs. Reel Analyzer uses a local-first browser architecture with your existing Meta AI session, eliminating cloud compute costs and enabling 100% free, unlimited transcripts.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does Reel Analyzer compare to Skimming AI, Memories.ai, and iShort?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'While iShort and Saveto focus on raw CSV/text dumps and charge recurring monthly subscriptions, and Skimming AI limits interactive chat, Reel Analyzer provides structured Markdown notes with YAML metadata, Obsidian vault exports, flashcards, and syntax-highlighted code blocks for $0.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I export the transcripts into Obsidian or Notion?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Reel Analyzer allows you to download clean .md Markdown files with YAML frontmatter, tags, and creator attribution designed specifically for Obsidian, Notion, and Logseq.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://reelanalyzer.manikanta.co.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Use Cases',
            item: 'https://reelanalyzer.manikanta.co.in/#features',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Free Reel Transcript Generator',
            item: 'https://reelanalyzer.manikanta.co.in/use-cases/free-instagram-reel-transcript',
          },
        ],
      },
    ],
  };

  const comparisonData = [
    {
      feature: 'Price',
      reelAnalyzer: '100% Free Forever',
      ishort: '$10 – $29 / month',
      skimming: 'Monthly Subscription',
      memories: 'Freemium with limits',
      saveto: 'Paid exports',
      highlight: true,
    },
    {
      feature: 'Free Transcript Limit',
      reelAnalyzer: 'Unlimited',
      ishort: 'Only 10 free (one-time)',
      skimming: 'Strict daily quota',
      memories: 'Limited notes',
      saveto: 'Capped word count',
      highlight: true,
    },
    {
      feature: 'Workflow Location',
      reelAnalyzer: 'Browser Side Panel (Instant)',
      ishort: 'Browser Extension',
      skimming: 'External Web App',
      memories: 'Web / Mobile App',
      saveto: 'External Web App',
    },
    {
      feature: 'Obsidian / Markdown Export',
      reelAnalyzer: 'Full .md + YAML Vault (.zip)',
      ishort: 'CSV only',
      skimming: 'Text copy only',
      memories: 'Proprietary app',
      saveto: 'Plain TXT',
    },
    {
      feature: 'Code Snippet Extraction',
      reelAnalyzer: 'Formatted code blocks',
      ishort: 'Unformatted text',
      skimming: 'Unformatted text',
      memories: 'Summary only',
      saveto: 'Raw transcript only',
    },
    {
      feature: 'Privacy & Storage',
      reelAnalyzer: '100% Local (IndexedDB)',
      ishort: 'Cloud Server Tracking',
      skimming: 'Cloud Database',
      memories: 'Cloud Database',
      saveto: 'Cloud Processing',
    },
    {
      feature: 'Zero API Key Required',
      reelAnalyzer: 'Yes (No tokens needed)',
      ishort: 'No (Paid accounts)',
      skimming: 'No (Paid accounts)',
      memories: 'No (Paid accounts)',
      saveto: 'No (Paid accounts)',
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0b0c10] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNavbar />

      <main className="flex-1 w-full max-w-5xl min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-10 sm:space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free &amp; Unlimited Audio-to-Text</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight px-2">
            Free Instagram Reel{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Transcript Generator
            </span>{' '}
            &amp; AI Notes
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Extract accurate verbatim transcripts, step-by-step frameworks, and code snippets from any Instagram Reel. No 10-transcript paywalls, no $29/month subscriptions, and zero paid API keys.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <span>Add to Chrome — 100% Free</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-sm font-semibold border border-white/[0.08] flex items-center justify-center gap-2 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <span>View Your Saved Reels</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Highlights / Why Different */}
        <PillarAutoCarousel
          pillars={[
            {
              iconName: 'zap',
              title: 'No 10-Transcript Cap',
              desc: 'Tired of extensions locking you out after 10 transcripts? Reel Analyzer gives you completely unrestricted, unlimited extractions.',
              iconColor: 'text-indigo-400',
              iconBg: 'bg-indigo-500/10',
              iconBorder: 'border-indigo-500/20',
            },
            {
              iconName: 'fileCode2',
              title: 'Formatted Code & Frameworks',
              desc: "Don't just settle for messy wall-of-text transcripts. Get clean Markdown with syntax-highlighted code blocks, mental models, and tags.",
              iconColor: 'text-indigo-400',
              iconBg: 'bg-indigo-500/10',
              iconBorder: 'border-indigo-500/20',
            },
            {
              iconName: 'shieldCheck',
              title: '100% Local & Private',
              desc: "Your saved reels and generated notes are stored directly in your browser's IndexedDB. We never track or sell your browsing history.",
              iconColor: 'text-indigo-400',
              iconBg: 'bg-indigo-500/10',
              iconBorder: 'border-indigo-500/20',
            },
          ]}
        />

        <div className="space-y-5">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Honest Comparison
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reel Analyzer vs. iShort, Skimming AI &amp; Memories.ai
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              See how Reel Analyzer compares directly to competing transcription and summarizer tools.
            </p>
          </div>

          {/* Scroll hint on mobile */}
          <p className="text-[11px] text-zinc-500 text-center sm:hidden">← Scroll to see full comparison →</p>

          <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#12131a] shadow-2xl [overscroll-behavior-x:contain]">
            <table className="w-full text-left text-xs border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#161822]">
                  <th className="py-3.5 px-4 font-semibold text-zinc-400 w-[28%]">Feature</th>
                  <th className="py-3.5 px-4 font-bold text-indigo-300 bg-indigo-500/[0.08] border-x border-indigo-500/20 w-[24%]">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Reel Analyzer</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-medium text-zinc-400">iShort</th>
                  <th className="py-3.5 px-3 font-medium text-zinc-400">Skimming AI</th>
                  <th className="py-3.5 px-3 font-medium text-zinc-400">Memories.ai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3 px-4 font-medium text-zinc-300">{row.feature}</td>
                    <td className="py-3 px-4 font-semibold text-white bg-indigo-500/[0.05] border-x border-indigo-500/20">
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        {row.reelAnalyzer}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {row.ishort.includes('10') || row.ishort.includes('$') ? (
                        <span className="text-amber-400/90">{row.ishort}</span>
                      ) : (
                        row.ishort
                      )}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{row.skimming}</td>
                    <td className="py-3 px-3 text-zinc-400">{row.memories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-Step Practical Workflow */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              How to Get Instagram Reel Transcripts in 3 Steps
            </h2>
            <p className="text-xs text-zinc-400">
              No need to copy/paste URLs into third-party websites. It happens right inside Instagram.
            </p>
          </div>

          <StepAutoCarousel
            steps={[
              {
                number: '01',
                title: 'Open Any Instagram Reel',
                desc: 'Browse Instagram on your desktop browser. Open any public reel, tutorial, or saved clip from your collection.',
              },
              {
                number: '02',
                title: 'Click 1-Click Analyze',
                desc: "Reel Analyzer runs in Chrome's native Side Panel. Click Analyze to automatically parse audio, captions, and visual slides into clean text.",
              },
              {
                number: '03',
                title: 'Copy Transcript or Export',
                desc: 'Copy the verbatim transcript directly, prompt AI tools like ChatGPT/Cursor, or export an organized Obsidian vault (.zip) with YAML frontmatter.',
              },
            ]}
          />
        </div>

        {/* Why Most Transcribers Charge & Why Reel Analyzer is Free */}
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-b from-[#141520] to-[#0f1017] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Architecture &amp; Free Tier Transparency</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Why do other tools charge $10&ndash;$29/month while Reel Analyzer is 100% Free?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Most transcription services (like iShort, Saveto, and cloud scrapers) send video files to expensive GPU servers to run models like OpenAI Whisper. Because each transcription costs them server bandwidth and compute, they enforce strict quotas (like iShort&apos;s 10-transcript limit) and push recurring subscriptions.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200">Reel Analyzer works differently:</strong> By orchestrating transcription directly in your local browser session using Meta AI&apos;s native multimodal capabilities, we have zero cloud server compute costs. We pass that freedom directly to you: unlimited transcripts, zero subscriptions, and 100% privacy.
          </p>
        </div>

        {/* Internal Cross Links */}
        <div className="border-t border-white/[0.06] pt-10 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Explore Related Reel Analyzer Workflows
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link
              href="/use-cases/instagram-to-obsidian"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
            >
              <span className="text-zinc-300 group-hover:text-white">Instagram to Obsidian Export</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
            <Link
              href="/use-cases/instagram-reel-scraper"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
            >
              <span className="text-zinc-300 group-hover:text-white">Reel Scraper &amp; Transcripts</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
            <Link
              href="/use-cases/coding-agent-prompts"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
            >
              <span className="text-zinc-300 group-hover:text-white">AI Prompts for Cursor IDE</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Author Card (E-E-A-T) */}
        <div className="p-5 sm:p-8 rounded-2xl bg-[#12131a] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl shrink-0">
            MS
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-100">Built by Manikanta Sandula</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              AI &amp; software engineer creating privacy-first developer tools and browser extensions. Reel Analyzer was created to give creators, developers, and researchers an honest, unmetered alternative to paywalled transcription tools.
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-xs text-indigo-400">
              <a href="https://manikanta.co.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio
              </a>
              <span>&bull;</span>
              <a href="https://github.com/Manikanta891" target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
              <span>&bull;</span>
              <a href="https://www.linkedin.com/in/manikantasandula/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
