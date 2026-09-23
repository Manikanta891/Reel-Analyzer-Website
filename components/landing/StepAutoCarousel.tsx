'use client';

import React, { useState, useEffect } from 'react';

interface Step {
  num: number;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: 1,
    title: 'Browse Saved Reels',
    desc: 'Open Instagram on desktop and navigate to your Saved tab or any reel video.',
  },
  {
    num: 2,
    title: '1-Click AI Extract',
    desc: 'Reel Analyzer uses Meta AI in your browser to extract structured takeaways, steps, and code.',
  },
  {
    num: 3,
    title: 'Export to Obsidian',
    desc: 'Download formatted .md files or a complete .zip vault and drop them into your Obsidian folder.',
  },
];

export const StepAutoCarousel: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-6">
      {/* Desktop View: 3-column grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
              {step.num}
            </div>
            <h3 className="font-bold text-base text-zinc-100">{step.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Mobile View: Smooth Auto-Advancing Snap Carousel */}
      <div
        className="md:hidden space-y-4"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="p-6 rounded-2xl bg-[#12131a] border border-indigo-500/20 shadow-xl space-y-3 transition-all duration-300 min-h-[160px] flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-sm">
              {STEPS[activeStep].num}
            </div>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
              Step {activeStep + 1} of {STEPS.length}
            </span>
          </div>
          <h3 className="font-bold text-base text-zinc-100">
            {STEPS[activeStep].title}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {STEPS[activeStep].desc}
          </p>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-2 pt-1">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeStep === idx
                  ? 'w-6 bg-indigo-400'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
