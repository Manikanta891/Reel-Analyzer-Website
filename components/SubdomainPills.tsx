'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_LIMIT = 5;

  if (subdomains.length === 0) return null;

  // Determine which subdomains to render
  const visibleSubdomains = isExpanded
    ? subdomains
    : subdomains.slice(0, INITIAL_LIMIT);

  const hiddenCount = subdomains.length - INITIAL_LIMIT;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none flex-wrap">
      {/* 'All' button */}
      <button
        onClick={() => onSelectSubdomain('All')}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
          selectedSubdomain === 'All'
            ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm'
            : 'bg-[#12131a] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.04]'
        }`}
      >
        <span>All</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 font-medium">
          {totalInDomain}
        </span>
      </button>

      {/* Render visible subdomains */}
      {visibleSubdomains.map((sub) => {
        const count = subdomainCounts[sub] || 0;
        const isSelected = selectedSubdomain === sub;

        return (
          <button
            key={sub}
            onClick={() => onSelectSubdomain(sub)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              isSelected
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm'
                : 'bg-[#12131a] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            <span>{sub}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 font-medium">
              {count}
            </span>
          </button>
        );
      })}

      {/* '+X more' or 'Show less' toggle button */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Show fewer subdomains' : `Show ${hiddenCount} more subdomains`}
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all"
        >
          <span>{isExpanded ? 'Show less' : `+${hiddenCount} more`}</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-indigo-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-indigo-400" />
          )}
        </button>
      )}
    </div>
  );
};
