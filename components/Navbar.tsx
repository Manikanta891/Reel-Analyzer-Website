'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  RefreshCw,
  Bookmark,
  Layers,
  CheckCircle2,
  Eye,
  Brain,
} from 'lucide-react';

interface NavbarProps {
  onOpenSync: () => void;
  onOpenExport: () => void;
  uniqueVisitors: number;
  isExtensionConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSync,
  onOpenExport,
  uniqueVisitors,
  isExtensionConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0c10]/85 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Extension Icon */}
        <Link
          href="/"
          title="Return to Homepage"
          className="flex items-center gap-3 flex-shrink-0 group cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center group-hover:border-white/[0.2] transition-colors">
            <Image
              src="/logos/icon-48.png"
              alt="Reel Analyzer"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-100 group-hover:text-indigo-400 transition-colors">
              Reel Analyzer
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06] hidden sm:inline">
              Studio
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Extension Synced Badge */}
          {isExtensionConnected && (
            <div
              title="Chrome extension connected"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400"
            >
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-[11px] font-medium">Bridge Active</span>
            </div>
          )}

          {/* Sync Button */}
          <button
            onClick={onOpenSync}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14151e] hover:bg-[#1a1c28] border border-white/[0.08] text-xs font-medium text-zinc-300 transition-colors active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
            <span className="hidden sm:inline">Import &amp; Sync</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Export .md</span>
          </button>
        </div>
      </div>
    </header>
  );
};
