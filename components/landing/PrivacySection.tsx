'use client';

import React from 'react';
import {
  ShieldCheck,
  HardDrive,
  EyeOff,
  KeyRound,
  DownloadCloud,
} from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" className="py-20 bg-zinc-950 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-zinc-900/50 border border-white/[0.08] p-8 sm:p-10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Privacy & Local-First Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl mx-auto">
              Your knowledge belongs to you. Reel Analyzer is engineered from the ground up to respect your privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <HardDrive className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                <span>100% Local Storage</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                All video summaries are saved directly to your browser's local storage and extension cache.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <EyeOff className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                <span>Zero Tracking or Data Selling</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                We do not track your Instagram activity or monetize your reading history.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <KeyRound className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                <span>No API Keys Required</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Built-in free summarization engine works out of the box with zero complex configuration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <DownloadCloud className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                <span>Total Data Portability</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Export your entire knowledge vault to JSON or Markdown playbooks anytime with 1-click.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <a
              href="/privacy"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white border border-white/[0.08] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Read Full Chrome Web Store Privacy Policy & Permissions Policy</span>
              <span className="text-zinc-500">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
