'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp, Folder } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReelItem } from '@/types';

interface ReelTableViewProps {
  reels: ReelItem[];
  onCreatorClick?: (creator: string) => void;
}

export const ReelTableView: React.FC<ReelTableViewProps> = ({ reels, onCreatorClick }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: ReelItem) => {
    const text = `### ${item.subject}\nCreator: @${item.author}\nCategory: ${item.domain} > ${item.subdomain}\n\n${item.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.url);
    setTimeout(() => setCopiedId(null), 2000);
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
              <th className="py-3.5 px-4 font-semibold">Creator</th>
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
                    <td className="py-3.5 px-4 whitespace-nowrap text-zinc-300 font-medium">
                      <button
                        onClick={() => {
                          const clean = (item.author || '').trim().replace(/^@/, '');
                          if (
                            clean &&
                            !['unknown', 'n/a', 'na', 'null', 'undefined', 'none', '-'].includes(
                              clean.toLowerCase()
                            )
                          ) {
                            onCreatorClick?.(clean);
                          }
                        }}
                        className="hover:text-brand-300 hover:underline transition-colors text-left"
                      >
                        @{item.author || 'creator'}
                      </button>
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
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Summary */}
                  {isExpanded && (
                    <tr className="bg-zinc-950/60">
                      <td colSpan={5} className="p-6">
                        <div className="prose prose-invert prose-xs max-w-none text-zinc-300 bg-zinc-950 p-5 rounded-xl border border-white/[0.06]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
