'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { subscribeToExtensionBridge } from '@/lib/storage';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const LandingNavbar: React.FC = () => {
  const router = useRouter();
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddToChrome = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
    router.push('/vault');
  };

  useEffect(() => {
    const unsubscribe = subscribeToExtensionBridge(
      () => setIsExtensionConnected(true),
      () => setIsExtensionConnected(true)
    );
    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0c10]/95 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 shadow-sm">
              <Image
                src="/logos/icon-48.png"
                alt="Reel Analyzer — Instagram Reels AI Summarizer by Manikanta Sandula"
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
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <Link href="/#how-it-works" className="hover:text-zinc-200 transition-colors">
              How It Works
            </Link>
            <Link href="/#features" className="hover:text-zinc-200 transition-colors">
              Features
            </Link>
            <Link href="/use-cases/instagram-to-obsidian" className="hover:text-zinc-200 transition-colors">
              Obsidian Export
            </Link>
            <Link href="/use-cases/coding-agent-prompts" className="hover:text-zinc-200 transition-colors">
              AI Prompts
            </Link>
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

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border transition-colors ${
                isMobileMenuOpen
                  ? 'bg-white/[0.08] text-white border-white/[0.12]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] border-white/[0.06]'
              }`}
              aria-label="Toggle mobile navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Seamless Slide-Down Navbar Menu (Full-width, directly below header) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0b0c10] px-4 py-3 space-y-1 shadow-2xl animate-in slide-in-from-top-1 duration-150">
            <Link
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>How It Works</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>Features &amp; Notes</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/use-cases/instagram-to-obsidian"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>Use Case: Obsidian Export</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/use-cases/coding-agent-prompts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>Use Case: AI Coding Prompts</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/use-cases/instagram-reel-scraper"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>Use Case: Reel Scraper &amp; Transcripts</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
            <Link
              href="/privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>Privacy Policy</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
            <div className="pt-2 border-t border-white/[0.04]">
              <a
                href={CHROME_STORE_URL}
                onClick={handleAddToChrome}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors cursor-pointer"
              >
                <span>Add to Chrome &mdash; Free</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Dim backdrop to close when tapping outside */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
