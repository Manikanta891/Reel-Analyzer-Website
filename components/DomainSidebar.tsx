'use client';

import React from 'react';
import { FolderTree, Layers, Sparkles } from 'lucide-react';
import { SidebarAdSpot } from '@/components/ads/SidebarAdSpot';

interface DomainSidebarProps {
  domains: string[];
  selectedDomain: string;
  onSelectDomain: (domain: string) => void;
  domainCounts: { [domain: string]: number };
  totalCount: number;
}

export const DomainSidebar: React.FC<DomainSidebarProps> = ({
  domains,
  selectedDomain,
  onSelectDomain,
  domainCounts,
  totalCount,
}) => {
  return (
    <aside className="w-full lg:w-60 flex-shrink-0 space-y-4">
      {/* Categories Card */}
      <div className="rounded-xl bg-[#12131a] border border-white/[0.06] p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2 px-2 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Knowledge Topics
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {domains.length}
          </span>
        </div>

        <div className="space-y-1">
          {/* All Categories Button */}
          <button
            onClick={() => onSelectDomain('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
              selectedDomain === 'All'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/25'
                : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
              <span>All Topics</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-medium ${
                selectedDomain === 'All'
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'bg-white/[0.04] text-zinc-400'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Universal Category List */}
          {domains.map((domain) => {
            const count = domainCounts[domain] || 0;
            const isSelected = selectedDomain === domain;

            return (
              <button
                key={domain}
                onClick={() => onSelectDomain(domain)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                  isSelected
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/25'
                    : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FolderTree className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{domain}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-medium ml-2 flex-shrink-0 ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-white/[0.04] text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Partner Spot */}
      <div className="rounded-xl bg-[#12131a] border border-white/[0.06] p-3 shadow-sm">
        <SidebarAdSpot />
      </div>
    </aside>
  );
};
