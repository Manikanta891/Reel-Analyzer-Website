'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Terminal } from 'lucide-react';

interface ToolItem {
  icon: typeof Cpu;
  title: string;
  desc: string;
  tag: string;
}

const TOOLS: ToolItem[] = [
  {
    icon: Cpu,
    title: 'Cursor & VS Code',
    desc: 'Paste structured context straight into Composer or Chat to build full features.',
    tag: 'IDE Coding Agents',
  },
  {
    icon: Sparkles,
    title: 'ChatGPT & Gemini',
    desc: 'Ask deep follow-up questions, debug edge cases, and generate implementations.',
    tag: 'LLM Reasoning',
  },
  {
    icon: Terminal,
    title: 'Claude Code & CLI',
    desc: 'Feed reel context directly into autonomous terminal coding swarms.',
    tag: 'Agent Swarms',
  },
];

export const ToolAutoCarousel: React.FC = () => {
  const [activeTool, setActiveTool] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTool((prev) => (prev + 1) % TOOLS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-6">
      {/* Desktop View: 3-column grid */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-5">
        {TOOLS.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mx-auto text-sm">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-100">{tool.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{tool.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Mobile View: Smooth Auto-Advancing Snap Carousel */}
      <div
        className="sm:hidden space-y-4"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {(() => {
          const current = TOOLS[activeTool];
          const Icon = current.icon;
          return (
            <div className="p-6 rounded-2xl bg-[#12131a] border border-indigo-500/20 shadow-xl space-y-3 text-center transition-all duration-300 min-h-[160px] flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-sm">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                  {current.tag}
                </div>
                <h3 className="font-bold text-base text-zinc-100">{current.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  {current.desc}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-2 pt-1">
          {TOOLS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTool(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeTool === idx
                  ? 'w-6 bg-indigo-400'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to tool ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
