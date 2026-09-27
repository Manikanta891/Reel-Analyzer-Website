'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Lock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: FolderTree,
    title: 'Export Clean Notes',
    desc: 'Download clean Markdown files ready for Obsidian, Notion, Apple Notes, or any note app—complete with tags and creator info.',
    snippet: (
      <div className="rounded-xl bg-[#0e0f14] p-2.5 sm:p-3 border border-white/[0.06] font-mono text-[11px] text-zinc-400 space-y-1">
        <div className="text-zinc-500">// Auto-generated Note</div>
        <div><span className="text-indigo-400">tags:</span> [#web-development, #system-design]</div>
        <div><span className="text-indigo-400">creator:</span> @techlead &bull; <span className="text-indigo-400">source:</span> Instagram Reel</div>
      </div>
    ),
  },
  {
    icon: BookOpen,
    title: 'Instant Search & Tags',
    desc: 'Quickly search through all your saved notes by keyword, creator, or topic to find any tip or concept in seconds.',
    snippet: (
      <div className="rounded-xl bg-[#0e0f14] border border-white/[0.06] p-2.5 sm:p-3 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
        <span className="text-indigo-300 font-semibold">⚡ Instant Keyword Search</span>
        <span className="bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">Topic Filters</span>
      </div>
    ),
  },
  {
    icon: Code2,
    title: 'Capture Code & Key Takeaways',
    desc: 'Automatically extract code snippets, step-by-step instructions, and key takeaways without missing important details.',
    snippet: (
      <div className="rounded-xl bg-[#0e0f14] p-2.5 sm:p-3 border border-white/[0.06] font-mono text-[11px] text-zinc-300 flex items-center justify-between">
        <code>git commit -m &quot;feat: smart note capture&quot;</code>
        <span className="text-indigo-400 text-[10px] font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">Code Snippet</span>
      </div>
    ),
  },
  {
    icon: Lock,
    title: '100% Private & On Your Device',
    desc: 'Everything stays safely in your local browser. No cloud databases, no accounts required, and zero tracking.',
    snippet: (
      <div className="rounded-xl bg-[#0e0f14] p-2.5 sm:p-3 border border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span className="text-indigo-300 font-semibold">🔒 100% Local Storage</span>
        <span className="text-zinc-500">Private &amp; Offline</span>
      </div>
    ),
  },
];

export const FeaturesSection: React.FC = () => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance timer for mobile carousel (3.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % FEATURES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="features"
      className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#0b0c10] border-t border-white/[0.06] relative min-h-0 md:min-h-screen md:flex md:items-center md:justify-center"
    >
      <div className="w-full max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-white/[0.03] text-indigo-400 border border-white/[0.08] inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Smart Note-Taking</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Smart Note-Taking &amp; AI Prompts for Instagram Reels
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Stop losing valuable tutorials in your saved feed. Turn <strong className="text-zinc-300">Instagram Reels</strong> into clear, organized notes that you can search anytime.
          </p>
        </div>

        {/* MOBILE SWIPEABLE CAROUSEL (md:hidden) */}
        <div
          className="md:hidden space-y-3.5"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Active Card */}
          <div className="rounded-2xl bg-[#12131a] border border-white/[0.08] p-5 flex flex-col justify-between space-y-4 min-h-[260px] shadow-2xl transition-all duration-300">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  {React.createElement(FEATURES[activeFeatureIndex].icon, {
                    className: 'w-4 h-4',
                    strokeWidth: 1.5,
                  })}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  {activeFeatureIndex + 1} / {FEATURES.length}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-100">
                {FEATURES[activeFeatureIndex].title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {FEATURES[activeFeatureIndex].desc}
              </p>
            </div>

            <div>{FEATURES[activeFeatureIndex].snippet}</div>
          </div>

          {/* Controls: Left/Right Arrows + Dots */}
          <div className="flex items-center justify-between px-2 pt-1">
            <button
              onClick={() =>
                setActiveFeatureIndex((prev) => (prev === 0 ? FEATURES.length - 1 : prev - 1))
              }
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {FEATURES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    activeFeatureIndex === idx
                      ? 'w-6 h-1.5 bg-indigo-500'
                      : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to feature ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setActiveFeatureIndex((prev) => (prev + 1) % FEATURES.length)
              }
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
              aria-label="Next feature"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DESKTOP EQUAL-SIZED 2X2 GRID LAYOUT (hidden md:grid) */}
        <div className="hidden md:grid md:grid-cols-2 gap-5 items-stretch">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#12131a] border border-white/[0.06] hover:border-white/[0.12] p-5 flex flex-col justify-between space-y-3.5 transition-all duration-200 group"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div>{item.snippet}</div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to enter Vault */}
        <div className="text-center pt-2">
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Launch Knowledge Studio Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
