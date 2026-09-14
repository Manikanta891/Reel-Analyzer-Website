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
  User,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReelItem } from '@/types';
import { ErrorBoundary } from './ErrorBoundary';

interface ReelDetailModalProps {
  reel: ReelItem | null;
  onClose: () => void;
  onEntityClick?: (entity: string) => void;
  onCreatorClick?: (creator: string) => void;
}

export const ReelDetailModal: React.FC<ReelDetailModalProps> = ({
  reel,
  onClose,
  onEntityClick,
  onCreatorClick,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (reel) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [reel, onClose]);

  if (!reel) return null;

  const handleCopyMarkdown = () => {
    try {
      const text = `### ${reel.subject || 'Actionable Video Insight'}
**Creator:** @${reel.author || 'creator'}
**Category:** ${reel.domain || 'General'} > ${reel.subdomain || 'General'}
${reel.personalUtility ? `**Key Takeaway:** ${reel.personalUtility}\n` : ''}
${reel.entities ? `**Tools & Frameworks:** ${reel.entities}\n` : ''}

#### Summary
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

  const entityList = reel.entities
    ? reel.entities
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
    : [];

  const tagList = reel.tags
    ? reel.tags
        .split(/[,\s]+/)
        .map((t) => t.trim())
        .filter((t) => t.startsWith('#') || t.length > 0)
    : [];

  return (
    <ErrorBoundary fallbackTitle="Error loading summary reader">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Static, stable modal box */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[88vh] bg-zinc-900 border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Sticky Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-zinc-900 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Category Breadcrumbs */}
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/[0.06]">
                  {reel.domain || 'General'}
                </span>
                {reel.subdomain && (
                  <span className="text-xs text-zinc-400 font-medium">
                    / {reel.subdomain}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {reel.subject || 'Actionable Video Insight'}
              </h2>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleCopyMarkdown}
                title="Copy Markdown"
                className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                ) : (
                  <Copy className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Instagram"
                className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <button
                onClick={onClose}
                title="Close (Esc)"
                className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors duration-150"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Creator */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                <span>
                  Creator:{' '}
                  <button
                    onClick={() => {
                      const clean = (reel.author || '').trim().replace(/^@/, '');
                      if (
                        clean &&
                        !['unknown', 'n/a', 'na', 'null', 'undefined', 'none', '-'].includes(
                          clean.toLowerCase()
                        )
                      ) {
                        onCreatorClick?.(clean);
                        onClose();
                      }
                    }}
                    className="text-zinc-200 font-bold hover:text-brand-300 hover:underline transition-colors"
                  >
                    @{reel.author || 'creator'}
                  </button>
                </span>
              </div>
            </div>

            {/* Key Takeaway */}
            {reel.personalUtility && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08]">
                <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={1.5} />
                  <div>
                    <span className="font-semibold text-zinc-200">Key Takeaway:</span>{' '}
                    <span className="text-zinc-300">{reel.personalUtility}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fluid Rich Markdown Body */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] prose prose-invert prose-xs sm:prose-sm max-w-none text-zinc-300 leading-relaxed overflow-x-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {reel.summary || '*No detailed summary provided.*'}
              </ReactMarkdown>
            </div>

            {/* Tools & Frameworks */}
            {entityList.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Tools:</span>
                  </span>
                  {entityList.map((ent) => (
                    <button
                      key={ent}
                      onClick={() => {
                        onEntityClick?.(ent);
                        onClose();
                      }}
                      className="text-xs font-mono px-2.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
                    >
                      {ent}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Cloud */}
            {tagList.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/[0.06]">
                <Tag className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                {tagList.map((t) => (
                  <span key={t} className="text-xs text-zinc-400 font-mono">
                    {t.startsWith('#') ? t : `#${t}`}
                  </span>
                ))}
              </div>
            )}
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
              <span>View on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
