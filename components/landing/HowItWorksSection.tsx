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
  const [activeStep, setActiveStep] = React.useState<0 | 1 | 2>(0);

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0c10] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[360px] bg-indigo-600/[0.06] blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto space-y-8 sm:space-y-10 md:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-white/[0.03] text-indigo-400 border border-white/[0.08] inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Interactive Knowledge Flow</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
            How to Turn Instagram Reels into Structured Notes in 3 Steps
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed px-2">
            From fast-paced <strong className="text-zinc-300">Instagram Reels</strong> to clean, queryable Markdown notes and study flashcards.
          </p>
        </div>

        {/* 3-Stage Pipeline Container */}
        <div className="rounded-2xl bg-[#12131a] border border-white/[0.06] p-4 sm:p-6 lg:p-8 shadow-2xl">
          
          {/* MOBILE INTERACTIVE 3-TAB STEPPER (lg:hidden) */}
          <div className="lg:hidden space-y-4">
            {/* Step Selector Pills */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0a0b10] border border-white/[0.06]">
              {[
                { id: 0, label: '1. Capture' },
                { id: 1, label: '2. Analyze' },
                { id: 2, label: '3. Vault' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id as any)}
                  className={`py-2 px-1 rounded-lg text-center text-xs font-semibold transition-all ${
                    activeStep === s.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Step Card Content */}
            <div className="p-4 rounded-2xl bg-[#161822] border border-white/[0.08] min-h-[340px] flex flex-col items-center justify-between">
              {activeStep === 0 && (
                <div className="w-full flex flex-col items-center space-y-4 py-2 animate-in fade-in duration-200">
                  <div className="relative w-[140px] h-[240px] rounded-[24px] overflow-hidden shadow-xl border-4 border-[#1c1e28] bg-black">
                    <Image
                      src="/phone-card.png"
                      alt="Instagram Reel to AI Knowledge extraction preview"
                      title="Instagram Reels to Structured Markdown Notes"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2 right-2 p-1.5 rounded-lg bg-[#12131a]/95 border border-white/[0.1] text-left">
                      <div className="flex items-center gap-1 text-[9px] text-zinc-200 font-semibold">
                        <Bookmark className="w-2.5 h-2.5 text-pink-400" />
                        <span>Instagram Reel</span>
                      </div>
                      <p className="text-[8px] text-zinc-400 truncate">Technical breakdown</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-semibold text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
                  >
                    <span>Next: 2. Reel Analyzer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activeStep === 1 && (
                <div className="w-full flex flex-col items-center space-y-4 py-6 text-center animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#12131a] flex items-center justify-center shadow-lg">
                    <Image
                      src="/logos/icon-128.png"
                      alt="Reel Analyzer — Instagram Reels AI Summarizer by Manikanta Sandula"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-zinc-100">Reel Analyzer</h3>
                    <p className="text-xs text-zinc-400 max-w-xs">
                      Extracts transcripts, code &amp; mental models in real time
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Real-Time Parsing</span>
                  </div>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-semibold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 pt-2"
                  >
                    <span>Next: 3. Structured Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activeStep === 2 && (
                <div className="w-full space-y-3 py-1 animate-in fade-in duration-200 text-left">
                  <div className="space-y-1.5 border-b border-white/[0.06] pb-2.5">
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
                      <span>Topic: Distributed Systems</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#0e0f14] border border-white/[0.06] space-y-1.5">
                      <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                        &bull; <strong className="text-white">Core Mechanism:</strong> Event-driven partitioning prevents bottlenecks.
                      </p>
                      <p className="text-[11px] text-indigo-300 font-mono bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20 break-all">
                        <code>ttl_jitter = base_ttl + rand(0, 30s)</code>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <Link
                      href="/vault"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Open in Vault Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] font-mono text-zinc-500">Auto-Saved</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP 3-STAGE GRID FLOW (hidden lg:grid) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center">
            {/* STAGE 1: Phone Card (Instagram Reel) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative group">
                <div className="relative w-[210px] h-[410px] rounded-[38px] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] border-4 border-[#1c1e28] bg-black">
                  <Image
                    src="/phone-card.png"
                    alt="Instagram Reel to AI Knowledge extraction preview"
                    title="Instagram Reels AI Note Extraction"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                  
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
            </div>

            {/* STAGE 2: Reel Analyzer Engine */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-4 px-2">
              <div className="w-full max-w-[260px] p-7 rounded-2xl bg-[#161822] border border-white/[0.08] shadow-xl space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#12131a] flex items-center justify-center shadow-lg relative group">
                  <Image
                    src="/logos/icon-128.png"
                    alt="Reel Analyzer — Instagram Reels AI Summarizer by Manikanta Sandula"
                    title="Reel Analyzer Instagram Extension"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-100 tracking-tight">
                    Reel Analyzer
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Extracts transcripts, code &amp; mental models
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-Time Parsing</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <span>Auto-Structuring</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            {/* STAGE 3: Structured Knowledge Studio Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-sm rounded-2xl bg-[#161822] border border-white/[0.08] p-6 shadow-xl text-left flex flex-col justify-between space-y-4 min-h-[410px]">
                <div className="space-y-3.5">
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

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-100">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Key Takeaways &amp; Framework</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0e0f14] border border-white/[0.06] space-y-2.5">
                      <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                        &bull; <strong className="text-white">Core Mechanism:</strong> Event-driven partitioning prevents hot partition bottlenecks in stream consumers.
                      </p>
                      <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                        &bull; <strong className="text-white">Jitter Formula:</strong> Eliminates thundering herd retry storms during system failover.
                      </p>
                      <p className="text-[11px] text-indigo-300 font-mono bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/20 break-all">
                        <code>ttl_jitter = base_ttl + rand(0, 30s)</code>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href="/vault"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open in Vault Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[10px] font-mono text-zinc-500">Auto-Saved</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
