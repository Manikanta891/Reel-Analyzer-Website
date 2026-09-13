'use client';

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-zinc-900/40 border border-white/[0.06] p-6 animate-pulse flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-20 h-5 rounded-md bg-zinc-800" />
            <div className="w-24 h-5 rounded-md bg-zinc-800/60" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/50" />
            <div className="w-7 h-7 rounded-lg bg-zinc-800/50" />
          </div>
        </div>

        {/* Subject Title */}
        <div className="w-3/4 h-5 rounded-md bg-zinc-800 mb-2" />
        <div className="w-1/2 h-5 rounded-md bg-zinc-800 mb-4" />

        {/* Creator & Timestamp */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-20 h-3.5 rounded bg-zinc-800/60" />
          <div className="w-16 h-3.5 rounded bg-zinc-800/40" />
        </div>

        {/* Utility Box */}
        <div className="p-3.5 rounded-xl bg-zinc-800/30 border border-white/[0.04] mb-4">
          <div className="w-full h-3.5 rounded bg-zinc-800 mb-2" />
          <div className="w-2/3 h-3.5 rounded bg-zinc-800" />
        </div>

        {/* Tool Chips */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-14 h-5 rounded bg-zinc-800/50" />
          <div className="w-16 h-5 rounded bg-zinc-800/50" />
          <div className="w-12 h-5 rounded bg-zinc-800/50" />
        </div>
      </div>

      {/* Footer expander */}
      <div className="border-t border-white/[0.06] pt-3 mt-2">
        <div className="w-36 h-4 rounded bg-zinc-800/60" />
      </div>
    </div>
  );
};
