'use client';

import React from 'react';

interface SubdomainPillsProps {
  subdomains: string[];
  selectedSubdomain: string;
  onSelectSubdomain: (subdomain: string) => void;
  subdomainCounts: { [subdomain: string]: number };
  totalInDomain: number;
}

export const SubdomainPills: React.FC<SubdomainPillsProps> = ({
  subdomains,
  selectedSubdomain,
  onSelectSubdomain,
  subdomainCounts,
  totalInDomain,
}) => {
  if (subdomains.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none">
      <button
        onClick={() => onSelectSubdomain('All')}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 active:scale-[0.98] ${
          selectedSubdomain === 'All'
            ? 'bg-zinc-800 text-white font-semibold border border-white/[0.12]'
            : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:bg-zinc-800/40'
        }`}
      >
        <span>All</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-medium">
          {totalInDomain}
        </span>
      </button>

      {subdomains.map((sub) => {
        const count = subdomainCounts[sub] || 0;
        const isSelected = selectedSubdomain === sub;

        return (
          <button
            key={sub}
            onClick={() => onSelectSubdomain(sub)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 active:scale-[0.98] ${
              isSelected
                ? 'bg-zinc-800 text-white font-semibold border border-white/[0.12]'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:bg-zinc-800/40'
            }`}
          >
            <span>{sub}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-medium">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
