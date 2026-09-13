'use client';

import React, { useState } from 'react';
import { Wrench, Search, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { ReelItem, EntitySummary } from '@/types';

interface ToolsDirectoryProps {
  reels: ReelItem[];
  onSelectReel: (reel: ReelItem) => void;
}

export const ToolsDirectory: React.FC<ToolsDirectoryProps> = ({
  reels,
  onSelectReel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<EntitySummary | null>(null);

  // Aggregate entities
  const entityMap: { [name: string]: { count: number; domains: Set<string>; reels: ReelItem[] } } =
    {};

  reels.forEach((reel) => {
    if (!reel.entities) return;
    const items = reel.entities.split(',').map((e) => e.trim()).filter(Boolean);
    items.forEach((ent) => {
      if (!entityMap[ent]) {
        entityMap[ent] = { count: 0, domains: new Set(), reels: [] };
      }
      entityMap[ent].count += 1;
      if (reel.domain) entityMap[ent].domains.add(reel.domain);
      entityMap[ent].reels.push(reel);
    });
  });

  const entityList: EntitySummary[] = Object.entries(entityMap)
    .map(([name, data]) => ({
      name,
      count: data.count,
      domains: Array.from(data.domains),
      reels: data.reels,
    }))
    .sort((a, b) => b.count - a.count);

  const filteredEntities = entityList.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.domains.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/[0.08] backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
            <span>Tools & Frameworks Directory</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Aggregated software, libraries, and frameworks referenced across saved insights.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search tools or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-white/[0.08] focus:border-brand-500 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid of Entity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEntities.map((ent) => (
          <div
            key={ent.name}
            onClick={() => setSelectedEntity(ent)}
            className="rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-white/[0.16] p-5 backdrop-blur-md transition-all duration-150 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/[0.06]">
                  {ent.count} {ent.count === 1 ? 'mention' : 'mentions'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
              </div>

              <h4 className="text-sm font-semibold text-white font-mono">
                {ent.name}
              </h4>

              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {ent.domains.map((d) => (
                  <span
                    key={d}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-400 border border-white/[0.04]"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
              <span>View Insights</span>
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* Spotlight Drawer Modal */}
      {selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-zinc-900 border border-white/[0.1] rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Tool Spotlight
                </span>
                <h3 className="text-xl font-bold text-white font-mono mt-0.5">
                  {selectedEntity.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              <p className="text-xs text-zinc-400 mb-2">
                Referenced in {selectedEntity.reels.length} saved insights:
              </p>

              {selectedEntity.reels.map((reel) => (
                <div
                  key={reel.url}
                  className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="text-[11px] font-medium text-zinc-400 mb-1">
                      {reel.domain} &gt; {reel.subdomain}
                    </div>
                    <h5 className="text-sm font-semibold text-white mb-1">
                      {reel.subject}
                    </h5>
                    {reel.personalUtility && (
                      <p className="text-xs text-zinc-300">
                        {reel.personalUtility}
                      </p>
                    )}
                  </div>
                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex-shrink-0"
                    title="View Instagram Reel"
                    aria-label="View Instagram Reel"
                  >
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
