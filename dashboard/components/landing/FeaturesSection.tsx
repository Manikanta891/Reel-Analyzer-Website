'use client';

import React from 'react';
import {
  FolderTree,
  Layers,
  Wrench,
  Download,
  Search,
  Lock,
  Sparkles,
} from 'lucide-react';

const FEATURES = [
  {
    icon: FolderTree,
    title: '2-Tier Emergent Taxonomy',
    description:
      'Categorizes saved reels into macro domains (e.g. AI & LLMs, Web Dev) and specific subtopics with live counter pills.',
  },
  {
    icon: Layers,
    title: 'Active-Recall Study Flashcards',
    description:
      'Practice knowledge retention using full-screen fixed-height flashcards with spacebar flip controls and milestone checkpoints.',
  },
  {
    icon: Wrench,
    title: 'Tools & Ecosystem Directory',
    description:
      'Aggregates every software tool, framework, and library mentioned in your reels with usage frequency metrics.',
  },
  {
    icon: Download,
    title: 'Obsidian & Markdown Playbooks',
    description:
      'Export formatted markdown playbooks ready for your second brain, Notion workspace, or local Markdown vault with one click.',
  },
  {
    icon: Search,
    title: 'Multi-Field Search & Table View',
    description:
      'Instantly search across creators, topics, and tools with both visual 2-column card grid and compact table view modes.',
  },
  {
    icon: Lock,
    title: '100% Local-First & Private',
    description:
      'Your video insights reside solely in your browser storage. Zero accounts required, zero tracking of your personal habits.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-zinc-950 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-md bg-zinc-900 text-brand-400 border border-white/[0.08] inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3 h-3 text-brand-400" strokeWidth={1.5} />
            <span>Core Capabilities</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built for High-Velocity Learning
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Every feature designed to help developers extract maximum value from short-form technical video.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/[0.16] p-6 backdrop-blur-xl transition-colors duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center border border-white/[0.06] mb-4">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">
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
    </section>
  );
};
