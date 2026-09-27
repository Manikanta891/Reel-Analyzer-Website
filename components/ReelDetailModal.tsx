'use client';

import React, { useEffect, useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  X,
  Lightbulb,
  Wrench,
  Tag,
  Trash2,
  List,
  FolderGit2,
  BookOpen,
  Download,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReelItem } from '@/types';
import { ErrorBoundary } from './ErrorBoundary';
import { extractMetadataFromText, sanitizeSummary } from '@/lib/summaryParser';

interface ReelDetailModalProps {
  reel: ReelItem | null;
  onClose: () => void;
  onEntityClick?: (entity: string) => void;
  onDelete?: (reel: ReelItem) => void;
}

export const ReelDetailModal: React.FC<ReelDetailModalProps> = ({
  reel,
  onClose,
  onEntityClick,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'note' | 'yaml'>('note');
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (reel) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [reel, onClose]);

  if (!reel) return null;

  // Dynamically extract any metadata embedded in summary or aiResponse if missing on the reel object
  const rawText = reel.summary || reel.aiResponse || '';
  const parsedMeta = extractMetadataFromText(rawText);

  const displayDomain = reel.domain || parsedMeta.domain || 'General';
  const displaySubdomain = reel.subdomain || parsedMeta.subdomain || 'General';
  const displaySubject = reel.subject || parsedMeta.subject || 'Actionable Video Insight';
  const displayUtility = reel.personalUtility || parsedMeta.personalUtility || '';
  const displayEntities = reel.entities || parsedMeta.entities || '';
  const displayTags = reel.tags || parsedMeta.tags || '';
  const cleanedSummary = sanitizeSummary(rawText);

  const rawMarkdown = `---
title: "${displaySubject.replace(/"/g, '\\"')}"
domain: "${displayDomain}"
subdomain: "${displaySubdomain}"
creator: "${reel.creator || ''}"
takeaway: "${displayUtility.replace(/"/g, '\\"')}"
tools: [${displayEntities.split(',').map((e) => `"${e.trim()}"`).filter((e) => e !== '""').join(', ')}]
tags: [${displayTags.split(/[,\s]+/).map((t) => `"#${t.replace(/^#/, '')}"`).filter((t) => t !== '"#"').join(', ')}]
url: "${reel.url || ''}"
date: "${new Date().toISOString().split('T')[0]}"
---

# ${displaySubject}

${displayUtility ? `> **Core Takeaway:** ${displayUtility}\n` : ''}

${cleanedSummary || 'No detailed summary provided.'}

---
*Source Reel:* [Instagram Reel](${reel.url})
`;

  const handleCopyMarkdown = () => {
    try {
      navigator.clipboard.writeText(rawMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      const blob = new Blob([rawMarkdown], { type: 'text/markdown;charset=utf-8' });
      const filename = `${displaySubject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download markdown file:', err);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    const confirmMsg =
      `⚠️ Remove Reel from Vault?\n\n` +
      `Are you sure you want to delete "${displaySubject}"?\n` +
      `This will permanently remove it from your local storage.`;

    if (confirm(confirmMsg)) {
      onDelete(reel);
      onClose();
    }
  };

  // Tools list
  const toolList = displayEntities
    ? displayEntities
        .split(',')
        .map((e) => e.trim().replace(/^["'\[]+|["'\]]+$/g, ''))
        .filter(Boolean)
    : [];

  const visibleTools = showAllTools ? toolList : toolList.slice(0, 4);
  const hiddenToolsCount = toolList.length - 4;

  // Tags list
  const tagList = displayTags
    ? displayTags
        .split(/[,\s]+/)
        .map((t) => t.trim().replace(/^["'\[#]+|["'\]]+$/g, ''))
        .filter(Boolean)
    : [];

  const visibleTags = showAllTags ? tagList : tagList.slice(0, 5);
  const hiddenTagsCount = tagList.length - 5;

  const wordCount = (cleanedSummary || '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 120));

  return (
    <ErrorBoundary fallbackTitle="Error loading Knowledge Reader">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl h-[92vh] sm:h-auto sm:max-h-[90vh] bg-[#111218] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Control Bar */}
          <div className="p-3 sm:p-4 border-b border-white/[0.06] bg-[#0d0e13] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shrink-0">
            {/* Top row / Left section */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-indigo-400 border border-white/[0.06] shrink-0 font-semibold">
                  {displayDomain}
                </span>
                <span className="text-xs text-zinc-300 font-semibold truncate max-w-[150px] sm:max-w-[260px]">
                  {displaySubject}
                </span>
              </div>

              {/* Close Button on mobile top right */}
              <div className="flex sm:hidden items-center gap-1">
                <button
                  onClick={onClose}
                  title="Close (Esc)"
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Bottom Row on mobile / Right Section on Desktop */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-[#171822] p-1 rounded-lg border border-white/[0.06]">
                <button
                  onClick={() => setActiveTab('note')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'note'
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Note</span>
                </button>
                <button
                  onClick={() => setActiveTab('yaml')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'yaml'
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Properties</span>
                </button>
              </div>

              {/* Actions Toolbar */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleCopyMarkdown}
                  title={copied ? 'Copied to clipboard' : 'Copy markdown note'}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                  )}
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  title="Download .md file"
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View original Instagram Reel"
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    title="Delete from Vault"
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  title="Close (Esc)"
                  className="hidden sm:inline-flex p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {activeTab === 'note' && (
              <div className="space-y-6">
                {/* 1. NOTION / OBSIDIAN METADATA PROPERTY CARD */}
                <div className="rounded-2xl bg-[#0c0d12] border border-white/[0.08] p-5 sm:p-6 space-y-4 shadow-xl">
                  {/* Subject Row */}
                  <div className="flex items-start gap-4">
                    <div className="w-24 sm:w-28 flex items-center gap-2 text-zinc-400 text-xs font-medium shrink-0 pt-0.5">
                      <List className="w-3.5 h-3.5 text-zinc-500" />
                      <span>subject</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 text-zinc-100 font-bold text-sm sm:text-base leading-snug">
                      <span className="text-indigo-400">🛡️</span>
                      <span>{displaySubject}</span>
                    </div>
                  </div>

                  {/* Domain Row */}
                  <div className="flex items-start gap-4">
                    <div className="w-24 sm:w-28 flex items-center gap-2 text-zinc-400 text-xs font-medium shrink-0 pt-0.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>domain</span>
                    </div>
                    <div className="flex-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#181924] text-zinc-200 border border-white/[0.08] font-medium text-xs shadow-sm">
                        {displayDomain}
                      </span>
                    </div>
                  </div>

                  {/* Subdomain Row */}
                  {displaySubdomain && (
                    <div className="flex items-start gap-4">
                      <div className="w-24 sm:w-28 flex items-center gap-2 text-zinc-400 text-xs font-medium shrink-0 pt-0.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span>subdomain</span>
                      </div>
                      <div className="flex-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#181924] text-zinc-300 border border-white/[0.08] font-medium text-xs shadow-sm">
                          {displaySubdomain}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tools Row */}
                  {toolList.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-24 sm:w-28 flex items-center gap-2 text-zinc-400 text-xs font-medium shrink-0 pt-0.5">
                        <Wrench className="w-3.5 h-3.5 text-zinc-500" />
                        <span>tools</span>
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                        {visibleTools.map((tool, idx) => (
                          <button
                            key={idx}
                            onClick={() => onEntityClick?.(tool)}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#181924] hover:bg-[#202230] text-zinc-200 border border-white/[0.08] font-medium text-xs transition-colors shadow-sm"
                          >
                            {tool}
                          </button>
                        ))}
                        {hiddenToolsCount > 0 && (
                          <button
                            onClick={() => setShowAllTools(!showAllTools)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 font-medium transition-colors"
                          >
                            {showAllTools ? 'Show less' : `+${hiddenToolsCount} more`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags Row */}
                  {tagList.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-24 sm:w-28 flex items-center gap-2 text-zinc-400 text-xs font-medium shrink-0 pt-0.5">
                        <Tag className="w-3.5 h-3.5 text-zinc-500" />
                        <span>tags</span>
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                        {visibleTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-[#181924] hover:bg-[#202230] text-zinc-300 hover:text-zinc-100 border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium shadow-sm transition-colors"
                          >
                            <span className="text-zinc-500 mr-1">#</span>{tag}
                          </span>
                        ))}
                        {hiddenTagsCount > 0 && (
                          <button
                            onClick={() => setShowAllTags(!showAllTags)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-0.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 font-medium transition-colors"
                          >
                            {showAllTags ? 'Show less' : `+${hiddenTagsCount} more`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. CORE TAKEAWAY HIGHLIGHT BOX */}
                {displayUtility && (
                  <div className="p-4 rounded-xl bg-[#0e0f14] border-l-3 border-indigo-500 border border-white/[0.06] text-xs sm:text-sm text-zinc-300 leading-relaxed shadow-inner">
                    <div className="flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={1.5} />
                      <div>
                        <strong className="text-zinc-100">Core Takeaway:</strong>{' '}
                        <span className="text-zinc-300">{displayUtility}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CLEAN NOTION/OBSIDIAN MARKDOWN BODY (Identical Markdown Rendering Engine) */}
                <div className="p-5 sm:p-6 rounded-xl bg-[#0e0f14] border border-white/[0.06] text-[#e2e8f0] text-xs sm:text-sm leading-relaxed overflow-x-auto select-text font-sans shadow-inner">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-lg sm:text-xl font-bold text-zinc-100 mt-5 mb-2 pb-1.5 border-b border-white/[0.08]" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-base sm:text-lg font-bold text-zinc-100 mt-4 mb-2 flex items-center gap-1.5" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-semibold text-indigo-300 mt-3 mb-1" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <div className="leading-relaxed text-zinc-300 my-2.5" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 space-y-1.5 my-2.5 text-zinc-300" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 space-y-1.5 my-2.5 text-zinc-300" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-relaxed text-zinc-300 pl-0.5" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-2 border-indigo-500/70 pl-3.5 py-1 text-zinc-400 bg-[#161822] rounded-r-lg my-3 italic" {...props} />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="p-4 bg-[#08090d] text-zinc-100 rounded-xl border border-white/[0.08] font-mono text-xs overflow-x-auto my-3.5 leading-relaxed shadow-inner" {...props} />
                      ),
                      code: ({ node, className, children, ...props }: any) => {
                        const strChild = String(children || '');
                        if (strChild.trim() === '') return null;
                        const isBlock = className?.includes('language-') || strChild.includes('\n');
                        if (isBlock) {
                          return (
                            <code className="text-zinc-100 font-mono text-xs leading-relaxed block font-normal" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <code className="px-1.5 py-0.5 bg-[#171822] text-indigo-300 font-mono text-[11px] rounded border border-white/[0.06] font-medium" {...props}>
                            {children}
                          </code>
                        );
                      },
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-3.5 border border-white/[0.08] rounded-xl">
                          <table className="w-full text-left border-collapse text-xs" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="bg-[#161822] border-b border-white/[0.08] text-zinc-100 font-semibold text-xs" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="p-2.5 border-r border-white/[0.06] last:border-r-0" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="p-2.5 text-zinc-300 border-r border-white/[0.06] last:border-r-0 border-t border-white/[0.04]" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-zinc-100" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                    }}
                  >
                    {cleanedSummary || '*No detailed summary provided.*'}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'yaml' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#0e0f14] border border-white/[0.06] p-4 text-xs space-y-3 font-sans">
                  {/* Subject */}
                  <div className="flex items-start gap-3">
                    <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                      subject
                    </div>
                    <div className="flex-1 text-zinc-100 font-semibold">
                      {displaySubject}
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="flex items-start gap-3">
                    <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                      domain
                    </div>
                    <div className="flex-1 text-zinc-300">
                      {displayDomain}
                    </div>
                  </div>

                  {/* Subdomain */}
                  {displaySubdomain && (
                    <div className="flex items-start gap-3">
                      <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                        subdomain
                      </div>
                      <div className="flex-1 text-zinc-400">
                        {displaySubdomain}
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {toolList.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                        tools
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                        {toolList.map((ent, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06]"
                          >
                            {ent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {tagList.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                        tags
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                        {tagList.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Raw Markdown Source Code Box */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Raw Markdown File Export
                  </span>
                  <pre className="p-4 rounded-xl bg-[#0a0b0e] border border-white/[0.06] text-zinc-400 font-mono text-xs overflow-x-auto">
                    <code>{rawMarkdown}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Minimalist Footer (Clean status & Esc hint - No duplicate action buttons) */}
          <div className="p-3.5 px-5 bg-[#0d0e13] border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono text-[11px] text-zinc-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 font-mono border border-white/[0.06]">Esc</kbd> to close
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {wordCount} words &bull; {readTime} min read
            </span>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
