'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

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
    <footer className="border-t border-white/[0.06] pt-12 pb-8 bg-[#08090d] text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/[0.04]">
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/[0.08] bg-[#12131a] flex items-center justify-center shrink-0">
                <Image
                  src="/logos/icon-48.png"
                  alt="Reel Analyzer — Instagram Reels AI Summarizer by Manikanta Sandula"
                  width={32}
                  height={32}
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

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Transform saved Instagram Reels into permanent Obsidian vaults, Markdown notes, and AI coding prompts. Free, local-first, zero API keys required.
            </p>

            {/* Live Website Visitors Badge */}
            <div className="inline-flex items-center gap-2.5 text-[11px] font-mono text-zinc-300 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] shadow-sm">
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
          </div>

          {/* Use Cases Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-300">
              Use Cases
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/use-cases/instagram-to-obsidian"
                  className="text-zinc-400 hover:text-indigo-300 transition-colors"
                >
                  Obsidian Vault Export
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases/coding-agent-prompts"
                  className="text-zinc-400 hover:text-indigo-300 transition-colors"
                >
                  AI Coding Prompts (Cursor)
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases/instagram-reel-scraper"
                  className="text-zinc-400 hover:text-indigo-300 transition-colors"
                >
                  Reel Scraper &amp; Transcripts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Links Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-300">
              Product &amp; Docs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/vault"
                  className="text-zinc-400 hover:text-indigo-300 transition-colors"
                >
                  Explore Knowledge Vault
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-zinc-400 hover:text-indigo-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Chrome Extension (Free)</span>
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <span>
            &copy; {new Date().getFullYear()} Reel Analyzer. Built with ❤️ by{' '}
            <a
              href="https://manikanta.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
            >
              Manikanta Sandula
            </a>
            .
          </span>
          <span>100% Free &bull; Local-First &bull; No API Keys Required</span>
        </div>
      </div>
    </footer>
  );
};
