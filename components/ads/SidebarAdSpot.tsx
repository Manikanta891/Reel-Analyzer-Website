'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

interface SidebarAdSpotProps {
  slotId?: string;
  sponsorName?: string;
  tagline?: string;
  link?: string;
}

export const SidebarAdSpot: React.FC<SidebarAdSpotProps> = ({
  slotId = 'sidebar-unit-01',
  sponsorName = 'Developer Toolkit Pro',
  tagline = 'Deploy Next.js apps with automated zero-downtime rollouts.',
  link = 'https://github.com',
}) => {
  const devMockup = (
    <div className="mt-4 pt-3 border-t border-white/[0.08]">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
          Sponsored
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            DEV
          </span>
          <Sparkles className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
        </div>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block p-3 rounded-xl bg-[#12131a] hover:bg-[#171822] border border-white/[0.06] hover:border-white/[0.14] transition-colors duration-150 group"
      >
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
            {sponsorName}
          </span>
          <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" strokeWidth={1.5} />
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
          {tagline}
        </p>
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
