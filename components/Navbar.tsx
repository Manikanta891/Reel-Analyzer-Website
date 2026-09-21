'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  onOpenSync: () => void;
  onOpenExport: () => void;
  uniqueVisitors: number;
  isExtensionConnected: boolean;
  totalNotesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSync,
  onOpenExport,
  isExtensionConnected,
  totalNotesCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0c10]/85 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          title="Return to Homepage"
          className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group cursor-pointer min-w-0"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center group-hover:border-indigo-500/40 transition-colors shadow-sm shrink-0">
            <Image
              src="/logos/icon-48.png"
              alt="Reel Analyzer"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-bold text-sm tracking-tight text-zinc-100 group-hover:text-indigo-400 transition-colors truncate">
              Reel Analyzer
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hidden sm:inline-flex shrink-0">
              Vault
            </span>
          </div>
        </Link>

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Extension Live Bridge Badge */}
          {isExtensionConnected && (
            <div
              title="Chrome extension bridge connected"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-[11px] font-medium">Bridge Active</span>
            </div>
          )}

          {/* Import / Sync Button */}
          <button
            onClick={onOpenSync}
            title="Import Markdown Playbooks or Obsidian Vault"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#14151e] hover:bg-[#1a1c28] border border-white/[0.08] text-xs font-medium text-zinc-300 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={1.5} />
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* Export Playbook Button */}
          <button
            onClick={onOpenExport}
            title="Export full playbook as Markdown"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            <span className="hidden sm:inline">Export Playbook</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
