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
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { subscribeToExtensionBridge } from '@/lib/storage';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const LandingNavbar: React.FC = () => {
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToExtensionBridge(
      () => setIsExtensionConnected(true),
      () => setIsExtensionConnected(true)
    );
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b0c10]/90 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0">
            <Image
              src="/logos/icon-48.png"
              alt="Reel Analyzer Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-100 group-hover:text-indigo-400 transition-colors">
              Reel Analyzer
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
              Studio v1.1
            </span>
          </div>
        </Link>

        {/* Desktop Center Nav Links */}
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
        <div className="flex items-center gap-2 sm:gap-3">
          {isExtensionConnected && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bridge Synced</span>
            </div>
          )}

          {/* Primary Action Button to Launch Knowledge Vault */}
          <Link
            href="/vault"
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-[0.98]"
          >
            <span>Open Vault</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-white/[0.06] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0e0f15] border-b border-white/[0.08] px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-zinc-300">
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/[0.04] text-zinc-300 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/[0.04] text-zinc-300 hover:text-white transition-colors"
            >
              Features &amp; Notes
            </a>
            <Link
              href="/privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/[0.04] text-zinc-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>

          <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2.5">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/vault"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#161822] hover:bg-[#1c1e2a] text-zinc-200 text-xs font-semibold border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Knowledge Vault</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
