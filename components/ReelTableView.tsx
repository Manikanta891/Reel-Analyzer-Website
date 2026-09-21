'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp, Folder, Trash2, Tag, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReelItem } from '@/types';

interface ReelTableViewProps {
  reels: ReelItem[];
  onDelete?: (item: ReelItem) => void;
}

export const ReelTableView: React.FC<ReelTableViewProps> = ({ reels, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: ReelItem) => {
    const text = `### ${item.subject}\nCategory: ${item.domain} > ${item.subdomain}\n\n${item.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.url);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (item: ReelItem) => {
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
      <div className="p-12 text-center text-zinc-400 bg-[#12131a] rounded-xl border border-white/[0.06]">
        <Folder className="w-8 h-8 text-zinc-600 mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-xs">No insights match your active search or filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#12131a] border border-white/[0.06] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0e0f14] border-b border-white/[0.06] text-zinc-400 uppercase font-semibold tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Subject &amp; Key Takeaway</th>
              <th className="py-3.5 px-4 font-semibold">Topic Domain</th>
              <th className="py-3.5 px-4 font-semibold">Concepts &amp; Tools</th>
              <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {reels.map((item) => {
              const isExpanded = expandedId === item.url;
              return (
                <React.Fragment key={item.url}>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-zinc-100 mb-0.5 line-clamp-1">
                        {item.subject}
                      </div>
                      {item.personalUtility && (
                        <div className="text-[11px] text-zinc-400 line-clamp-1">
                          {item.personalUtility}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-zinc-200">{item.domain}</div>
                      <div className="text-[11px] text-zinc-500">{item.subdomain}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-[11px] font-mono text-zinc-400 truncate">
                        {item.entities || '—'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.url)}
                          className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                          title="Expand Summary"
                          aria-label="Expand Summary"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(item)}
                          className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                          title="Copy Markdown"
                          aria-label="Copy Markdown"
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
                          aria-label="View on Instagram"
                        >
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </a>
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-colors"
                            title="Delete Reel from Vault"
                            aria-label="Delete Reel from Vault"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Summary */}
                  {isExpanded && (
                    <tr className="bg-[#0e0f14]/80">
                      <td colSpan={4} className="p-5 sm:p-6">
                        <div className="text-zinc-300 bg-[#0b0c10] p-5 rounded-xl border border-white/[0.06] text-xs leading-relaxed overflow-x-auto select-text font-sans">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1 className="text-base font-bold text-zinc-100 mt-4 mb-2 pb-1 border-b border-white/[0.06]" {...props} />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2 className="text-sm font-bold text-zinc-100 mt-3.5 mb-1.5 flex items-center gap-1.5" {...props} />
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
                                <blockquote className="border-l-2 border-indigo-500 pl-3 py-1 italic text-zinc-400 bg-[#161822] rounded-r-lg my-2.5 text-xs" {...props} />
                              ),
                              pre: ({ node, ...props }) => (
                                <pre className="p-3 bg-[#08090d] text-zinc-100 rounded-xl border border-white/[0.08] font-mono text-xs overflow-x-auto my-2.5 leading-relaxed shadow-inner" {...props} />
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
                              hr: ({ node, ...props }) => (
                                <hr className="border-white/[0.06] my-3" {...props} />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong className="font-semibold text-zinc-100" {...props} />
                              ),
                              a: ({ node, ...props }) => (
                                <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
                              ),
                            }}
                          >
                            {item.summary}
                          </ReactMarkdown>
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
  );
};
