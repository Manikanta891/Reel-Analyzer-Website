'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  Layers,
  Video,
  FileSpreadsheet,
  FolderTree,
  ShieldCheck,
  BrainCircuit,
  Code2,
  Cpu,
  Zap,
  FileCode2,
  Sparkles,
} from 'lucide-react';

const ICON_MAP = {
  target: Target,
  layers: Layers,
  video: Video,
  fileSpreadsheet: FileSpreadsheet,
  folderTree: FolderTree,
  shieldCheck: ShieldCheck,
  brainCircuit: BrainCircuit,
  code2: Code2,
  cpu: Cpu,
  zap: Zap,
  fileCode2: FileCode2,
  sparkles: Sparkles,
};

export type PillarIconKey = keyof typeof ICON_MAP;

export interface PillarItem {
  iconName?: PillarIconKey;
  title: string;
  desc: string;
  badge?: string;
  iconColor?: string;
  iconBg?: string;
  iconBorder?: string;
}

interface PillarAutoCarouselProps {
  pillars: PillarItem[];
  intervalMs?: number;
}

export const PillarAutoCarousel: React.FC<PillarAutoCarouselProps> = ({
  pillars,
  intervalMs = 3400,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || pillars.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pillars.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPaused, pillars.length, intervalMs]);

  if (!pillars || pillars.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Desktop View: Clean 3-Column Grid */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {pillars.map((item, idx) => {
          const Icon = (item.iconName && ICON_MAP[item.iconName]) || Sparkles;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  item.iconBg || 'bg-indigo-500/10'
                } ${item.iconBorder || 'border border-indigo-500/20'} ${
                  item.iconColor || 'text-indigo-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-100">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Mobile View: Auto-Advancing Interactive Slideshow */}
      <div
        className="sm:hidden space-y-3"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {(() => {
          const current = pillars[activeIndex];
          const Icon = (current.iconName && ICON_MAP[current.iconName]) || Sparkles;
          return (
            <div className="p-5 rounded-2xl bg-[#12131a] border border-indigo-500/20 shadow-xl space-y-3 min-h-[145px] flex flex-col justify-center transition-all duration-300">
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    current.iconBg || 'bg-indigo-500/15'
                  } ${current.iconBorder || 'border border-indigo-500/30'} ${
                    current.iconColor || 'text-indigo-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                  {activeIndex + 1} / {pillars.length}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-100">{current.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{current.desc}</p>
              </div>
            </div>
          );
        })()}

        {/* Swipe / Progress Dots */}
        <div className="flex justify-center items-center gap-2 pt-0.5">
          {pillars.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? 'w-6 h-1.5 bg-indigo-500'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
