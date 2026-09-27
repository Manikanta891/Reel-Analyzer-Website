'use client';

import React, { useState } from 'react';
import {
  FolderTree,
  Layers,
  ChevronRight,
  ChevronDown,
  Hash,
  Database,
  ShieldCheck,
  Filter,
} from 'lucide-react';

interface DomainSidebarProps {
  domains: string[];
  selectedDomain: string;
  selectedSubdomain: string;
  onSelectDomain: (domain: string) => void;
  onSelectSubdomain: (subdomain: string) => void;
  domainCounts: { [domain: string]: number };
  subdomainMap: { [domain: string]: { [subdomain: string]: number } };
  totalCount: number;
}

export const DomainSidebar: React.FC<DomainSidebarProps> = ({
  domains,
  selectedDomain,
  selectedSubdomain,
  onSelectDomain,
  onSelectSubdomain,
  domainCounts,
  subdomainMap,
  totalCount,
}) => {
  // Store explicit collapsed/expanded overrides
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isDomainExpanded = (domain: string): boolean => {
    return expandedDomains[domain] !== undefined ? expandedDomains[domain] : true;
  };

  const toggleDomainExpand = (domain: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDomains((prev) => {
      const current = prev[domain] !== undefined ? prev[domain] : true;
      return {
        ...prev,
        [domain]: !current,
      };
    });
  };

  const activeLabel =
    selectedDomain === 'All'
      ? 'All Topics'
      : selectedSubdomain !== 'All'
      ? `${selectedDomain} > ${selectedSubdomain}`
      : selectedDomain;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
      {/* Category Tree Navigation Card */}
      <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-3.5 sm:p-4 shadow-xl">
        {/* Header (Clickable toggle on mobile, static on desktop) */}
        <div
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center justify-between cursor-pointer lg:cursor-default select-none px-1 py-1"
        >
          <div className="flex items-center gap-2 text-zinc-200">
            <Database className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Knowledge Topics
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 font-semibold border border-white/[0.08]">
              {domains.length}
            </span>
          </div>

          {/* Mobile indicator & Expand Icon */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-[11px] text-indigo-400 font-medium truncate max-w-[120px]">
              {activeLabel}
            </span>
            <div className="p-1 rounded-lg bg-white/[0.04] text-zinc-400">
              {isMobileOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {/* Tree Content (Always visible on lg:, toggleable on mobile) */}
        <div className={`mt-3 space-y-1 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
          {/* 'All Notes' Root Node */}
          <button
            onClick={() => {
              onSelectDomain('All');
              onSelectSubdomain('All');
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              selectedDomain === 'All'
                ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/40 shadow-sm'
                : 'text-zinc-300 hover:bg-white/[0.04] hover:text-white border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-400 shrink-0" strokeWidth={1.5} />
              <span>All Knowledge Notes</span>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-md font-semibold ${
                selectedDomain === 'All'
                  ? 'bg-indigo-500/30 text-indigo-200'
                  : 'bg-white/[0.06] text-zinc-300'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Hierarchical Domain & Subdomain Nodes */}
          {domains.map((domain) => {
            const count = domainCounts[domain] || 0;
            const isDomainActive = selectedDomain === domain;
            const isExpanded = isDomainExpanded(domain);
            const subMap = subdomainMap[domain] || {};
            const subList = Object.keys(subMap).sort();

            return (
              <div key={domain} className="space-y-0.5">
                {/* Domain Header Row */}
                <div
                  onClick={() => {
                    onSelectDomain(domain);
                    onSelectSubdomain('All');
                    setIsMobileOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isDomainActive && selectedSubdomain === 'All'
                      ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/40 shadow-sm'
                      : 'text-zinc-200 hover:bg-white/[0.04] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {subList.length > 0 ? (
                      <button
                        type="button"
                        onClick={(e) => toggleDomainExpand(domain, e)}
                        className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-100 transition-colors"
                        title={isExpanded ? 'Collapse subtopics' : 'Expand subtopics'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-300" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5" />
                    )}

                    <FolderTree className="w-4 h-4 text-zinc-400 shrink-0" strokeWidth={1.5} />
                    <span className="truncate font-medium">{domain}</span>
                  </div>

                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                      isDomainActive
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : 'bg-white/[0.06] text-zinc-300'
                    }`}
                  >
                    {count}
                  </span>
                </div>

                {/* Subdomain Children */}
                {isExpanded && subList.length > 0 && (
                  <div className="pl-6 space-y-0.5 border-l border-white/[0.08] ml-4 my-1">
                    {subList.map((sub) => {
                      const subCount = subMap[sub] || 0;
                      const isSubActive = isDomainActive && selectedSubdomain === sub;

                      return (
                        <button
                          key={sub}
                          onClick={() => {
                            onSelectDomain(domain);
                            onSelectSubdomain(sub);
                            setIsMobileOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                            isSubActive
                              ? 'bg-indigo-600/25 text-indigo-200 font-semibold border border-indigo-500/30'
                              : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Hash className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span className="truncate">{sub}</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400 ml-1 shrink-0 font-medium">
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Storage & Privacy Card (Hidden on mobile to save vertical canvas space, visible on lg:) */}
      <div className="hidden lg:block rounded-2xl bg-[#111218] border border-white/[0.08] p-4 shadow-xl text-xs space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Storage &amp; Privacy</span>
        </div>
        <div className="space-y-2 bg-[#0c0d12] p-3 rounded-xl border border-white/[0.06]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-300 font-medium">Local Vault</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
              Active (Offline-first)
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-white/[0.04]">
            <span className="text-zinc-300 font-medium">Data Format</span>
            <span className="font-mono text-zinc-100 font-semibold text-[11px]">
              Markdown / YAML
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-white/[0.04]">
            <span className="text-zinc-300 font-medium">Export Target</span>
            <span className="text-indigo-300 font-semibold text-[11px]">
              Obsidian / Notion
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
