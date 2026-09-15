'use client';

import React from 'react';
import { FolderClosed, Layers } from 'lucide-react';
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
    <aside className="w-full lg:w-56 flex-shrink-0 space-y-4">
      {/* Categories Card */}
      <div className="rounded-2xl bg-zinc-900/50 border border-white/[0.08] p-3 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2.5 px-2.5 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Categories
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            {domains.length}
          </span>
        </div>

        <div className="space-y-1">
          {/* All Categories Button */}
          <button
            onClick={() => onSelectDomain('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] ${
              selectedDomain === 'All'
                ? 'bg-zinc-800 text-white font-semibold border border-white/[0.1]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
              <span>All</span>
            </div>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-medium ${
                selectedDomain === 'All'
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-800/60 text-zinc-400'
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-semibold border border-white/[0.1]'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FolderClosed className="w-4 h-4 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{domain}</span>
                </div>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-medium ml-2 flex-shrink-0 ${
                    isSelected
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-800/60 text-zinc-400'
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
      <div className="rounded-2xl bg-zinc-900/50 border border-white/[0.08] p-3 backdrop-blur-xl">
        <SidebarAdSpot />
      </div>
    </aside>
  );
};
