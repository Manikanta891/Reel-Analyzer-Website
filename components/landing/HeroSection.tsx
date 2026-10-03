'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  FolderTree,
  BookOpen,
  Sparkles,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

const HERO_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: '100% Local & Private',
    desc: 'All summaries and notes reside securely in your browser storage.',
  },
  {
    icon: Zap,
    title: 'No account or signup required',
    desc: 'Powered by browser integration with zero subscriptions or tokens.',
  },
  {
    icon: FolderTree,
    title: 'Export to your note-taking apps',
    desc: 'Export clean Markdown files with organized file details and smart cross-linked tags.',
  },
];

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleAddToChrome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
    router.push('/vault');
  };

  // Auto-advance timer (3.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveHighlightIndex((prev) => (prev + 1) % HERO_HIGHLIGHTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="snap-section relative py-8 sm:py-10 md:py-12 overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-indigo-600/[0.07] blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5 mb-6 sm:mb-8 md:mb-10">
          {/* Top Badge: Sleek glassmorphism pill with live pulse beacon */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-indigo-950/70 border border-indigo-500/30 text-[11px] sm:text-xs text-zinc-200 shadow-[0_0_22px_rgba(99,102,241,0.18)] backdrop-blur-md">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="font-semibold text-white tracking-wide">
              Powered by Native Meta AI
            </span>
            <span className="text-indigo-400/50 hidden sm:inline">&bull;</span>
            <span className="text-indigo-200/90 hidden sm:inline font-medium">
              Deep Visual &amp; Action Understanding
            </span>
          </div>

          {/* Headline (SEO Optimized for 'Instagram Reels' & 'Reel Analyzer') */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-zinc-100 tracking-tight leading-[1.15] sm:leading-[1.12]">
            Turn <span className="text-indigo-400">Instagram Reels</span> into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Permanent Knowledge
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed px-2">
            The multimodal <strong className="text-zinc-200 font-semibold">Instagram Reels AI Summarizer</strong>. Unlike brittle OCR or audio-only transcribers, Reel Analyzer harnesses Meta AI to perceive what is actually shown on video—the creator, their actions, screen workflows, and code.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-sm sm:max-w-none mx-auto">
            <a
              href={CHROME_STORE_URL}
              onClick={handleAddToChrome}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>

            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-xs sm:text-sm font-semibold border border-white/[0.08] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" strokeWidth={1.5} />
              <span>Explore Saved Reels</span>
            </Link>
          </div>
        </div>

        {/* Desktop Feature Highlights Ribbon (3 columns) */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto pt-6 text-center">
          {HERO_HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="flex items-center justify-center gap-2 text-indigo-400 font-semibold text-sm">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipeable Snap Carousel (Single Card with Auto-Advance & Touch Dots) */}
        <div
          className="sm:hidden max-w-sm mx-auto pt-2 space-y-2.5"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center space-y-1.5 min-h-[96px] flex flex-col items-center justify-center transition-all duration-300 shadow-lg shadow-black/40">
            {React.createElement(HERO_HIGHLIGHTS[activeHighlightIndex].icon, {
              className: 'w-5 h-5 text-indigo-400 mb-0.5',
              strokeWidth: 1.5,
            })}
            <div className="text-xs font-bold text-indigo-300">
              {HERO_HIGHLIGHTS[activeHighlightIndex].title}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed px-2">
              {HERO_HIGHLIGHTS[activeHighlightIndex].desc}
            </p>
          </div>

          {/* Swipe Dots */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {HERO_HIGHLIGHTS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHighlightIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeHighlightIndex === idx
                    ? 'w-6 h-1.5 bg-indigo-500'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
