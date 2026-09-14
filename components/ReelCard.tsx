'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Lightbulb,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { ReelItem } from '@/types';

interface ReelCardProps {
  item: ReelItem;
  onSelect: (item: ReelItem) => void;
  onEntityClick?: (entity: string) => void;
  onCreatorClick?: (creator: string) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  item,
  onSelect,
  onEntityClick,
  onCreatorClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `### ${item.subject}
**Creator:** @${item.author}
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

  const entityList = item.entities
    ? item.entities
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
    : [];

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = (item.author || '').trim().replace(/^@/, '');
    if (
      clean &&
      !['unknown', 'n/a', 'na', 'null', 'undefined', 'none', '-'].includes(
        clean.toLowerCase()
      )
    ) {
      onCreatorClick?.(clean);
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-white/[0.2] p-5 sm:p-6 backdrop-blur-md transition-colors duration-150 cursor-pointer flex flex-col justify-between hover:bg-zinc-900/80"
    >
      <div>
        {/* Top Header & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/[0.06]">
              {item.domain}
            </span>
            {item.subdomain && (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-zinc-800/50 text-zinc-400">
                {item.subdomain}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCopyMarkdown}
              title="Copy Summary"
              aria-label="Copy Summary"
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
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
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Subject Title */}
        <h3 className="text-base font-semibold text-white tracking-tight leading-snug mb-1.5 group-hover:text-brand-300 transition-colors">
          {item.subject || 'Actionable Video Insight'}
        </h3>

        {/* Creator */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3.5">
          <button
            onClick={handleAuthorClick}
            title={`Filter by @${(item.author || '').replace(/^@/, '')}`}
            className="hover:text-brand-300 hover:underline transition-colors font-medium text-zinc-300"
          >
            @{item.author || 'creator'}
          </button>
        </div>

        {/* Key Takeaway Box */}
        {item.personalUtility && (
          <div className="mb-3.5 p-3 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
            <div className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={1.5} />
              <div className="line-clamp-2">
                <span className="font-medium text-zinc-200">Takeaway:</span>{' '}
                <span className="text-zinc-400">{item.personalUtility}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tool Chips */}
        {entityList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <Wrench className="w-3 h-3 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
            {entityList.slice(0, 4).map((ent) => (
              <button
                key={ent}
                onClick={(e) => {
                  e.stopPropagation();
                  onEntityClick?.(ent);
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
              >
                {ent}
              </button>
            ))}
            {entityList.length > 4 && (
              <span className="text-[10px] text-zinc-400 font-mono">
                +{entityList.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Trigger */}
      <div className="border-t border-white/[0.06] pt-3 mt-3 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
        <span className="font-medium">Read Summary</span>
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </div>
    </div>
  );
};
