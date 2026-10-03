'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Bookmark,
  FolderTree,
  Heart,
  MessageCircle,
  Music,
  Code2,
  Download,
  ExternalLink,
  Play,
  CheckCircle2,
  Check,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);
  const [isPaused, setIsPaused] = useState(false);

  // Circular continuous auto-advancing slideshow (1 -> 2 -> 3 -> 1 -> ...)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="how-it-works"
      className="snap-section py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-[#0b0c10] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[360px] bg-indigo-600/[0.05] blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-5">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.03] text-indigo-400 border border-white/[0.08] inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Interactive 3-Step Flow</span>
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            How Reel Analyzer Works in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Install the extension, open any reel, and download your complete notes library.
          </p>
        </div>

        {/* Unified Single-Card Showcase Container */}
        <div
          className="rounded-3xl bg-[#12131a] border border-white/[0.08] p-4 sm:p-5 lg:p-6 shadow-2xl space-y-4"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Interactive Stepper Tabs (Clickable on Desktop & Mobile) */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-[#0a0b10] border border-white/[0.06]">
            {[
              { id: 0, num: '1', title: 'Install & Open', desc: 'Add extension & browse reels', mobileLabel: 'Install' },
              { id: 1, num: '2', title: 'Set Count & Start', desc: 'Choose 1 to 50 reels & hit start', mobileLabel: 'Start' },
              { id: 2, num: '3', title: 'Download Vault', desc: 'Instant formatted .zip vault', mobileLabel: 'Vault' },
            ].map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as 0 | 1 | 2)}
                  className={`py-2 px-2 sm:px-3 rounded-xl text-left transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/[0.05] text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {step.num}
                  </span>
                  <div className="min-w-0 hidden sm:block">
                    <div className="text-xs font-bold truncate leading-tight">
                      {step.title}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-zinc-500'}`}>
                      {step.desc}
                    </div>
                  </div>
                  <span className="sm:hidden text-xs font-bold truncate">
                    {step.mobileLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Card Body with Zoom-In Pop Animation */}
          <div className="rounded-2xl bg-gradient-to-b from-[#161824] to-[#0e1017] border border-white/[0.08] p-4 sm:p-6 lg:p-7 flex items-center justify-center relative overflow-hidden">
            {/* Ambient inner soft glow behind active card */}
            <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none" />

            {/* STEP 1: INSTALL EXTENSION & OPEN REEL */}
            {activeStep === 0 && (
              <div key="step-0" className="w-full">
                {/* Mobile View: Dedicated clean action card (No redundant clutter) */}
                <div className="md:hidden space-y-3.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                      Step 1 of 3
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Free Extension
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white leading-tight">
                      Install Extension &amp; Open Any Reel
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Add to desktop Chrome, then browse <code className="text-indigo-300 font-mono">instagram.com/reels</code>.
                    </p>
                  </div>

                  {/* Clean Visual Sequence */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                        <span>Chrome Web Store</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        No account needed
                      </span>
                    </div>

                    <a
                      href={CHROME_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Add to Chrome &mdash; Free</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                        <span>instagram.com/reels</span>
                      </div>
                      <span className="text-[10.5px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Auto-detected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop & iPad View: 2-Column Side-by-Side */}
                <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 items-center animate-in fade-in zoom-in-95 duration-400 ease-out">
                  <div className="md:col-span-7 space-y-3.5 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      <span>Step 1 of 3</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                        Install Extension &amp; Open Any Reel
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        Works directly inside your desktop browser on public reels or saved collections.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] font-bold">1</span>
                            <span>Add Chrome Extension</span>
                          </div>
                          <p className="text-[10.5px] text-zinc-400 pl-6">
                            100% Free &bull; No Account Needed &bull; No Sign-Up
                          </p>
                        </div>
                        <a
                          href={CHROME_STORE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all shrink-0"
                        >
                          <Download className="w-3 h-3" />
                          <span>Add to Chrome &mdash; Free</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white">
                            Open Any Instagram Reel
                          </div>
                          <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                            Navigate to <code className="text-indigo-300 font-mono">instagram.com/reels</code>. The extension detects the reel instantly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative group">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[9.5px] font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active Reel Detected</span>
                      </div>

                      <div className="relative w-[170px] sm:w-[195px] h-[300px] sm:h-[330px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#252838] bg-gradient-to-b from-[#141522] via-[#0e0f17] to-[#07080c] flex flex-col justify-between p-3 select-none">
                        <div className="flex items-center justify-between text-[9px] font-bold text-white/90 pt-0.5 px-1">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">
                            Reels
                          </span>
                          <div className="flex items-center gap-1 text-[8.5px] text-zinc-400">
                            <Music className="w-2.5 h-2.5 text-pink-400 animate-pulse" />
                            <span>audio</span>
                          </div>
                        </div>

                        <div className="my-auto rounded-xl bg-black/80 border border-white/[0.08] p-2.5 space-y-1 backdrop-blur-md shadow-xl text-left">
                          <div className="flex items-center justify-between text-[9px] font-mono border-b border-white/[0.08] pb-1">
                            <span className="text-indigo-400 font-semibold flex items-center gap-1">
                              <Code2 className="w-2.5 h-2.5 text-indigo-400" />
                              RateLimiter.ts
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                          <div className="font-mono text-[8px] leading-relaxed text-zinc-300 space-y-0.5">
                            <p className="text-purple-300">class SlidingWindow &#123;</p>
                            <p className="pl-1.5 text-zinc-400">redis = new Redis();</p>
                            <p className="pl-1.5 text-emerald-300">async check(ip) &#123;</p>
                            <p className="pl-2.5 text-amber-300">return count &lt;= 10;</p>
                            <p className="pl-1.5 text-zinc-500">&#125;</p>
                            <p className="text-zinc-500">&#125;</p>
                          </div>
                        </div>

                        <div className="flex items-end justify-between gap-1.5 text-left">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-[7px] font-bold text-white">
                                D
                              </div>
                              <span className="text-[8.5px] font-bold text-white truncate">@dev_patterns</span>
                            </div>
                            <p className="text-[8px] text-zinc-300 line-clamp-1 leading-tight">
                              Redis sliding window pattern ⚡
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-1 text-zinc-300 shrink-0">
                            <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                            <MessageCircle className="w-2.5 h-2.5 text-zinc-300" />
                            <Bookmark className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SET COUNT & START SUMMARIZING */}
            {activeStep === 1 && (
              <div key="step-1" className="w-full">
                {/* Mobile View: Direct interactive controller (Replaces redundant text points) */}
                <div className="md:hidden space-y-3.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                      Step 2 of 3
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Meta AI Connected
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white leading-tight">
                      Choose Count &amp; Click Start
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Pick how many reels to summarize. Meta AI processes them sequentially.
                    </p>
                  </div>

                  {/* Clean Visual Interactive Controller */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium">Reels to process:</span>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400">1</span>
                        <span className="px-2.5 py-0.5 rounded bg-indigo-600 text-white font-bold shadow-sm">5</span>
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400">10</span>
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400">50</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>Processing Reel 3 of 5</span>
                        <span className="text-emerald-400 font-bold">60%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                        <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
                      </div>
                      <div className="flex items-center gap-1 text-indigo-300 text-[9.5px] pt-0.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Extracting code &amp; takeaways via Meta AI...</span>
                      </div>
                    </div>

                    <div className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30">
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start Batch Processing</span>
                    </div>
                  </div>
                </div>

                {/* Desktop & iPad View: 2-Column Side-by-Side */}
                <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 items-center animate-in fade-in zoom-in-95 duration-400 ease-out">
                  <div className="md:col-span-7 space-y-3.5 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Step 2 of 3</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                        Choose Count &amp; Click Start
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        Runs smoothly in Chrome&apos;s native Side Panel. Summarize single reels or run batches of 5 to 50 reels.
                      </p>
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
                        <span className="text-indigo-400 font-bold shrink-0">⚡</span>
                        <div className="text-[11px] text-zinc-300">
                          <strong className="text-white">Hands-Free Batching:</strong> Auto-navigates reels with anti-rate-limit delays.
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
                        <span className="text-emerald-400 font-bold shrink-0">🤖</span>
                        <div className="text-[11px] text-zinc-300">
                          <strong className="text-white">Multimodal Meta AI:</strong> Extracts visual actions, code, and key takeaways live.
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
                        <span className="text-purple-400 font-bold shrink-0">📁</span>
                        <div className="text-[11px] text-zinc-300">
                          <strong className="text-white">Living Taxonomy:</strong> Auto-sorts notes into Domain and Subdomain folders.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-full max-w-[280px] p-3.5 sm:p-4 rounded-2xl bg-[#141622] border border-white/[0.08] shadow-2xl space-y-2.5 text-left select-none">
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg overflow-hidden bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center p-0.5">
                            <Image
                              src="/logos/icon-128.png"
                              alt="Reel Analyzer"
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-white leading-tight">Reel Analyzer</h4>
                            <span className="text-[9px] text-zinc-400 font-mono">Side Panel</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-medium">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Ready</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[9.5px] font-mono">
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.04]">
                          <div className="text-[8.5px] text-zinc-500 uppercase">Instagram</div>
                          <div className="text-zinc-200 font-medium truncate">Reel Detected</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.04]">
                          <div className="text-[8.5px] text-zinc-500 uppercase">Meta AI</div>
                          <div className="text-emerald-400 font-medium truncate">Connected</div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-300 font-semibold">Reels to summarize</span>
                          <div className="px-2.5 py-0.5 rounded-md bg-black border border-indigo-500/30 font-mono text-xs font-bold text-indigo-300">
                            5
                          </div>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-white/[0.04]">
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className="text-zinc-400">Processing Reel 3 of 5</span>
                            <span className="text-emerald-400 font-bold">60%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          <div className="py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-md shadow-indigo-600/30">
                            <Play className="w-2.5 h-2.5 fill-white" />
                            <span>Start</span>
                          </div>
                          <div className="py-1.5 rounded-lg bg-white/[0.04] text-zinc-500 text-[11px] font-medium flex items-center justify-center">
                            Stop
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DOWNLOAD COMPLETE OBSIDIAN VAULT */}
            {activeStep === 2 && (
              <div key="step-2" className="w-full">
                {/* Mobile View: Direct deliverable card (No redundant text points) */}
                <div className="md:hidden space-y-3.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold">
                      Step 3 of 3
                    </span>
                    <span className="text-[11px] text-purple-300 font-mono">
                      1-Click Export
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white leading-tight">
                      Download Complete Obsidian Vault
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Pre-organized into Domain folders with YAML frontmatter, backlinks, and tags.
                    </p>
                  </div>

                  {/* Clean Visual Deliverable Card */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300">
                          <FolderTree className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Obsidian-Vault.zip</div>
                          <div className="text-[9.5px] text-zinc-400 font-mono">Structured Offline Notes</div>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        Ready
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] font-mono text-[9px] text-zinc-300 space-y-1">
                      <div className="text-indigo-300 font-semibold flex items-center gap-1">
                        <span>📂</span>
                        <span>Engineering/Distributed-Systems/</span>
                      </div>
                      <div className="pl-4 text-emerald-400">📄 RateLimiter-TokenBucket.md</div>
                    </div>

                    <Link
                      href="/vault"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Vault (.zip)</span>
                    </Link>
                  </div>
                </div>

                {/* Desktop & iPad View: 2-Column Side-by-Side */}
                <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 items-center animate-in fade-in zoom-in-95 duration-400 ease-out">
                  <div className="md:col-span-7 space-y-3.5 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      <span>Step 3 of 3</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                        Download Complete Obsidian Vault
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        Instant deliverable. Notes are structured with YAML frontmatter, backlinks, and tags.
                      </p>
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
                        <span className="text-indigo-400 font-bold shrink-0">📦</span>
                        <div className="text-[11px] text-zinc-300">
                          <strong className="text-white">Full Folder Hierarchy:</strong> Pre-organized into Domain &amp; Subdomain folders.
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
                        <span className="text-purple-400 font-bold shrink-0">🏷️</span>
                        <div className="text-[11px] text-zinc-300">
                          <strong className="text-white">YAML Frontmatter:</strong> Includes #tags, date, creator handle, and source URL.
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
                        <span className="text-emerald-400 font-bold shrink-0">🌐</span>
                        <div className="text-[11px] text-zinc-300">
                          <strong className="text-white">Web Vault Included:</strong> Search with Ctrl+K and review notes right in browser.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-full max-w-[280px] p-3.5 sm:p-4 rounded-2xl bg-[#161822] border border-white/[0.08] shadow-2xl text-left space-y-3 select-none">
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300">
                            <FolderTree className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Obsidian-Vault.zip</div>
                            <div className="text-[9px] text-zinc-400 font-mono">1-Click Deliverable</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                          Ready
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/50 border border-white/[0.06] font-mono text-[9px] space-y-1 text-zinc-400">
                        <div className="text-indigo-400 font-bold flex items-center gap-1">
                          <span>📁</span>
                          <span>Reel-Analyzer-Vault/</span>
                        </div>
                        <div className="pl-2 space-y-0.5 text-zinc-300">
                          <div className="flex items-center gap-1">
                            <span className="text-indigo-300">📂</span>
                            <span>Engineering/Distributed-Systems/</span>
                          </div>
                          <div className="pl-3 text-emerald-400">📄 RateLimiter-TokenBucket.md</div>
                          <div className="flex items-center gap-1">
                            <span className="text-purple-300">📂</span>
                            <span>AI-Agents/Architecture/</span>
                          </div>
                          <div className="pl-3 text-purple-300">📄 Agentic-Workflows-2026.md</div>
                        </div>
                      </div>

                      <Link
                        href="/vault"
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/25 transition-all"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download Vault (.zip)</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation Footer */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx as 0 | 1 | 2)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeStep === idx
                      ? 'w-6 bg-indigo-500 shadow-sm shadow-indigo-500/40'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveStep((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
              className="py-1.5 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white border border-white/[0.08] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{activeStep === 2 ? 'Back to Step 1' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
