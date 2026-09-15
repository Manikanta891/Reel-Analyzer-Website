'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  FolderTree,
  Tag,
  FileText,
  Play,
  RotateCw,
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0c10] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[360px] bg-indigo-600/[0.06] blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-white/[0.03] text-indigo-400 border border-white/[0.08] inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Interactive Knowledge Flow</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            How Video Becomes Structured Insight
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            From quick video consumption to clean, queryable Markdown notes and study flashcards.
          </p>
        </div>

        {/* 3-Stage Pipeline Container */}
        <div className="rounded-2xl bg-[#12131a] border border-white/[0.06] p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* STAGE 1: Phone Card (Instagram Reel) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="relative w-[185px] sm:w-[200px] h-[360px] sm:h-[390px] rounded-[36px] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] border-4 border-[#1c1e28] bg-black">
                  <Image
                    src="/phone-card.png"
                    alt="Instagram Reel Phone Card"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Subtle glare overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating badge inside phone */}
                  <div className="absolute bottom-4 left-3 right-3 p-2.5 rounded-xl bg-[#12131a]/95 backdrop-blur-md border border-white/[0.1] text-left">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-200 font-semibold">
                      <Bookmark className="w-3 h-3 text-pink-400" />
                      <span>Instagram Reel</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                      Fast-paced technical breakdown
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  01. Capture
                </span>
                <p className="text-xs text-zinc-400">
                  Click the Reel Analyzer icon while browsing Instagram
                </p>
              </div>
            </div>

            {/* STAGE 2: Reel Analyzer Engine */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-4 px-2">
              <div className="w-full max-w-[240px] p-6 rounded-2xl bg-[#161822] border border-white/[0.08] shadow-xl space-y-4 flex flex-col items-center">
                {/* Glowing Logo Icon */}
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/[0.1] bg-[#12131a] flex items-center justify-center shadow-lg">
                  <Image
                    src="/logos/icon-128.png"
                    alt="Reel Analyzer Logo"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Brand Text */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                    Synthesis Engine
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Extracts transcripts, code &amp; Q&amp;A
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Real-Time Parsing</span>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <span>Structuring Note</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  02. AI Synthesis
                </span>
                <p className="text-xs text-zinc-400">
                  Separates core concepts, action steps, and code
                </p>
              </div>
            </div>

            {/* STAGE 3: Structured Knowledge Studio Card */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="w-full max-w-sm rounded-2xl bg-[#161822] border border-white/[0.08] p-5 shadow-xl text-left space-y-3.5">
                {/* Domain & Subdomain Taxonomy */}
                <div className="space-y-2 border-b border-white/[0.06] pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold">
                      <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Domain:</span>
                      <span className="text-zinc-100 font-bold">Engineering</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
                      Obsidian Ready
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pl-5">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    <span>Topic:</span>
                    <span className="text-zinc-300 font-medium">Distributed Systems</span>
                  </div>
                </div>

                {/* Meaningful Structured Content */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-100">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Key Takeaways &amp; Flashcard</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e0f14] border border-white/[0.06] space-y-1.5">
                    <p className="text-[11px] text-zinc-300 font-medium">
                      &bull; <strong className="text-white">Core Insight:</strong> Partitioning event logs prevents hot partition bottlenecks in stream consumers.
                    </p>
                    <p className="text-[11px] text-indigo-300 font-medium">
                      🗂️ <strong>Flashcard:</strong> How to prevent consumer lag in Kafka?
                    </p>
                  </div>
                </div>

                {/* Vault Action Footer */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href="/vault"
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Open in Vault Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-[10px] font-mono text-zinc-500">Auto-Saved</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  03. Knowledge Vault
                </span>
                <p className="text-xs text-zinc-400">
                  Practice flashcards, query notes, and export to Obsidian
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
