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
  Shield,
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

  const handleCopyMarkdown = () => {
    try {
      const text = `---
domain: "${reel.domain || 'General'}"
subdomain: "${reel.subdomain || 'General'}"
takeaway: "${reel.personalUtility || ''}"
tools: "${reel.entities || ''}"
tags: "${reel.tags || ''}"
---

### ${reel.subject || 'Actionable Video Insight'}
**Category:** ${reel.domain || 'General'} > ${reel.subdomain || 'General'}
${reel.personalUtility ? `**Key Takeaway:** ${reel.personalUtility}\n` : ''}
${reel.entities ? `**Tools & Frameworks:** ${reel.entities}\n` : ''}

#### Summary & Directives
${reel.summary || ''}

[View Original Reel](${reel.url})
`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
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

  const visibleTags = showAllTags ? rawTags : rawTags.slice(0, 5);
  const hiddenTagsCount = rawTags.length - 5;

  return (
    <ErrorBoundary fallbackTitle="Error loading summary reader">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Static, stable modal box */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Control Bar */}
          <div className="p-3.5 sm:p-4 border-b border-white/[0.08] bg-zinc-900/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.06]">
                Vault Note
              </span>
              <span className="text-xs text-zinc-400 font-medium truncate max-w-[240px]">
                {reel.domain} / {reel.subdomain || 'General'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleCopyMarkdown}
                title="Copy Markdown Playbook"
                className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                ) : (
                  <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                )}
              </button>
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Instagram"
                className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  title="Delete from Vault"
                  className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-colors duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              )}
              <button
                onClick={onClose}
                title="Close (Esc)"
                className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* Obsidian YAML Frontmatter Property Panel */}
            <div className="rounded-xl bg-zinc-950/80 border border-white/[0.08] p-4 text-xs space-y-3 font-sans">
              {/* Row 1: Subject */}
              <div className="flex items-start gap-3">
                <div className="w-24 flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                  <List className="w-3.5 h-3.5 text-zinc-500" />
                  <span>subject</span>
                </div>
                <div className="flex-1 text-white font-semibold flex items-center gap-2">
                  <span className="text-brand-400">🛡️</span>
                  <span>{reel.subject || 'Actionable Video Insight'}</span>
                </div>
              </div>

              {/* Row 2: Domain */}
              <div className="flex items-start gap-3">
                <div className="w-24 flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                  <FolderGit2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>domain</span>
                </div>
                <div className="flex-1 flex items-center gap-1.5 text-zinc-200 font-medium">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/[0.06] text-[11px]">
                    {reel.domain || 'General'}
                  </span>
                </div>
              </div>

              {/* Row 3: Subdomain */}
              {reel.subdomain && (
                <div className="flex items-start gap-3">
                  <div className="w-24 flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                    <FolderGit2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>subdomain</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 text-zinc-300 font-medium">
                    <span className="px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-white/[0.04] text-[11px]">
                      {reel.subdomain}
                    </span>
                  </div>
                </div>
              )}

              {/* Row 4: Tools & Frameworks with +X More */}
              {entityList.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-24 flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                    <Wrench className="w-3.5 h-3.5 text-zinc-500" />
                    <span>tools</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                    {(showAllTools ? entityList : entityList.slice(0, 4)).map((ent) => (
                      <button
                        key={ent}
                        onClick={() => {
                          onEntityClick?.(ent);
                          onClose();
                        }}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.06] transition-colors"
                      >
                        {ent}
                      </button>
                    ))}
                    {!showAllTools && entityList.length > 4 && (
                      <button
                        onClick={() => setShowAllTools(true)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition-colors"
                      >
                        +{entityList.length - 4} more
                      </button>
                    )}
                    {showAllTools && entityList.length > 4 && (
                      <button
                        onClick={() => setShowAllTools(false)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Row 5: Tags with +X More */}
              {rawTags.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-24 flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] pt-0.5 flex-shrink-0">
                    <Tag className="w-3.5 h-3.5 text-zinc-500" />
                    <span>tags</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                    {visibleTags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.06] flex items-center gap-1"
                      >
                        <span className="text-zinc-500 text-[10px]">#</span>
                        <span>{t.replace(/^#/, '')}</span>
                      </span>
                    ))}
                    {!showAllTags && hiddenTagsCount > 0 && (
                      <button
                        onClick={() => setShowAllTags(true)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition-colors"
                      >
                        +{hiddenTagsCount} more
                      </button>
                    )}
                    {showAllTags && hiddenTagsCount > 0 && (
                      <button
                        onClick={() => setShowAllTags(false)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Entire Content & Summary Body */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <FileText className="w-3.5 h-3.5 text-brand-400" />
                <span>Summary</span>
              </div>

              {/* Core Utility Highlight (if available and not duplicated in summary) */}
              {reel.personalUtility && !reel.summary?.includes(reel.personalUtility) && (
                <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-white/[0.08] text-xs text-zinc-300 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={1.5} />
                    <div>
                      <span className="font-semibold text-white">Direct Takeaway:</span>{' '}
                      <span className="text-zinc-300">{reel.personalUtility}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Rich Markdown Content Styled like Obsidian / GDrive-Sync */}
              <div className="p-5 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-[#dcddde] text-xs sm:text-sm leading-relaxed overflow-x-auto select-text font-sans">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-lg sm:text-xl font-bold text-white mt-5 mb-2.5 pb-1.5 border-b border-white/[0.08]" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-base sm:text-lg font-bold text-white mt-4 mb-2 flex items-center gap-1.5" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-sm sm:text-base font-semibold text-brand-300 mt-3.5 mb-1.5" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-200 mt-2.5 mb-1" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="leading-relaxed text-[#dcddde] my-2 text-xs sm:text-sm" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 space-y-1.5 my-2.5 text-[#dcddde] text-xs sm:text-sm" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 space-y-1.5 my-2.5 text-[#dcddde] text-xs sm:text-sm" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="leading-relaxed text-[#dcddde] pl-0.5" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-purple-500/60 pl-3.5 py-1.5 italic text-[#8a8a8e] bg-[#1e1e20]/40 rounded-r-lg my-3 text-xs sm:text-sm" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                      if (inline) {
                        return (
                          <code className="px-1.5 py-0.5 bg-[#1e1e20] text-purple-300 font-mono text-[11px] rounded border border-[#2a2a2d]" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre className="p-4 bg-[#121214] text-[#dcddde] rounded-xl border border-[#2a2a2d] font-mono text-xs overflow-x-auto my-3 leading-relaxed">
                          <code {...props}>{children}</code>
                        </pre>
                      );
                    },
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-3.5 border border-[#2a2a2d] rounded-xl">
                        <table className="w-full text-left border-collapse text-xs" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-[#1e1e20] border-b border-[#2a2a2d] text-white font-semibold text-xs" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="p-2.5 border-r border-[#2a2a2d] last:border-r-0" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="p-2.5 text-[#dcddde] border-r border-[#2a2a2d] last:border-r-0 border-t border-[#2a2a2d]/60" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="border-[#2a2a2d] my-4" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-white tracking-wide" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-zinc-300" {...props} />
                    ),
                    del: ({ node, ...props }) => (
                      <del className="line-through text-zinc-500" {...props} />
                    ),
                    input: ({ node, ...props }) => (
                      <input
                        type="checkbox"
                        disabled
                        className="mr-2 rounded bg-zinc-800 border-zinc-700 text-purple-500 focus:ring-0 accent-purple-500 align-middle"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                  }}
                >
                  {reel.summary || '*No detailed summary provided.*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-3.5 px-5 bg-zinc-900 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono text-[11px] text-zinc-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Esc</kbd> to close
            </span>
            <a
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <span>View Original Reel</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
