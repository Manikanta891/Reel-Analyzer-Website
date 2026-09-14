'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  CheckCircle2,
  Wrench,
  Gem,
  ListOrdered,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  Camera,
  Search,
  Check,
  ChevronDown,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. INITIAL VIEWPORT (Above the Fold): Only Badge -> Headline -> CTAs -> Trust Badges */}
      {/* ========================================================================= */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Top Feature Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-white/[0.1] text-xs text-zinc-300 mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-[11px] text-zinc-200">
              100% Free Built-in AI &bull; No API Keys Required
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Turn Instagram Reels into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-indigo-200 to-purple-400">
              Structured Engineering Playbooks
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-5 leading-relaxed">
            Stop losing coding tutorials and architecture guides in endless feeds. Capture, structure, and master video knowledge directly inside your browser.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full sm:w-auto">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-brand-600/25 transition-all duration-150 active:scale-[0.98]"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>

            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-semibold border border-white/[0.1] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <span>Open Knowledge Vault</span>
            </Link>
          </div>

          {/* Trust Badges Row */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap mt-10 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              <span>100% Local-First Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
              <span>Zero Setup or API Keys</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" strokeWidth={1.5} />
              <span>Obsidian & Markdown Ready</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 text-zinc-600 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Scroll to See Live AI Pipeline
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SHOWCASE SECTION (Below the Fold): 3-Stage Visual Pipeline */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="rounded-3xl bg-zinc-900/50 border border-white/[0.08] p-4 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Header Bar */}
          <div className="text-left mb-6 flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-zinc-400 ml-2">
                Live AI Transformation Pipeline
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Auto-Synchronized
            </span>
          </div>

          {/* 3-Stage Horizontal Flow Container */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2">
            {/* ------------------------------------------------------------- */}
            {/* STAGE 1: Full-Bleed Realistic Mobile Instagram Reel Screen */}
            {/* ------------------------------------------------------------- */}
            <div className="w-full lg:w-[44%] flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                Stage 1 &bull; Instagram Reel
              </span>

              <div className="w-full max-w-[280px] sm:max-w-[305px] rounded-[36px] bg-zinc-950 border-[4px] border-zinc-700/90 shadow-2xl relative overflow-hidden aspect-[9/16] text-white select-none flex flex-col justify-between">
                {/* Full-Bleed Video Background Canvas */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pointer-events-none">
                  {/* Subtle code editor background graphic */}
                  <div className="opacity-20 p-4 font-mono text-[8px] text-zinc-400 leading-relaxed overflow-hidden">
                    <span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> 'react';<br />
                    <span className="text-blue-400">export default function</span> App() &#123;<br />
                    &nbsp;&nbsp;<span className="text-zinc-500">// Multi-stage optimization</span><br />
                    &nbsp;&nbsp;<span className="text-brand-300">const</span> [state, setState] = useState();<br />
                    &nbsp;&nbsp;<span className="text-amber-400">return</span> &lt;Container&gt;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;DockerBuild stage="runner" /&gt;<br />
                    &nbsp;&nbsp;&lt;/Container&gt;<br />
                    &#125;
                  </div>
                </div>

                {/* Smartphone Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800 mr-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-950/90" />
                </div>

                {/* Instagram Header */}
                <div className="relative z-20 pt-4 px-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center gap-1.5">
                    {/* Instagram Gradient Camera Icon */}
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] flex items-center justify-center">
                      <div className="w-full h-full bg-black rounded-[4px] flex items-center justify-center">
                        <div className="w-2 h-2 border border-white rounded-[2px] flex items-center justify-center">
                          <div className="w-0.5 h-0.5 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-xs tracking-tight">Reels</span>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">
                    <Camera className="w-4 h-4" strokeWidth={1.8} />
                    <Search className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Video Foreground Highlights */}
                <div className="relative z-20 my-auto text-left px-3 py-2 space-y-2">
                  <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/[0.12] backdrop-blur-md space-y-1.5 shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">🐳</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        DOCKER TIPS
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      Slash Next.js Docker Image Size from 1.2GB to 48MB
                    </h4>
                    <div className="bg-black/70 rounded-lg p-2 font-mono text-[9px] text-emerald-400 leading-relaxed border border-white/[0.06]">
                      FROM node:20-alpine AS builder<br />
                      RUN npm run build<br />
                      FROM node:20-alpine AS runner
                    </div>
                  </div>
                </div>

                {/* Right Instagram Action Buttons */}
                <div className="absolute right-2.5 bottom-16 z-20 flex flex-col items-center gap-3.5 text-zinc-200">
                  <div className="flex flex-col items-center gap-0.5">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" strokeWidth={1.5} />
                    <span className="text-[9px] font-medium">48.2K</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <span className="text-[9px] font-medium">1,280</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Share2 className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <span className="text-[9px] font-medium">9.4K</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Bookmark className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <span className="text-[9px] font-medium">32.1K</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center animate-spin">
                    <Music2 className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Bottom Instagram Creator Info */}
                <div className="relative z-20 text-left px-3 pb-2 space-y-1 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-[1px]">
                      <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-[8px] font-bold">
                        CA
                      </div>
                    </div>
                    <span className="text-[11px] font-bold">@cloud_architect</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded border border-white/30 text-white font-medium">
                      Follow
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-300 line-clamp-1">
                    Multi-stage builds eliminate compiler bloat from production containers 🚀 #docker #webdev
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-zinc-400">
                    <Music2 className="w-2.5 h-2.5" />
                    <span>original sound &bull; cloud_architect</span>
                  </div>
                </div>

                {/* Bottom Instagram Video Seekbar */}
                <div className="relative z-20 w-full h-[2px] bg-zinc-800">
                  <div className="w-2/3 h-full bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STAGE 2: Directional Connectors & Central Logo Hub */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-2 my-2 lg:my-0 flex-shrink-0">
              {/* Mobile Top Downward Flow Arrow */}
              <div className="flex lg:hidden flex-col items-center text-brand-400 my-1 animate-pulse">
                <div className="h-5 w-[2px] bg-gradient-to-b from-brand-500/20 to-brand-500" />
                <ChevronDown className="w-5 h-5 text-brand-400" />
              </div>

              {/* Desktop Left-to-Right Flow Arrow */}
              <div className="hidden lg:flex items-center gap-1.5 text-zinc-600">
                <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-brand-500/50 to-brand-500" />
                <ArrowRight className="w-5 h-5 text-brand-400 animate-pulse" />
              </div>

              {/* Central Logo Hub */}
              <div className="flex flex-col items-center justify-center gap-2 px-3 py-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
                  Stage 2 &bull; AI Engine
                </span>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-950 border border-white/[0.15] p-2.5 shadow-2xl flex items-center justify-center">
                    <Image
                      src="/logos/icon-48.png"
                      alt="Reel Analyzer AI Engine"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-brand-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real-Time Extraction</span>
                </div>
              </div>

              {/* Desktop Left-to-Right Flow Arrow */}
              <div className="hidden lg:flex items-center gap-1.5 text-zinc-600">
                <ArrowRight className="w-5 h-5 text-brand-400 animate-pulse" />
                <div className="w-8 h-[2px] bg-gradient-to-r from-brand-500 via-brand-500/50 to-transparent" />
              </div>

              {/* Mobile Bottom Downward Flow Arrow */}
              <div className="flex lg:hidden flex-col items-center text-brand-400 my-1 animate-pulse">
                <ChevronDown className="w-5 h-5 text-brand-400" />
                <div className="h-5 w-[2px] bg-gradient-to-b from-brand-500 to-brand-500/20" />
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STAGE 3: Structured Knowledge Playbook Card */}
            {/* ------------------------------------------------------------- */}
            <div className="w-full lg:w-[48%] flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                Stage 3 &bull; Structured Playbook
              </span>

              <div className="w-full rounded-2xl bg-zinc-950 border border-white/[0.1] p-5 sm:p-6 text-left space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-white/[0.06]">
                      DevOps & Cloud
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-400">
                      Docker
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready in Vault
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                  Production Docker Multi-Stage Optimization for Next.js
                </h3>

                <div className="space-y-3 text-xs">
                  {/* 1. Core Premise */}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-200 uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.5} />
                      <span>1. Core Premise</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Separates compile-time dependencies (TypeScript, devDependencies) from the final Alpine runtime to reduce container vulnerability surface and speed up cold starts.
                    </p>
                  </div>

                  {/* 2. Step Breakdown */}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-200 uppercase tracking-wide">
                      <ListOrdered className="w-3.5 h-3.5 text-zinc-300" strokeWidth={1.5} />
                      <span>2. Step-by-Step Implementation</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      1. Build artifacts in `builder` stage &bull; 2. Copy only standalone build to minimal Alpine runner &bull; 3. Execute with non-root UID 1001.
                    </p>
                  </div>

                  {/* 3. Golden Takeaway with clean inline code highlight */}
                  <div className="p-3 rounded-xl bg-brand-950/30 border border-brand-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-300 uppercase tracking-wide">
                      <Gem className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.5} />
                      <span>3. Golden Takeaway</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Set <code className="font-mono text-brand-300 bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-500/30 text-[10px]">output: "standalone"</code> in <code className="font-mono text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">next.config.js</code> to automatically bundle only required dependencies.
                    </p>
                  </div>

                  {/* Tools Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <Wrench className="w-3 h-3 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                    {['Docker', 'Alpine Linux', 'Next.js', 'Node.js'].map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.06]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
