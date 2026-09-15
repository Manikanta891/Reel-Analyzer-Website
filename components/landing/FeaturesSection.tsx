'use client';

import React from 'react';
import {
  Zap,
  FolderTree,
  FileCode2,
  Lock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Continuous Batch Mode',
    description:
      'Set your target reel count and let the extension auto-navigate and summarize multiple reels continuously.',
    badge: 'Automated',
  },
  {
    icon: FolderTree,
    title: 'Smart Topic Categorization',
    description:
      'Automatically sorts insights into high-level engineering domains and specific subtopic trees over time.',
    badge: 'Organized',
  },
  {
    icon: FileCode2,
    title: 'Pure Markdown Notes',
    description:
      'Retains semantic headings, bold keypoints, actionable lists, and code blocks with zero formatting loss.',
    badge: 'Clean Code',
  },
  {
    icon: Lock,
    title: '100% Local & Private',
    description:
      'Your notes and taxonomy remain strictly inside your browser storage. Zero accounts and zero tracking.',
    badge: 'Local-First',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="min-h-screen flex flex-col justify-between items-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-white/[0.08] relative"
    >
      <div className="w-full max-w-5xl mx-auto my-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-zinc-900 text-brand-400 border border-white/[0.08] inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>Core Capabilities</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Efficient Learning
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
            Everything you need to turn temporary video consumption into permanent knowledge.
          </p>
        </div>

        {/* 2x2 Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-brand-500/30 p-6 backdrop-blur-xl transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center border border-white/[0.06] group-hover:text-brand-300 transition-colors">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono border border-white/[0.06]">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {f.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll to next section */}
      <a
        href="#contact"
        className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 text-[11px] font-mono transition-colors"
      >
        <span>Get in Touch</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </a>
    </section>
  );
};
