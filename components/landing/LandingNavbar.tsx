'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { subscribeToExtensionBridge } from '@/lib/storage';

export const LandingNavbar: React.FC = () => {
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToExtensionBridge(
      () => setIsExtensionConnected(true),
      () => setIsExtensionConnected(true)
    );
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b0c10]/80 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logos/icon-48.png"
              alt="Reel Analyzer Logo"
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
            <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
              Studio v1.1
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs text-zinc-400 font-medium">
          <a href="#how-it-works" className="hover:text-zinc-200 transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-zinc-200 transition-colors">
            Features
          </a>
          <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
            Privacy
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {isExtensionConnected && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bridge Synced</span>
            </div>
          )}

          {/* Primary Action Button to Launch Knowledge Vault */}
          <Link
            href="/vault"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-[0.98]"
          >
            <span>Open Vault</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
};
