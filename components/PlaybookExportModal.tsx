'use client';

import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { ReelItem } from '@/types';
import { generatePlaybookMarkdown, downloadMarkdownFile } from '@/lib/playbookExporter';

interface PlaybookExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reels: ReelItem[];
  currentDomain: string;
  currentSubdomain: string;
  domains: string[];
}

export const PlaybookExportModal: React.FC<PlaybookExportModalProps> = ({
  isOpen,
  onClose,
  reels,
  currentDomain,
  currentSubdomain,
  domains,
}) => {
  const [selectedDomain, setSelectedDomain] = useState(currentDomain);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = generatePlaybookMarkdown(reels, selectedDomain, 'All');
  const filteredCount = reels.filter(
    (r) => selectedDomain === 'All' || r.domain === selectedDomain
  ).length;

  const handleDownload = () => {
    const filename = `Knowledge_Playbook_${selectedDomain.replace(/\s+/g, '_')}.md`;
    downloadMarkdownFile(filename, markdownContent);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/[0.1] rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Export Center
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Export Markdown Playbook
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
          >
            Close
          </button>
        </div>

        {/* Category Scope Selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-300 mb-2">
            Select Category Scope:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedDomain('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.98] ${
                selectedDomain === 'All'
                  ? 'bg-zinc-800 text-white font-semibold border border-white/[0.12]'
                  : 'bg-zinc-950/60 text-zinc-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              All Categories ({reels.length})
            </button>
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-[0.98] ${
                  selectedDomain === d
                    ? 'bg-zinc-800 text-white font-semibold border border-white/[0.12]'
                    : 'bg-zinc-950/60 text-zinc-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Markdown Preview */}
        <div className="flex-1 overflow-hidden flex flex-col mb-5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Playbook Preview ({filteredCount} insights)</span>
            <span className="font-mono text-[11px] text-zinc-500">
              {markdownContent.split('\n').length} lines • Markdown / Obsidian ready
            </span>
          </div>
          <div className="flex-1 overflow-y-auto bg-zinc-950/80 rounded-xl border border-white/[0.08] p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {markdownContent}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.06] text-xs font-medium text-zinc-200 transition-all duration-150 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-sm transition-all duration-150 active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Download .md</span>
          </button>
        </div>
      </div>
    </div>
  );
};
