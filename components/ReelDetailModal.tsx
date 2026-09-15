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
  FileText,
  BookOpen,
  Brain,
  Download,
  RotateCw,
  Clock,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReelItem } from '@/types';
import { ErrorBoundary } from './ErrorBoundary';

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

  const rawMarkdown = `---
title: "${(reel.subject || 'Video Note').replace(/"/g, '\\"')}"
domain: "${reel.domain || 'General'}"
subdomain: "${reel.subdomain || 'General'}"
creator: "${reel.creator || ''}"
takeaway: "${(reel.personalUtility || '').replace(/"/g, '\\"')}"
tools: [${(reel.entities || '').split(',').map((e) => `"${e.trim()}"`).filter((e) => e !== '""').join(', ')}]
tags: [${(reel.tags || '').split(/[,\s]+/).map((t) => `"#${t.replace(/^#/, '')}"`).filter((t) => t !== '"#"').join(', ')}]
url: "${reel.url || ''}"
date: "${new Date().toISOString().split('T')[0]}"
---

# ${reel.subject || 'Actionable Video Insight'}

> **Core Takeaway:** ${reel.personalUtility || reel.summary?.slice(0, 150) || 'Key learning from reel'}

${reel.summary || ''}

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
      const filename = `${(reel.subject || 'reel-note').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
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
      `Are you sure you want to delete "${reel.subject || 'this insight'}"?\n` +
      `This will permanently remove it from your local storage.`;

    if (confirm(confirmMsg)) {
      onDelete(reel);
      onClose();
    }
  };

  const entityList = reel.entities
    ? reel.entities
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
    : [];

  const rawTags = reel.tags
    ? reel.tags
        .split(/[,\s]+/)
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean)
    : [];

  const visibleTags = showAllTags ? rawTags : rawTags.slice(0, 6);
  const hiddenTagsCount = rawTags.length - 6;

  const wordCount = (reel.summary || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 120));

  return (
    <ErrorBoundary fallbackTitle="Error loading Knowledge Reader">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[92vh] bg-[#111218] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Control Bar */}
          <div className="p-3.5 sm:p-4 border-b border-white/[0.06] bg-[#0d0e13] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-indigo-400 border border-white/[0.06]">
                {reel.domain}
              </span>
              <span className="text-xs text-zinc-400 font-medium truncate max-w-[200px] sm:max-w-[320px]">
                {reel.subject || 'Knowledge Note'}
              </span>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-1 bg-[#171822] p-1 rounded-lg border border-white/[0.06]">
              <button
                onClick={() => setActiveTab('note')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'note'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Note Reader</span>
              </button>
              <button
                onClick={() => setActiveTab('yaml')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'yaml'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Properties &amp; Export</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleCopyMarkdown}
                title="Copy Markdown"
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
                title="Download .md File"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Instagram"
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
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {activeTab === 'note' && (
              <div className="space-y-5">
                {/* Header Title & Reading Metric */}
                <div className="space-y-2 border-b border-white/[0.06] pb-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight leading-tight">
                    {reel.subject || 'Actionable Video Insight'}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {readTime} min read
                    </span>
                    <span>&bull;</span>
                    <span>{wordCount} words</span>
                    {reel.creator && (
                      <>
                        <span>&bull;</span>
                        <span className="text-indigo-400">{reel.creator}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Core Takeaway Highlight Box */}
                {(reel.personalUtility || reel.summary) && (
                  <div className="p-4 rounded-xl bg-[#0e0f14] border-l-3 border-indigo-500 border border-white/[0.06] text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={1.5} />
                      <div>
                        <strong className="text-zinc-100">Core Takeaway:</strong>{' '}
                        <span className="text-zinc-300">{reel.personalUtility || reel.summary?.slice(0, 200)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notion/Obsidian Markdown Body */}
                <div className="p-5 rounded-xl bg-[#0e0f14] border border-white/[0.06] text-[#e2e8f0] text-xs sm:text-sm leading-relaxed overflow-x-auto select-text font-sans">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-lg font-bold text-zinc-100 mt-5 mb-2 pb-1 border-b border-white/[0.06]" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-base font-bold text-zinc-100 mt-4 mb-2 flex items-center gap-1.5" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-semibold text-indigo-300 mt-3 mb-1" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="leading-relaxed text-zinc-300 my-2" {...props} />
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
                      code: ({ node, inline, className, children, ...props }: any) => {
                        if (inline) {
                          return (
                            <code className="px-1.5 py-0.5 bg-[#171822] text-indigo-300 font-mono text-[11px] rounded border border-white/[0.06]" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="p-4 bg-[#0a0b0e] text-zinc-200 rounded-xl border border-white/[0.08] font-mono text-xs overflow-x-auto my-3 leading-relaxed">
                            <code {...props}>{children}</code>
                          </pre>
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
                    {reel.summary || '*No detailed summary provided.*'}
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
                      {reel.subject || 'Actionable Video Insight'}
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="flex items-start gap-3">
                    <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                      domain
                    </div>
                    <div className="flex-1 text-zinc-300">
                      {reel.domain || 'General'}
                    </div>
                  </div>

                  {/* Subdomain */}
                  {reel.subdomain && (
                    <div className="flex items-start gap-3">
                      <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                        subdomain
                      </div>
                      <div className="flex-1 text-zinc-400">
                        {reel.subdomain}
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {entityList.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                        tools
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                        {entityList.map((ent) => (
                          <span
                            key={ent}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06]"
                          >
                            {ent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {rawTags.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-24 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                        tags
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                        {visibleTags.map((t) => (
                          <span
                            key={t}
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

          {/* Sticky Footer */}
          <div className="p-3.5 px-5 bg-[#0d0e13] border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono text-[11px] text-zinc-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 font-mono border border-white/[0.06]">Esc</kbd> to close
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyMarkdown}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Note'}
              </button>
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <span>Original Video</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
