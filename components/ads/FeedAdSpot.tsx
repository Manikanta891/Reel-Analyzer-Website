'use client';

import React from 'react';
import { ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

interface FeedAdSpotProps {
  slotId?: string;
  sponsorName?: string;
  category?: string;
  title?: string;
  description?: string;
  link?: string;
}

export const FeedAdSpot: React.FC<FeedAdSpotProps> = ({
  slotId = 'feed-unit-01',
  sponsorName = 'DevFlow Cloud',
  category = 'Sponsored Resource',
  title = 'Automate Your Full-Stack CI/CD & Deployments',
  description = 'Build, preview, and deploy high-performance applications with global edge caching and instant rollbacks.',
  link = 'https://github.com',
}) => {
  const devMockup = (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group relative rounded-2xl bg-zinc-900/30 border border-dashed border-white/[0.12] hover:border-white/[0.24] p-5 sm:p-6 backdrop-blur-md transition-colors duration-150 flex flex-col justify-between hover:bg-zinc-900/60"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 border border-white/[0.06]">
              {category}
            </span>
            <span className="text-[11px] font-medium text-zinc-500">
              via {sponsorName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
              DEV AD PREVIEW
            </span>
            <div className="p-1.5 rounded-lg bg-zinc-800/60 text-zinc-400 group-hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-zinc-200 tracking-tight leading-snug mb-2 group-hover:text-white transition-colors flex items-center gap-2">
          <span>{title}</span>
          <Sparkles className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" strokeWidth={1.5} />
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="border-t border-white/[0.06] pt-3 mt-2 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
        <span className="font-medium text-[11px] text-zinc-400">Learn More</span>
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </div>
    </a>
  );

  return (
    <AdSenseUnit
      slotId={slotId}
      format="fluid"
      devMockup={devMockup}
    />
  );
};
