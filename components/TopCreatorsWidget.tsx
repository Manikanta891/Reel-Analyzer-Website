'use client';

import React, { useState } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CreatorCount {
  creator: string;
  count: number;
}

interface TopCreatorsWidgetProps {
  creators: CreatorCount[];
  selectedCreator: string;
  onSelectCreator: (creator: string) => void;
  pageSize?: number;
}

export const TopCreatorsWidget: React.FC<TopCreatorsWidgetProps> = ({
  creators,
  selectedCreator,
  onSelectCreator,
  pageSize = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!creators || creators.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(creators.length / pageSize) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedCreators = creators.slice(startIndex, startIndex + pageSize);

  const handleCreatorClick = (creatorHandle: string) => {
    if (selectedCreator.toLowerCase() === creatorHandle.toLowerCase()) {
      onSelectCreator('All');
    } else {
      onSelectCreator(creatorHandle);
    }
  };

  const getInitials = (name: string) => {
    const clean = name.replace(/^@/, '');
    if (!clean) return 'CR';
    const parts = clean.split(/[._-]/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  return (
    <div className="rounded-2xl bg-[#12131a] border border-white/[0.08] p-3 backdrop-blur-xl space-y-2.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-400" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Top Creators
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06]">
          {creators.length}
        </span>
      </div>

      {/* Creators List (5 Per Page) */}
      <div className="space-y-1">
        {paginatedCreators.map(({ creator, count }, idx) => {
          const isSelected =
            selectedCreator !== 'All' &&
            selectedCreator.toLowerCase() === creator.toLowerCase();
          const cleanName = creator.replace(/^@/, '');
          const rank = startIndex + idx + 1;

          return (
            <button
              key={creator}
              onClick={() => handleCreatorClick(cleanName)}
              title={`Filter by @${cleanName} (${count} saved ${count === 1 ? 'reel' : 'reels'})`}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] group ${
                isSelected
                  ? 'bg-indigo-600/20 text-white font-semibold border border-indigo-500/40 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {/* Avatar with dynamic initials & rank */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white shadow-md'
                      : rank <= 3
                      ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 border border-white/[0.1]'
                  }`}
                >
                  {getInitials(cleanName)}
                </div>

                {/* Creator Handle */}
                <span className="truncate text-left text-xs tracking-tight">
                  @{cleanName}
                </span>
              </div>

              {/* Reel Count Badge */}
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-medium ${
                    isSelected
                      ? 'bg-indigo-500 text-white'
                      : 'bg-zinc-800/80 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                  }`}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination Bar (When > pageSize) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] px-1 text-[11px] text-zinc-400">
          <span className="font-mono text-[10px] text-zinc-500">
            {startIndex + 1}-{Math.min(startIndex + pageSize, creators.length)} of {creators.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              aria-label="Previous 5 creators"
              title="Previous 5 creators"
              className={`p-1 rounded-lg border border-white/[0.06] transition-colors ${
                safePage === 1
                  ? 'text-zinc-600 cursor-not-allowed bg-zinc-900/20'
                  : 'text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-700 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {safePage}/{totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safePage === totalPages}
              aria-label="Next 5 creators"
              title="Next 5 creators"
              className={`p-1 rounded-lg border border-white/[0.06] transition-colors ${
                safePage === totalPages
                  ? 'text-zinc-600 cursor-not-allowed bg-zinc-900/20'
                  : 'text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-700 active:scale-95'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
