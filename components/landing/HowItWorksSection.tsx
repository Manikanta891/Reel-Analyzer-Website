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
  Heart,
  MessageCircle,
  Music,
  Code2,
  Download,
  ExternalLink,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState<0 | 1 | 2>(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Circular continuous auto-advancing slideshow (1 -> 2 -> 3 -> 1 -> ...)
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

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
            How Reel Analyzer Works in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed px-2">
            Open any reel, enter how many to summarize, and download a complete Obsidian vault in one click.
          </p>
        </div>

        {/* 3-Stage Pipeline Container */}
        <div className="rounded-2xl bg-[#12131a] border border-white/[0.06] p-4 sm:p-6 lg:p-8 shadow-2xl">
          
          {/* MOBILE INTERACTIVE 3-TAB STEPPER (lg:hidden) */}
          <div className="lg:hidden space-y-4">
            {/* Step Selector Pills */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0a0b10] border border-white/[0.06]">
              {[
                { id: 0, label: '1. Install & Open' },
                { id: 1, label: '2. Set & Start' },
                { id: 2, label: '3. Download' },
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

            {/* Step Card Content with touch pause and smooth inflow animation */}
            <div
              className="p-4 rounded-2xl bg-[#161822] border border-white/[0.08] min-h-[350px] flex flex-col items-center justify-center transition-all"
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {activeStep === 0 && (
                <div key="step-0" className="w-full flex flex-col items-center space-y-3 py-1 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-forwards ease-out">
                  {/* Step 1 Primary Action: Install Extension */}
                  <a
                    href={CHROME_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-[220px] py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Add to Chrome &mdash; Free</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Realistic Dark-Themed Instagram Reel Phone Mockup */}
                  <div className="relative w-[156px] h-[245px] rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#252838] bg-gradient-to-b from-[#141522] via-[#0e0f17] to-[#07080c] flex flex-col justify-between p-2.5 select-none">
                    {/* Top Notch & Reels Header */}
                    <div className="flex items-center justify-between text-[9px] font-bold text-white/90 pt-0.5 px-0.5">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">
                        Reels
                      </span>
                      <div className="flex items-center gap-1 text-[7.5px] text-zinc-400 font-normal">
                        <Music className="w-2.5 h-2.5 text-pink-400 animate-pulse" />
                        <span>audio</span>
                      </div>
                    </div>

                    {/* Reel Video Center: Developer Syntax Highlighted Snippet */}
                    <div className="my-auto rounded-xl bg-black/70 border border-white/[0.08] p-2 space-y-1.5 backdrop-blur-sm shadow-xl">
                      <div className="flex items-center justify-between text-[7.5px] font-mono border-b border-white/[0.06] pb-1">
                        <span className="text-indigo-400 font-semibold flex items-center gap-1">
                          <Code2 className="w-2.5 h-2.5 text-indigo-400" />
                          RateLimiter.ts
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="font-mono text-[7px] leading-[1.3] text-zinc-300 space-y-0.5">
                        <p className="text-purple-300">class SlidingWindow &#123;</p>
                        <p className="pl-1 text-zinc-400">redis = new Redis();</p>
                        <p className="pl-1 text-emerald-300">async check(ip) &#123;</p>
                        <p className="pl-2 text-amber-300">return count &lt;= 10;</p>
                        <p className="pl-1 text-zinc-500">&#125;</p>
                        <p className="text-zinc-500">&#125;</p>
                      </div>
                    </div>

                    {/* Bottom Metadata & Floating Actions */}
                    <div className="flex items-end justify-between gap-1.5 pt-1">
                      <div className="space-y-1 text-left flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-[7px] font-bold text-white shadow-sm">
                            D
                          </div>
                          <span className="text-[8px] font-bold text-white truncate">@dev_patterns</span>
                        </div>
                        <p className="text-[7.5px] text-zinc-300 line-clamp-2 leading-tight">
                          Redis sliding window token bucket pattern ⚡
                        </p>
                      </div>

                      {/* Right Floating Actions */}
                      <div className="flex flex-col items-center gap-1 text-zinc-300 shrink-0">
                        <div className="flex flex-col items-center">
                          <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                          <span className="text-[6.5px] font-mono text-zinc-400">14k</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MessageCircle className="w-2.5 h-2.5 text-zinc-300" />
                          <span className="text-[6.5px] font-mono text-zinc-400">284</span>
                        </div>
                        <Bookmark className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div key="step-1" className="w-full flex flex-col items-center space-y-3 py-2 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-forwards ease-out">
                  {/* Extension Side Panel Mockup */}
                  <div className="w-full max-w-[280px] rounded-2xl bg-[#0e1017] border border-white/[0.08] shadow-2xl p-3.5 space-y-3 select-none text-left">
                    {/* Header */}
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
                          <span className="text-[9px] text-zinc-500 font-mono">Chrome Side Panel</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Ready</span>
                      </div>
                    </div>

                    {/* Batch Input Row */}
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-300 font-medium">Reels to summarize</span>
                        <div className="px-2.5 py-0.5 rounded-lg bg-black border border-indigo-500/30 font-mono text-[11px] font-bold text-indigo-300">
                          5
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-1 pt-1 border-t border-white/[0.04]">
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-zinc-400">Processing Reel 3 of 5</span>
                          <span className="text-emerald-400 font-bold">60%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
                        </div>
                        <div className="flex items-center gap-1 text-[8.5px] text-indigo-300 pt-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                          <span>Extracting code &amp; takeaways via Meta AI...</span>
                        </div>
                      </div>

                      {/* Start / Stop Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-md shadow-indigo-600/30">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>Start</span>
                        </div>
                        <div className="py-1.5 rounded-lg bg-white/[0.04] text-zinc-500 text-[10px] font-medium flex items-center justify-center">
                          Stop
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div key="step-2" className="w-full space-y-3 py-1 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-forwards ease-out text-left">
                  {/* Redesigned Vault Package Header */}
                  <div className="p-3.5 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300">
                          <FolderTree className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white">Obsidian-Vault.zip</div>
                          <div className="text-[9px] text-zinc-400 font-mono">5 Formatted Notes &bull; YAML Frontmatter</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Ready
                      </span>
                    </div>

                    {/* Clean Vault File Tree Structure */}
                    <div className="space-y-1 font-mono text-[10px] text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[10.5px]">
                        <span>📁</span>
                        <span>Engineering/</span>
                      </div>
                      <div className="pl-4 flex items-center justify-between text-zinc-300 py-0.5">
                        <span className="truncate">📄 RateLimiter-Pattern.md</span>
                        <span className="text-[8.5px] text-indigo-400/80 shrink-0">#system-design</span>
                      </div>
                      <div className="pl-4 flex items-center justify-between text-zinc-300 py-0.5">
                        <span className="truncate">📄 FastAPI-TokenBucket.md</span>
                        <span className="text-[8.5px] text-emerald-400/80 shrink-0">#python</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[10.5px] pt-1">
                        <span>📁</span>
                        <span>AI-Agents/</span>
                      </div>
                      <div className="pl-4 flex items-center justify-between text-zinc-300 py-0.5">
                        <span className="truncate">📄 Cursor-IDE-Prompts.md</span>
                        <span className="text-[8.5px] text-amber-400/80 shrink-0">#prompts</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary 1-Click Vault Download Button */}
                  <div className="space-y-2 pt-0.5">
                    <Link
                      href="/vault"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Obsidian Vault (.zip)</span>
                    </Link>

                    <Link
                      href="/vault"
                      className="w-full py-1.5 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-zinc-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Open in Web Dashboard</span>
                      <ArrowRight className="w-3 h-3 text-zinc-400" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Circular Slideshow Dots */}
            <div className="flex justify-center items-center gap-2 pt-1">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx as 0 | 1 | 2)}
                  className={`transition-all duration-300 rounded-full ${
                    activeStep === idx
                      ? 'w-7 h-1.5 bg-indigo-500 shadow-md shadow-indigo-500/50'
                      : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP 3-STAGE GRID FLOW (hidden lg:grid) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center">
            {/* STAGE 1: Download Extension & Open Reel */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3.5">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-[210px] py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Chrome &mdash; Free</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="relative group">
                <div className="relative w-[210px] h-[370px] rounded-[38px] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] border-4 border-[#252838] bg-gradient-to-b from-[#141522] via-[#0e0f17] to-[#07080c] flex flex-col justify-between p-4 select-none">
                  {/* Top Notch & Header */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-white/90 pt-1 px-1">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">
                      Reels
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-normal">
                      <Music className="w-3 h-3 text-pink-400 animate-pulse" />
                      <span>audio</span>
                    </div>
                  </div>

                  {/* Reel Video Center: Developer Syntax Highlighted Snippet */}
                  <div className="my-auto rounded-2xl bg-black/75 border border-white/[0.08] p-3 space-y-2 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/[0.08] pb-1.5">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        RateLimiter.ts
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="font-mono text-[9px] leading-relaxed text-zinc-300 space-y-1">
                      <p className="text-purple-300">class SlidingWindow &#123;</p>
                      <p className="pl-2 text-zinc-400">redis = new Redis();</p>
                      <p className="pl-2 text-emerald-300">async check(ip) &#123;</p>
                      <p className="pl-4 text-amber-300">return count &lt;= 10;</p>
                      <p className="pl-2 text-zinc-500">&#125;</p>
                      <p className="text-zinc-500">&#125;</p>
                    </div>
                  </div>

                  {/* Bottom Metadata & Floating Actions */}
                  <div className="flex items-end justify-between gap-2 pt-2">
                    <div className="space-y-1.5 text-left flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                          D
                        </div>
                        <span className="text-[10px] font-bold text-white truncate">@dev_patterns</span>
                      </div>
                      <p className="text-[9.5px] text-zinc-300 line-clamp-2 leading-tight">
                        Redis sliding window token bucket pattern ⚡
                      </p>
                    </div>

                    {/* Right Floating Actions */}
                    <div className="flex flex-col items-center gap-2 text-zinc-300 shrink-0">
                      <div className="flex flex-col items-center">
                        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                        <span className="text-[8px] font-mono text-zinc-400">14k</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MessageCircle className="w-3.5 h-3.5 text-zinc-300" />
                        <span className="text-[8px] font-mono text-zinc-400">284</span>
                      </div>
                      <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STAGE 2: Chrome Side Panel Controller (Set Count & Start) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-4 px-1">
              <div className="w-full max-w-[310px] p-5 rounded-2xl bg-[#141622] border border-white/[0.08] shadow-2xl space-y-3.5 text-left select-none">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl overflow-hidden bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center p-0.5 shadow-sm">
                      <Image
                        src="/logos/icon-128.png"
                        alt="Reel Analyzer"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">Reel Analyzer</h4>
                      <span className="text-[10px] text-zinc-400 font-mono">Chrome Side Panel</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ready</span>
                  </div>
                </div>

                {/* Connection Status Grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04] text-zinc-400">
                    <div className="text-[9px] text-zinc-500 uppercase">Instagram</div>
                    <div className="text-zinc-200 font-medium truncate">Reel Detected</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04] text-zinc-400">
                    <div className="text-[9px] text-zinc-500 uppercase">Meta AI</div>
                    <div className="text-emerald-400 font-medium truncate">Connected</div>
                  </div>
                </div>

                {/* Batch Controller Box */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-200 font-semibold">Reels to summarize</span>
                    <div className="px-3 py-1 rounded-lg bg-black border border-indigo-500/30 font-mono text-xs font-bold text-indigo-300 shadow-inner">
                      5
                    </div>
                  </div>

                  {/* Real-Time Progress Bar */}
                  <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-400">Processing Reel 3 of 5</span>
                      <span className="text-emerald-400 font-bold">60%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-indigo-300 pt-0.5">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Extracting takeaways &amp; code via Meta AI...</span>
                    </div>
                  </div>

                  {/* Start / Stop Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer">
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start</span>
                    </div>
                    <div className="py-2 rounded-lg bg-white/[0.04] text-zinc-500 text-xs font-medium flex items-center justify-center">
                      Stop
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <span>Auto-Structuring</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            {/* STAGE 3: Structured Knowledge Studio & Obsidian Download */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-sm rounded-2xl bg-[#161822] border border-white/[0.08] p-5 shadow-2xl text-left flex flex-col justify-between space-y-4 min-h-[410px]">
                {/* Vault Package Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 shadow-sm">
                        <FolderTree className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Obsidian-Vault.zip</div>
                        <div className="text-[10px] text-zinc-400 font-mono">5 Formatted Notes &bull; YAML Frontmatter</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      Ready
                    </span>
                  </div>

                  {/* Vault File Tree Preview */}
                  <div className="space-y-1.5 font-mono text-[11px] text-zinc-300 bg-black/40 p-3 rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs">
                      <span>📁</span>
                      <span>Engineering/</span>
                    </div>
                    <div className="pl-4 flex items-center justify-between text-zinc-300 py-0.5">
                      <span className="truncate">📄 RateLimiter-Pattern.md</span>
                      <span className="text-[9px] text-indigo-400/80 shrink-0 font-medium">#system-design</span>
                    </div>
                    <div className="pl-4 flex items-center justify-between text-zinc-300 py-0.5">
                      <span className="truncate">📄 FastAPI-TokenBucket.md</span>
                      <span className="text-[9px] text-emerald-400/80 shrink-0 font-medium">#python</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs pt-1">
                      <span>📁</span>
                      <span>AI-Agents/</span>
                    </div>
                    <div className="pl-4 flex items-center justify-between text-zinc-300 py-0.5">
                      <span className="truncate">📄 Cursor-IDE-Prompts.md</span>
                      <span className="text-[9px] text-amber-400/80 shrink-0 font-medium">#prompts</span>
                    </div>
                  </div>
                </div>

                {/* Primary 1-Click Vault Download Button */}
                <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                  <Link
                    href="/vault"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Obsidian Vault (.zip)</span>
                  </Link>

                  <div className="flex items-center justify-between text-xs text-zinc-400 px-0.5">
                    <Link
                      href="/vault"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors text-xs font-semibold"
                    >
                      <span>Open in Web Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] font-mono text-emerald-400 font-medium">5 Notes Saved</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Prominent Chrome Store Download CTA — Never Missed */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-[#131524] to-purple-950/40 border border-indigo-500/25 shadow-2xl text-center sm:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-medium text-indigo-300">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Official Chrome Extension</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Start Summarizing Instagram Reels Today
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              100% free forever. No subscriptions, API quotas, or credit card required.
            </p>
          </div>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Add to Chrome &mdash; Free</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
