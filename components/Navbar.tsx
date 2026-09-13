'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  RefreshCw,
  Bookmark,
  Wrench,
  Layers,
  CheckCircle2,
  Eye,
  Home,
} from 'lucide-react';

interface NavbarProps {
  onOpenSync: () => void;
  onOpenExport: () => void;
  uniqueVisitors: number;
  isExtensionConnected: boolean;
  activeTab: 'reels' | 'flashcards';
  onTabChange: (tab: 'reels' | 'flashcards') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSync,
  onOpenExport,
  uniqueVisitors,
  isExtensionConnected,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Extension Icon (Static Left) */}
        <Link
          href="/"
          title="Return to Homepage"
          className="flex items-center gap-3 flex-shrink-0 group cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/[0.1] bg-zinc-900 flex items-center justify-center group-hover:border-white/[0.25] transition-colors">
            <Image
              src="/logos/icon-48.png"
              alt="Reel Analyzer"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-brand-300 transition-colors">
              Reel Analyzer
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/[0.06] hidden sm:inline">
              Vault
            </span>
          </div>
        </Link>

        {/* Center Static Tabs: Reels | Flashcards (Never Shifts) */}
        <nav className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-white/[0.08]">
          <button
            onClick={() => onTabChange('reels')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTab === 'reels'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Reels</span>
          </button>
          <button
            onClick={() => onTabChange('flashcards')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTab === 'flashcards'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Flashcards</span>
          </button>
        </nav>

        {/* Right Static Actions */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Unique Visitors Count (Static text, no misleading pulse) */}
          <div
            title="Total unique visitors to this website"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-zinc-300"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
            <span className="font-mono tabular-nums text-zinc-200">
              {uniqueVisitors.toLocaleString()}
            </span>
            <span className="text-zinc-500 text-[11px]">visitors</span>
          </div>

          {/* Extension Synced Badge */}
          {isExtensionConnected && (
            <div
              title="Extension storage synchronized"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400"
            >
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="font-medium">Synced</span>
            </div>
          )}

          {/* Sync Button */}
          <button
            onClick={onOpenSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-200 transition-colors duration-150 active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-sm transition-colors duration-150 active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
