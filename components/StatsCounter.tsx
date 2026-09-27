'use client';

import React from 'react';
import { Bookmark, FolderTree, Layers, Tag } from 'lucide-react';

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
      label: 'Knowledge Notes',
      value: totalReels.toLocaleString(),
      icon: Bookmark,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      label: 'Topic Domains',
      value: totalDomains.toLocaleString(),
      icon: FolderTree,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Subtopics & Tags',
      value: totalSubtopics.toLocaleString(),
      icon: Layers,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'Concepts & Tools',
      value: totalEntities.toLocaleString(),
      icon: Tag,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl p-4 bg-[#12131a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-150 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="text-[11px] font-medium text-zinc-400 mb-1">
                {stat.label}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight font-mono tabular-nums">
                {stat.value}
              </div>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>
              <Icon className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
