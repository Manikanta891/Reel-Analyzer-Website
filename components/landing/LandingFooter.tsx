'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] py-12 bg-zinc-950 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/[0.1] bg-zinc-900 flex items-center justify-center">
              <Image
                src="/logos/icon-48.png"
                alt="Reel Analyzer Logo"
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-sm text-white">
                Reel Analyzer
              </span>
              <p className="text-[11px] text-zinc-500">
                Personal Video Knowledge Management
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs text-zinc-400 flex-wrap justify-center">
            <Link href="/vault" className="hover:text-white transition-colors">
              Knowledge Vault
            </Link>
            <a
              href="https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors text-brand-400 font-medium"
            >
              Chrome Extension ↗
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <a href="#contact" className="hover:text-white transition-colors">
              Feedback
            </a>
            <Link href="/uninstall" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Uninstall Survey
            </Link>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-600">
          <span>&copy; {new Date().getFullYear()} Reel Analyzer. Local-first personal knowledge system.</span>
          <span>100% Free &bull; No API Keys Required</span>
        </div>
      </div>
    </footer>
  );
};
