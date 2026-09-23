'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const LandingFooter: React.FC = () => {
  const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);

  useEffect(() => {
    // 1. Immediately read cached count from localStorage to prevent flash on refresh
    try {
      const cached = localStorage.getItem('cached_unique_visitors');
      if (cached) {
        const parsed = parseInt(cached, 10);
        if (!isNaN(parsed)) setUniqueVisitors(parsed);
      }
    } catch {}

    // 2. Fetch fresh count from API in background
    fetch('/api/analytics/view')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.uniqueVisitors) {
          setUniqueVisitors(data.uniqueVisitors);
          try {
            localStorage.setItem('cached_unique_visitors', String(data.uniqueVisitors));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-white/[0.06] py-12 bg-[#0b0c10] text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center shrink-0">
              <Image
                src="/logos/icon-48.png"
                alt="Reel Analyzer Logo"
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-semibold text-sm text-zinc-200">
                Reel Analyzer Studio
              </span>
              <p className="text-[11px] text-zinc-500">
                Personal Video Knowledge Management
              </p>
            </div>
          </div>

          {/* Center / Right: Live Website Visitors Count with Official Logo */}
          <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-300 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] shadow-sm">
            <div className="w-4 h-4 rounded-md overflow-hidden shrink-0 border border-white/[0.1] bg-[#12131a] flex items-center justify-center">
              <Image
                src="/logos/icon-48.png"
                alt="Reel Analyzer"
                width={16}
                height={16}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            {uniqueVisitors !== null ? (
              <span>{uniqueVisitors.toLocaleString()} Website Visitors</span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-6 h-3 bg-white/10 rounded animate-pulse inline-block" />
                <span>Website Visitors</span>
              </span>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs text-zinc-400 flex-wrap justify-center">
            <Link href="/vault" className="hover:text-zinc-200 transition-colors">
              Knowledge Vault
            </Link>
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300 transition-colors text-indigo-400 font-medium"
            >
              Chrome Extension ↗
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.04] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-600">
          <span>&copy; {new Date().getFullYear()} Reel Analyzer. Built with ❤️ by <a href="https://manikanta.co.in" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-400 transition-colors underline underline-offset-2">Manikanta Sandula</a>.</span>
          <span>100% Free &bull; Local-First &bull; No API Keys Required</span>
        </div>
      </div>
    </footer>
  );
};
