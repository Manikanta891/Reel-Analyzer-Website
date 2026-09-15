'use client';

import React from 'react';
import { Bookmark, Folder, Layers, Wrench } from 'lucide-react';

interface StatsCounterProps {
  totalReels: number;
  totalDomains: number;
  totalSubtopics: number;
  totalEntities: number;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({
  totalReels,
  totalDomains,
  totalSubtopics,
  totalEntities,
}) => {
  const stats = [
    {
      label: 'Reels Saved',
      value: totalReels.toLocaleString(),
      icon: Bookmark,
    },
    {
      label: 'Categories',
      value: totalDomains.toLocaleString(),
      icon: Folder,
    },
    {
      label: 'Subtopics',
      value: totalSubtopics.toLocaleString(),
      icon: Layers,
    },
    {
      label: 'Tools Cataloged',
      value: totalEntities.toLocaleString(),
      icon: Wrench,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl p-4 bg-zinc-900/50 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.14] transition-all duration-150 flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] font-medium text-zinc-400 mb-1">
                {stat.label}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono tabular-nums">
                {stat.value}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 border border-white/[0.06]">
              <Icon className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
