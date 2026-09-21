'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Folder,
  Trash2,
  BookOpen,
  Hash,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReelItem } from '@/types';

interface ReelTableViewProps {
  reels: ReelItem[];
  onSelect?: (item: ReelItem) => void;
  onDelete?: (item: ReelItem) => void;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ node, ...props }) => (
        <h1
          className="text-base font-bold text-zinc-100 mt-4 mb-2 pb-1 border-b border-white/[0.06]"
          {...props}
        />
      ),
      h2: ({ node, ...props }) => (
        <h2
          className="text-sm font-bold text-zinc-100 mt-3.5 mb-1.5 flex items-center gap-1.5"
          {...props}
        />
      ),
      h3: ({ node, ...props }) => (
        <h3 className="text-xs font-semibold text-indigo-300 mt-3 mb-1" {...props} />
      ),
      p: ({ node, ...props }) => (
        <div className="leading-relaxed text-zinc-300 my-1.5 text-xs" {...props} />
      ),
      ul: ({ node, ...props }) => (
        <ul className="list-disc pl-5 space-y-1 my-2 text-zinc-300 text-xs" {...props} />
      ),
      ol: ({ node, ...props }) => (
        <ol className="list-decimal pl-5 space-y-1 my-2 text-zinc-300 text-xs" {...props} />
      ),
      li: ({ node, ...props }) => (
        <li className="leading-relaxed text-zinc-300 pl-0.5" {...props} />
      ),
      blockquote: ({ node, ...props }) => (
        <blockquote
          className="border-l-2 border-indigo-500 pl-3 py-1 italic text-zinc-400 bg-[#161822] rounded-r-lg my-2.5 text-xs"
          {...props}
        />
      ),
      pre: ({ node, ...props }) => (
        <pre
          className="p-3 bg-[#08090d] text-zinc-100 rounded-xl border border-white/[0.08] font-mono text-xs overflow-x-auto my-2.5 leading-relaxed shadow-inner"
          {...props}
        />
      ),
      code: ({ node, className, children, ...props }: any) => {
        const strChild = String(children || '');
        if (strChild.trim() === '') return null;
        const isBlock = className?.includes('language-') || strChild.includes('\n');
        if (isBlock) {
          return (
            <code
              className="text-zinc-100 font-mono text-xs leading-relaxed block font-normal"
              {...props}
            >
              {children}
            </code>
          );
        }
        return (
          <code
            className="px-1.5 py-0.5 bg-[#171822] text-indigo-300 font-mono text-[11px] rounded border border-white/[0.06] font-medium"
            {...props}
          >
            {children}
          </code>
        );
      },
      table: ({ node, ...props }) => (
        <div className="overflow-x-auto my-3 border border-white/[0.08] rounded-lg">
          <table className="w-full text-left border-collapse text-xs" {...props} />
        </div>
      ),
      thead: ({ node, ...props }) => (
        <thead
          className="bg-[#161822] border-b border-white/[0.08] text-zinc-100 font-semibold"
          {...props}
        />
      ),
      th: ({ node, ...props }) => (
        <th className="p-2 border-r border-white/[0.06] last:border-r-0" {...props} />
      ),
      td: ({ node, ...props }) => (
        <td
          className="p-2 text-zinc-300 border-r border-white/[0.06] last:border-r-0 border-t border-white/[0.04]"
          {...props}
        />
      ),
      hr: ({ node, ...props }) => <hr className="border-white/[0.06] my-3" {...props} />,
      strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-100" {...props} />,
      a: ({ node, ...props }) => (
        <a
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

export const ReelTableView: React.FC<ReelTableViewProps> = ({ reels, onSelect, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: ReelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `### ${item.subject}\nCategory: ${item.domain} > ${item.subdomain}\n\n${item.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.url);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (item: ReelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    const confirmMsg =
      `⚠️ Remove Reel from Vault?\n\n` +
      `Are you sure you want to delete "${item.subject || 'this insight'}"?\n` +
      `This will remove the summary and takeaway from your local knowledge library.`;

    if (confirm(confirmMsg)) {
      onDelete(item);
    }
  };

  if (reels.length === 0) {
    return (
      <div className="p-16 text-center text-zinc-400 bg-[#111218] rounded-2xl border border-white/[0.08] shadow-lg">
        <Folder className="w-8 h-8 text-zinc-600 mx-auto mb-2.5" strokeWidth={1.5} />
        <p className="text-xs text-zinc-400">No knowledge notes match your active search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Stacked Interactive Cards (Viewport < md) */}
      <div className="block md:hidden space-y-3">
        {reels.map((item) => {
          const isExpanded = expandedId === item.url;
          return (
            <div
              key={item.url}
              className="bg-[#111218] border border-white/[0.08] rounded-2xl p-4 shadow-lg space-y-3 transition-all hover:border-white/[0.14]"
            >
              {/* Category & Action Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                    {item.domain}
                  </span>
                  {item.subdomain && (
                    <span className="text-[10px] font-mono text-zinc-400">
                      / {item.subdomain}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleCopy(item, e)}
                    className="p-2 rounded-xl bg-[#171822] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                    title="Copy Markdown"
                  >
                    {copiedId === item.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#171822] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                    title="View on Instagram"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {onDelete && (
                    <button
                      onClick={(e) => handleDelete(item, e)}
                      className="p-2 rounded-xl bg-[#171822] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Key Takeaway */}
              <div
                onClick={() => onSelect?.(item)}
                className="cursor-pointer space-y-1.5 group"
              >
                <h4 className="font-bold text-sm text-zinc-100 group-hover:text-indigo-400 transition-colors leading-snug">
                  {item.subject}
                </h4>
                {item.personalUtility && (
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {item.personalUtility}
                  </p>
                )}
              </div>

              {/* Tools & Tags */}
              {item.entities && (
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 pt-1">
                  <Hash className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="truncate font-mono">{item.entities}</span>
                </div>
              )}

              {/* Preview Toggle & Reader Open */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.url)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 py-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Hide inline preview</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>Inline preview</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelect?.(item)}
                  className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 py-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Note</span>
                </button>
              </div>

              {/* Inline Markdown Preview on Mobile */}
              {isExpanded && (
                <div className="text-zinc-300 bg-[#0d0e13] p-4 rounded-xl border border-white/[0.06] text-xs leading-relaxed overflow-x-auto shadow-inner mt-2">
                  <MarkdownRenderer content={item.summary} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Full Data Table (Viewport >= md) */}
      <div className="hidden md:block rounded-2xl bg-[#111218] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c0d12] border-b border-white/[0.08] text-zinc-400 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Subject &amp; Key Insight</th>
                <th className="py-3.5 px-4">Topic / Domain</th>
                <th className="py-3.5 px-4">Tools &amp; Tags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {reels.map((item) => {
                const isExpanded = expandedId === item.url;
                return (
                  <React.Fragment key={item.url}>
                    <tr
                      onClick={() => onSelect?.(item)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors mb-0.5 line-clamp-1">
                          {item.subject}
                        </div>
                        {item.personalUtility && (
                          <div className="text-[11px] text-zinc-400 line-clamp-1">
                            {item.personalUtility}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-zinc-200">{item.domain}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{item.subdomain}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[11px] font-mono text-zinc-400 truncate">
                          {item.entities || '—'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(isExpanded ? null : item.url);
                            }}
                            className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                            title="Expand inline preview"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleCopy(item, e)}
                            className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                            title="Copy Markdown"
                          >
                            {copiedId === item.url ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                            ) : (
                              <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                            )}
                          </button>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                            title="View on Instagram"
                          >
                            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </a>
                          {onDelete && (
                            <button
                              onClick={(e) => handleDelete(item, e)}
                              className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-colors"
                              title="Delete from Vault"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row Markdown View */}
                    {isExpanded && (
                      <tr className="bg-[#0b0c10]/90">
                        <td colSpan={4} className="p-5 sm:p-6">
                          <div className="text-zinc-300 bg-[#0d0e13] p-5 rounded-xl border border-white/[0.06] text-xs leading-relaxed overflow-x-auto select-text font-sans shadow-inner">
                            <MarkdownRenderer content={item.summary} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
