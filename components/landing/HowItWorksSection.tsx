'use client';

import React from 'react';
import {
  MousePointerClick,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: MousePointerClick,
    title: '1-Click Capture on Instagram',
    description:
      'While scrolling Instagram Reels, click the extension overlay on any video to trigger instant background transcription and analysis.',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Instant Free AI Structuring',
    description:
      'Our built-in engine parses the video into a 4-tier structured playbook (Core Premise, Implementation Steps, Golden Takeaways, and Tools). Zero API key setup required.',
  },
  {
    step: '03',
    icon: Layers,
    title: 'Study & Export in Web Vault',
    description:
      'All insights synchronize automatically into your local Knowledge Vault. Practice with active-recall flashcards or export markdown playbooks to your personal notes.',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-zinc-950 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-md bg-zinc-900 text-brand-400 border border-white/[0.08] inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3 h-3 text-brand-400" strokeWidth={1.5} />
            <span>Workflow Pipeline</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Reel Analyzer Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Transform temporary video consumption into permanent, organized knowledge in 3 steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/[0.16] p-6 backdrop-blur-xl transition-colors duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold text-zinc-500">
                      STEP {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 text-brand-400 flex items-center justify-center border border-white/[0.06]">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-3.5 mt-5 flex items-center text-[11px] font-mono text-zinc-500">
                  <span>Seamless sync to Knowledge Vault</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
