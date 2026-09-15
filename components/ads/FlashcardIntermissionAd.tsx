'use client';

import React from 'react';
import { ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

interface FlashcardIntermissionAdProps {
  slotId?: string;
  sponsorName?: string;
  category?: string;
  title?: string;
  description?: string;
  link?: string;
}

export const FlashcardIntermissionAd: React.FC<FlashcardIntermissionAdProps> = ({
  slotId = 'flashcard-milestone-01',
  sponsorName = 'DevFlow Cloud',
  category = 'Sponsored Partner',
  title = 'Automate Your Full-Stack CI/CD & Deployments',
  description = 'Build, preview, and deploy high-performance applications with global edge caching and instant rollbacks.',
  link = 'https://github.com',
}) => {
  const devMockup = (
    <div className="my-4 rounded-xl bg-zinc-950/70 border border-dashed border-white/[0.12] p-4 text-left">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06]">
            {category}
          </span>
          <span className="text-[11px] text-zinc-500">via {sponsorName}</span>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
          DEV PREVIEW
        </span>
      </div>

      <h4 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
        <span>{title}</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400/80" strokeWidth={1.5} />
      </h4>

      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
        {description}
      </p>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
      >
        <span>Learn More</span>
        <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
      </a>
    </div>
  );

  return (
    <AdSenseUnit
      slotId={slotId}
      format="rectangle"
      devMockup={devMockup}
    />
  );
};
