'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  FolderTree,
  ChevronDown,
  Copy,
  Check,
  Flame,
  FileCode2,
  BookOpen,
  Layers,
  Play,
  RotateCw,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'takeaways'>('markdown');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-indigo-600/[0.07] blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12 md:mb-16">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-zinc-300">
              Personal Knowledge Management for Reels
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-100 tracking-tight leading-[1.12]">
            Turn 60-Second Video Noise into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Permanent Knowledge
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Extract actionable code, mental models, YAML properties, and structured Obsidian Markdown vaults from Instagram Reels with one click.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all duration-150 active:scale-[0.98]"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>

            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-xs sm:text-sm font-semibold border border-white/[0.08] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" strokeWidth={1.5} />
              <span>Explore Knowledge Vault</span>
            </Link>
          </div>
        </div>

        {/* Interactive Knowledge Transformation Simulator (Bento Layout) */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#111218] border border-white/[0.08] p-4 sm:p-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-semibold text-zinc-400 ml-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Knowledge Synthesizer</span>
              </span>
            </div>

            {/* Interactive Preview Tabs */}
            <div className="flex items-center gap-1 bg-[#171822] p-1 rounded-lg border border-white/[0.06]">
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'markdown'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Obsidian Note
              </button>
              <button
                onClick={() => setActiveTab('takeaways')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'takeaways'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Key Takeaways
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Raw Source Video Card */}
            <div className="lg:col-span-4 rounded-xl bg-[#161822] border border-white/[0.06] p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    Instagram Reel
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">0:48s</span>
                </div>

                <div className="h-32 rounded-lg bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-white/[0.04] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 mt-2">
                    System Design: Vector DBs in 60s
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-zinc-200">
                    @alex_ai_dev &bull; 142k views
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    How embeddings and HNSW indexes enable sub-10ms semantic search at scale.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                <span>Domain: #ai-engineering</span>
                <span className="text-emerald-400">Extracted</span>
              </div>
            </div>

            {/* Right: Rendered Knowledge Output */}
            <div className="lg:col-span-8 rounded-xl bg-[#141620] border border-white/[0.06] p-5 min-h-[300px] flex flex-col justify-between">
              {activeTab === 'markdown' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="bg-[#0e0f14] p-3.5 rounded-lg border border-white/[0.06] text-zinc-400 space-y-1">
                    <p className="text-indigo-400">---</p>
                    <p><span className="text-purple-400">title:</span> &quot;Vector Search Architecture with HNSW Indexes&quot;</p>
                    <p><span className="text-purple-400">creator:</span> &quot;@alex_ai_dev&quot;</p>
                    <p><span className="text-purple-400">domain:</span> ai-engineering</p>
                    <p><span className="text-purple-400">tags:</span> [vector-db, embeddings, hnsw, rag]</p>
                    <p className="text-indigo-400">---</p>
                  </div>

                  <div className="space-y-2 text-zinc-300 font-sans">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-indigo-400 font-mono">#</span> Core Architecture Concept
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Vector search bypasses exact keyword matching by computing cosine similarity across high-dimensional embeddings using Hierarchical Navigable Small World (HNSW) graphs.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'takeaways' && (
                <div className="space-y-3 font-sans py-2">
                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200">
                    💡 <strong className="text-white">Core Insight:</strong> Cosine similarity over HNSW graphs provides 99% recall at 1/10th the latency of brute-force Euclidean distance.
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside">
                    <li>Generate embeddings with text-embedding-3-small (1536 dims).</li>
                    <li>Index embeddings with M=16, efConstruction=64 parameters.</li>
                    <li>Always normalize query vectors to unit length prior to scoring.</li>
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs">
                <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                  <span>✨ Obsidian-Ready Markdown</span>
                  <span>&bull;</span>
                  <span>YAML Properties</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-medium transition-colors border border-white/[0.06]"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy Markdown'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 text-center">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>100% Local &amp; Private</span>
            </div>
            <p className="text-xs text-zinc-400">All summaries and notes reside securely in your browser storage.</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm">
              <Zap className="w-4 h-4" strokeWidth={1.5} />
              <span>Zero API Keys Needed</span>
            </div>
            <p className="text-xs text-zinc-400">Powered by browser integration with zero subscriptions or tokens.</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
            <div className="flex items-center justify-center gap-2 text-indigo-400 font-semibold text-sm">
              <FolderTree className="w-4 h-4" strokeWidth={1.5} />
              <span>Obsidian-Ready Vault</span>
            </div>
            <p className="text-xs text-zinc-400">Export clean Markdown files with YAML properties and bi-directional tags.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
