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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.1] bg-zinc-900 flex items-center justify-center">
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
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-brand-300 transition-colors">
              Reel Analyzer
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06]">
              v1.0
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#privacy" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Message Creator
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Extension Status Badge */}
          {isExtensionConnected ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Extension Active</span>
            </div>
          ) : (
            <a
              href="https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-xs font-medium text-zinc-300 border border-white/[0.08] transition-colors"
            >
              <span>Install Extension</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
            </a>
          )}

          {/* Primary Action Button to Launch Knowledge Vault */}
          <Link
            href="/vault"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg shadow-brand-600/20 transition-all duration-150 active:scale-[0.98]"
          >
            <span>Open Vault</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
};
