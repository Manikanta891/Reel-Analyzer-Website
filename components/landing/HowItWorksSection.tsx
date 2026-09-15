'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Bookmark,
  FolderTree,
  Tag,
  FileText,
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="min-h-screen flex flex-col justify-between items-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-white/[0.08] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[360px] bg-brand-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto my-auto space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-zinc-900 text-brand-400 border border-white/[0.08] inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>Visual Knowledge Pipeline</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Convert Reels into Meaningful Content
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            From raw video feeds to organized, categorized knowledge notes on our web platform.
          </p>
        </div>

        {/* 3-Stage Pipeline Container */}
        <div className="rounded-3xl bg-zinc-900/50 border border-white/[0.08] p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* STAGE 1: Phone Card (Instagram Reel) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3 m-0 p-0">
              <div className="relative group m-0 p-0">
                <div className="relative w-[185px] sm:w-[205px] h-[385px] sm:h-[428px] rounded-[42px] overflow-hidden m-0 p-0 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src="/phone-card.png"
                    alt="Instagram Reel Phone Card"
                    fill
                    className="object-contain rounded-[42px] m-0 p-0"
                    priority
                  />
                  {/* Subtle glare overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-[42px]" />
                  
                  {/* Floating badge inside phone */}
                  <div className="absolute bottom-6 left-3 right-3 p-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-white/[0.1] text-left">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 font-semibold">
                      <Bookmark className="w-3 h-3 text-brand-400" />
                      <span>Instagram Reel</span>
                    </div>
                    <p className="text-[9.5px] text-zinc-400 truncate mt-0.5">
                      Fast-paced technical video feed
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-wider">
                  01. Source Reel
                </span>
                <p className="text-xs text-zinc-400">
                  Select reels or saved posts on Instagram
                </p>
              </div>
            </div>

            {/* STAGE 2: Reel Analyzer Engine (Clean Logo & Center Bridge) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-4 px-2">
              <div className="relative w-full max-w-[240px] p-6 rounded-3xl bg-zinc-950/90 border border-white/[0.1] shadow-2xl space-y-4 flex flex-col items-center">
                {/* Glowing Logo Icon */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl blur-lg opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/[0.15] bg-zinc-900 flex items-center justify-center shadow-xl">
                    <Image
                      src="/logos/icon-128.png"
                      alt="Reel Analyzer Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Brand Text */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Reel Analyzer
                  </h3>
                  <p className="text-[11px] font-medium text-zinc-400">
                    AI Knowledge Engine
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Real-Time Synthesis</span>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <span>Categorizing Knowledge</span>
                <ArrowRight className="w-4 h-4 text-brand-400 animate-pulse" />
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-wider">
                  02. Reel Analyzer
                </span>
                <p className="text-xs text-zinc-400">
                  Extracts &amp; structures insights in real time
                </p>
              </div>
            </div>

            {/* STAGE 3: Domain, Subdomain & Meaningful Content Card */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="w-full max-w-sm rounded-2xl bg-zinc-950/90 border border-white/[0.1] p-4 sm:p-5 shadow-2xl text-left space-y-3">
                {/* Domain & Subdomain Taxonomy Badges */}
                <div className="space-y-2 border-b border-white/[0.08] pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-brand-300 text-xs font-semibold">
                      <FolderTree className="w-3.5 h-3.5 text-brand-400" />
                      <span>Domain:</span>
                      <span className="text-white font-bold">Engineering &amp; Web</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Organized
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pl-5">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    <span>Subdomain:</span>
                    <span className="text-zinc-200 font-medium">Architecture &amp; Performance</span>
                  </div>
                </div>

                {/* Meaningful Structured Content */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <FileText className="w-3.5 h-3.5 text-brand-400" />
                    <span>Structured Concept Playbook</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06] space-y-1.5">
                    <p className="text-[11px] text-zinc-300 font-medium">
                      &bull; <strong className="text-white">Core Principle:</strong> Isolate compute pipelines to maximize runtime throughput.
                    </p>
                    <p className="text-[11px] text-zinc-300 font-medium">
                      &bull; <strong className="text-white">Key Action:</strong> Automate cache pruning on heavy state updates.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                    <span className="text-zinc-500">Stack:</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300">Frameworks</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300">Architecture</span>
                  </div>
                </div>

                {/* Vault Action Footer */}
                <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href="/vault"
                    className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View in Web Vault</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-[10px] font-mono text-zinc-500">Auto-Categorized</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-wider">
                  03. Domain &amp; Content
                </span>
                <p className="text-xs text-zinc-400">
                  Search, review, and master topic playbooks
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator to Screen 3 */}
      <a
        href="#features"
        className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 text-[11px] font-mono transition-colors"
      >
        <span>Key Capabilities</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </a>
    </section>
  );
};
