'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ExternalLink,
  Menu,
  X,
  BookOpen,
  CheckCircle2,
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b0c10]/90 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 shadow-sm">
            <Image
              src="/logos/icon-48.png"
              alt="Reel Analyzer Logo"
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
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hidden sm:inline">
              Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Extension Synced Badge (Tablet/Desktop only) */}
          {isExtensionConnected && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bridge Active</span>
            </div>
          )}

          {/* Primary Action Button */}
          <Link
            href="/vault"
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <span>Open Vault</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>

          {/* Mobile Menu Hamburger Button (44px touch area) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border border-white/[0.06] transition-colors"
            aria-label="Toggle mobile navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Full Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-[#0b0c10]/95 backdrop-blur-2xl border-b border-white/[0.08] px-5 py-6 flex flex-col justify-between md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-zinc-200 border border-white/[0.04] transition-colors"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-zinc-200 border border-white/[0.04] transition-colors"
            >
              <span>Features &amp; Notes</span>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </a>
            <Link
              href="/privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-zinc-200 border border-white/[0.04] transition-colors"
            >
              <span>Privacy Policy</span>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </Link>
          </nav>

          {/* Bottom Action Cards */}
          <div className="space-y-3 pt-4 border-t border-white/[0.06]">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/vault"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-xs font-bold border border-white/[0.08] flex items-center justify-center gap-2"
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
