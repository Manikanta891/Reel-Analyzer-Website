'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp, Folder, Trash2 } from 'lucide-react';
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
      <div className="p-12 text-center text-zinc-400 bg-zinc-900/40 rounded-2xl border border-white/[0.08]">
        <Folder className="w-8 h-8 text-zinc-600 mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-xs">No insights match your active search or filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-zinc-900/50 border border-white/[0.08] overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 border-b border-white/[0.08] text-zinc-400 uppercase font-semibold tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Subject & Key Takeaway</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th className="py-3.5 px-4 font-semibold">Tools</th>
              <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {reels.map((item) => {
              const isExpanded = expandedId === item.url;
              return (
                <React.Fragment key={item.url}>
                  <tr className="hover:bg-zinc-800/30 transition-colors duration-150">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-white mb-0.5 line-clamp-1">
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
                      <div className="text-[11px] text-zinc-400">{item.subdomain}</div>
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
                          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
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
                          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
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
                          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
                          title="View on Instagram"
                          aria-label="View on Instagram"
                        >
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </a>
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-all duration-150 active:scale-[0.98]"
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
                    <tr className="bg-zinc-950/60">
                      <td colSpan={4} className="p-6">
                        <div className="text-[#dcddde] bg-zinc-950 p-5 rounded-xl border border-[#2a2a2d] text-xs leading-relaxed overflow-x-auto select-text font-sans">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1 className="text-base font-bold text-white mt-4 mb-2 pb-1 border-b border-[#2a2a2d]" {...props} />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2 className="text-sm font-bold text-white mt-3.5 mb-1.5 flex items-center gap-1.5" {...props} />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3 className="text-xs font-semibold text-brand-300 mt-3 mb-1" {...props} />
                              ),
                              p: ({ node, ...props }) => (
                                <p className="leading-relaxed text-[#dcddde] my-1.5 text-xs" {...props} />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul className="list-disc pl-5 space-y-1 my-2 text-[#dcddde] text-xs" {...props} />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol className="list-decimal pl-5 space-y-1 my-2 text-[#dcddde] text-xs" {...props} />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="leading-relaxed text-[#dcddde] pl-0.5" {...props} />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-purple-500/60 pl-3 py-1 italic text-[#8a8a8e] bg-[#1e1e20]/40 rounded-r-lg my-2.5 text-xs" {...props} />
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
                                  <pre className="p-3 bg-[#121214] text-[#dcddde] rounded-xl border border-[#2a2a2d] font-mono text-xs overflow-x-auto my-2.5 leading-relaxed">
                                    <code {...props}>{children}</code>
                                  </pre>
                                );
                              },
                              hr: ({ node, ...props }) => (
                                <hr className="border-[#2a2a2d] my-3" {...props} />
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
                              table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-3 border border-[#2a2a2d] rounded-lg">
                                  <table className="w-full text-left border-collapse text-xs" {...props} />
                                </div>
                              ),
                              thead: ({ node, ...props }) => (
                                <thead className="bg-[#1e1e20] border-b border-[#2a2a2d] text-white font-semibold text-xs" {...props} />
                              ),
                              th: ({ node, ...props }) => (
                                <th className="p-2 border-r border-[#2a2a2d] last:border-r-0" {...props} />
                              ),
                              td: ({ node, ...props }) => (
                                <td className="p-2 text-[#dcddde] border-r border-[#2a2a2d] last:border-r-0 border-t border-[#2a2a2d]/60" {...props} />
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
