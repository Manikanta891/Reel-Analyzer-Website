'use client';

import React, { useState } from 'react';
import { ExternalLink, X, Sparkles } from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

interface TopBannerAdSpotProps {
  slotId?: string;
  sponsorName?: string;
  copy?: string;
  ctaText?: string;
  link?: string;
}

export const TopBannerAdSpot: React.FC<TopBannerAdSpotProps> = ({
  slotId = 'top-banner-unit-01',
  sponsorName = 'CloudScale',
  copy = 'High-speed Redis & vector database hosting for AI developers.',
  ctaText = 'Start Free',
  link = 'https://github.com',
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const devMockup = (
    <div className="mb-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] p-2.5 sm:px-4 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06] flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" strokeWidth={1.5} />
          <span>Partner</span>
        </span>
        <span className="font-semibold text-zinc-300 truncate">
          {sponsorName}:
        </span>
        <span className="text-zinc-400 truncate hidden sm:inline">
          {copy}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/80 border border-amber-500/20 hidden md:inline">
          DEV PREVIEW
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
        </a>
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss banner"
          aria-label="Dismiss banner"
          className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );

  return (
    <AdSenseUnit
      slotId={slotId}
      format="horizontal"
      devMockup={devMockup}
    />
  );
};
