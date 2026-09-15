'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Lightbulb,
  ArrowRight,
  Trash2,
  Clock,
  BookOpen,
  Tag,
} from 'lucide-react';
import { ReelItem } from '@/types';

interface ReelCardProps {
  item: ReelItem;
  onSelect: (item: ReelItem) => void;
  onEntityClick?: (entity: string) => void;
  onDelete?: (item: ReelItem) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  item,
  onSelect,
  onEntityClick,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);

  const handleCopyMarkdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `### ${item.subject}
**Category:** ${item.domain} > ${item.subdomain || 'General'}
${item.personalUtility ? `**Key Takeaway:** ${item.personalUtility}\n` : ''}
${item.entities ? `**Tools & Frameworks:** ${item.entities}\n` : ''}

#### Summary
${item.summary}

[View Original Reel](${item.url})
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e: React.MouseEvent) => {
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

  const entityList = item.entities
    ? item.entities
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
    : [];

  const visibleTools = showAllTools ? entityList : entityList.slice(0, 3);
  const hiddenCount = entityList.length - 3;

  // Calculate estimated reading time based on summary length
  const wordCount = (item.summary || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 120));

  return (
    <div
      onClick={() => onSelect(item)}
      className="group rounded-xl bg-[#12131a] hover:bg-[#161822] border border-white/[0.06] hover:border-white/[0.14] p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-md select-none"
    >
      <div>
        {/* Top Header & Metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
              {item.domain}
            </span>
            {item.subdomain && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.02] text-zinc-400">
                {item.subdomain}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 mr-1">
              <Clock className="w-3 h-3" />
              {readTime}m read
            </span>

            <button
              onClick={handleCopyMarkdown}
              title="Copy Summary"
              aria-label="Copy Summary"
              className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
              ) : (
                <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
              )}
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Reel on Instagram"
              aria-label="Open Reel on Instagram"
              className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
            {onDelete && (
              <button
                onClick={handleDelete}
                title="Delete Reel from Vault"
                aria-label="Delete Reel from Vault"
                className="p-1.5 rounded-lg bg-[#0e0f14] hover:bg-red-500/20 text-zinc-500 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Subject Title */}
        <h3 className="text-[15px] font-semibold text-zinc-100 tracking-tight leading-snug mb-3 group-hover:text-indigo-400 transition-colors">
          {item.subject || 'Actionable Video Insight'}
        </h3>

        {/* Core Takeaway / Insight Callout Box */}
        {(item.personalUtility || item.summary) && (
          <div className="mb-3.5 p-3 rounded-lg bg-[#0e0f14] border-l-2 border-indigo-500/70 border border-white/[0.04]">
            <div className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
              <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={1.5} />
              <div className="line-clamp-2">
                <span className="font-medium text-zinc-200">Core Takeaway:</span>{' '}
                <span className="text-zinc-400">{item.personalUtility || item.summary}</span>
              </div>
            </div>
          </div>
        )}

        {/* Concept / Tool Chips */}
        {entityList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <Tag className="w-3 h-3 text-zinc-500 flex-shrink-0" strokeWidth={1.5} />
            {visibleTools.map((ent) => (
              <button
                key={ent}
                onClick={(e) => {
                  e.stopPropagation();
                  onEntityClick?.(ent);
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#0e0f14] hover:bg-[#1a1c26] text-zinc-400 hover:text-zinc-200 border border-white/[0.05] transition-colors"
              >
                #{ent}
              </button>
            ))}
            {!showAllTools && hiddenCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTools(true);
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono px-1.5 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
              >
                +{hiddenCount} more
              </button>
            )}
            {showAllTools && hiddenCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTools(false);
                }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono px-1.5 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.04] transition-colors"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="border-t border-white/[0.05] pt-3 mt-3 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
          <BookOpen className="w-3 h-3 text-indigo-400" />
          <span>Knowledge Note</span>
        </div>
        <div className="flex items-center gap-1 text-indigo-400 font-medium text-xs">
          <span>Read Note</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
