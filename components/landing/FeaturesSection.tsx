'use client';

import React from 'react';
import {
  FolderTree,
  FileCode2,
  Lock,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  Code2,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0c10] border-t border-white/[0.06] relative"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-white/[0.03] text-indigo-400 border border-white/[0.08] inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Second Brain Capabilities</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Engineered for Serious Learners
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Stop losing valuable insights in your saved reels feed. Turn fleeting videos into a queryable, permanent second brain.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Obsidian Vault & Bi-directional Links (Span 7) */}
          <div className="md:col-span-7 rounded-2xl bg-[#12131a] border border-white/[0.06] hover:border-white/[0.12] p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-200 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <FolderTree className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                Native Obsidian Vault Export
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Export clean, standardized Markdown files formatted with YAML frontmatter properties, tags, and creator metadata ready for Obsidian, Notion, or Logseq.
              </p>
            </div>

            <div className="rounded-xl bg-[#0e0f14] p-3.5 border border-white/[0.06] font-mono text-[11px] text-zinc-400 space-y-1">
              <div className="text-zinc-500">// Auto-generated YAML frontmatter</div>
              <div><span className="text-indigo-400">tags:</span> [#software-architecture, #system-design]</div>
              <div><span className="text-indigo-400">creator:</span> @techlead &bull; <span className="text-indigo-400">type:</span> video-note</div>
            </div>
          </div>

          {/* Card 2: Instant Search & Living Taxonomy (Span 5) */}
          <div className="md:col-span-5 rounded-2xl bg-[#12131a] border border-white/[0.06] hover:border-white/[0.12] p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-200 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <BookOpen className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                Instant Search &amp; Taxonomy
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Fuzzy multi-token search, nested subtopic filters, and automatic tool hashtag grouping to find any saved concept in milliseconds.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-3 text-[11px] text-emerald-200 flex items-center justify-between">
              <span>⚡ Sub-millisecond Recall</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">Fuzzy Filter</span>
            </div>
          </div>

          {/* Card 3: Deep Synthesis & Code Extraction (Span 6) */}
          <div className="md:col-span-6 rounded-2xl bg-[#12131a] border border-white/[0.06] hover:border-white/[0.12] p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-200 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Code2 className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Code &amp; Mental Model Extraction
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Preserves exact syntax, frameworks, terminal commands, and algorithmic mental models without losing nuance in long transcripts.
              </p>
            </div>

            <div className="rounded-xl bg-[#0e0f14] p-3 border border-white/[0.06] font-mono text-[11px] text-amber-300/90">
              <code>git commit -m &quot;feat: instant vector search&quot;</code>
            </div>
          </div>

          {/* Card 4: 100% Local-First & Zero Tracking (Span 6) */}
          <div className="md:col-span-6 rounded-2xl bg-[#12131a] border border-white/[0.06] hover:border-white/[0.12] p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-200 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
                100% Offline-First Privacy
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Zero remote databases. Your entire vault is stored in your local browser storage with instant export to offline Markdown zip files.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
              <span>🔒 Zero Cloud Telemetry</span>
              <span className="text-zinc-500">IndexedDB Local</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA to enter Vault */}
        <div className="text-center pt-4">
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
