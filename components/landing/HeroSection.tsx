'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  FolderTree,
  ChevronDown,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-12 pb-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center my-auto space-y-7">
        {/* Top Feature Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/[0.1] text-xs text-zinc-300 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-xs text-zinc-200">
            Powered by Meta AI &bull; 100% Free &amp; Local-First
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
          Turn Instagram Reels into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-indigo-200 to-purple-400">
            Structured Knowledge Notes
          </span>
        </h1>

        {/* Concise Subheading */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Extract concepts, code snippets, and frameworks automatically into organized topic playbooks directly in your browser.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-brand-600/25 transition-all duration-150 active:scale-[0.98]"
          >
            <span>Add to Chrome &mdash; Free</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </a>

          <Link
            href="/vault"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-sm font-semibold border border-white/[0.1] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          >
            <span>Open Knowledge Vault</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap pt-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            <span>100% Local-First Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
            <span>Zero API Keys Required</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-brand-400" strokeWidth={1.5} />
            <span>Auto-Categorized Notes</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#how-it-works"
        className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 text-xs font-mono transition-colors pt-4"
      >
        <span>Scroll to see pipeline</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
