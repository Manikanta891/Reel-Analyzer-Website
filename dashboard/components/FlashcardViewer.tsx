'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ExternalLink,
  Bookmark,
  Lightbulb,
  Wrench,
  Folder,
  Trophy,
  Award,
  ArrowRight,
  BookOpen,
  FolderClosed,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReelItem } from '@/types';
import { ErrorBoundary } from './ErrorBoundary';
import { FlashcardIntermissionAd } from './ads/FlashcardIntermissionAd';

interface FlashcardViewerProps {
  reels: ReelItem[];
  domains?: string[];
  selectedDomain?: string;
  onSelectDomain?: (domain: string) => void;
  onResetFilters?: () => void;
  onSwitchToReels?: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  reels = [],
  domains = [],
  selectedDomain = 'All',
  onSelectDomain,
  onResetFilters,
  onSwitchToReels,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isIntermission, setIsIntermission] = useState(false);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);

  // Safe index bounds
  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, reels.length - 1));
  const current: ReelItem | undefined = reels[safeIndex];

  // Reset completion state when reels list changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsIntermission(false);
    setIsDeckCompleted(false);
  }, [reels.length, selectedDomain]);

  const handleNext = () => {
    setIsFlipped(false);

    // If currently on an intermission screen, advance to next card
    if (isIntermission) {
      setIsIntermission(false);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // If at the end of deck, show completion screen
    if (safeIndex >= reels.length - 1) {
      setIsDeckCompleted(true);
      return;
    }

    // Check if next step hits a 5-card milestone (e.g. after card index 4, 9, 14...)
    if ((safeIndex + 1) % 5 === 0) {
      setIsIntermission(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (isIntermission) {
      setIsIntermission(false);
      return;
    }
    if (isDeckCompleted) {
      setIsDeckCompleted(false);
      return;
    }
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRestartDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsIntermission(false);
    setIsDeckCompleted(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isDeckCompleted) {
          handleRestartDeck();
        } else if (isIntermission) {
          handleNext();
        } else {
          setIsFlipped((prev) => !prev);
        }
      } else if (e.code === 'ArrowRight' || e.code === 'Enter') {
        e.preventDefault();
        if (isDeckCompleted) {
          handleRestartDeck();
        } else {
          handleNext();
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, reels.length, isIntermission, isDeckCompleted]);

  if (!reels || reels.length === 0 || !current) {
    return (
      <div className="p-12 text-center text-zinc-400 bg-zinc-900/40 rounded-2xl border border-white/[0.08] max-w-xl mx-auto my-6">
        <Folder className="w-8 h-8 text-zinc-600 mx-auto mb-2" strokeWidth={1.5} />
        <h3 className="text-sm font-semibold text-white mb-1">No Flashcards Available</h3>
        <p className="text-xs text-zinc-400 mb-4">
          No reels match your current category or search filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white border border-white/[0.08] transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  // 1. DECK COMPLETED SCREEN (Fixed Static Dimensions)
  if (isDeckCompleted) {
    return (
      <ErrorBoundary fallbackTitle="Error displaying completion screen">
        <div className="max-w-2xl mx-auto py-2">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Flashcards
              </span>
              <span className="text-xs text-zinc-600">•</span>
              <span className="text-xs text-emerald-400 font-medium">Session Complete</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              [Space] restart
            </span>
          </div>

          {/* Fixed Height Completed Card */}
          <div className="h-[520px] sm:h-[540px] rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between select-none">
            {/* Top Celebration */}
            <div className="text-center pt-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Deck Completed! 🎉
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                You reviewed all <strong className="text-zinc-200 font-mono">{reels.length}</strong> flashcards in <strong className="text-zinc-300">{selectedDomain === 'All' ? 'All Categories' : selectedDomain}</strong>.
              </p>
            </div>

            {/* Scrollable Center: Sponsor + Topic Switcher */}
            <div className="flex-1 min-h-0 overflow-y-auto my-3 pr-1 space-y-3">
              <FlashcardIntermissionAd
                slotId="flashcard-deck-complete"
                category="Featured Learning Sponsor"
              />

              {/* Quick Topic Switcher Pills */}
              {domains.length > 0 && onSelectDomain && (
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06] text-left">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                    <FolderClosed className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                    <span>Switch to Another Topic Deck:</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {domains.map((dom) => (
                      <button
                        key={dom}
                        onClick={() => {
                          onSelectDomain(dom);
                          handleRestartDeck();
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          selectedDomain === dom
                            ? 'bg-zinc-800 text-white border-white/[0.2] font-semibold'
                            : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
                        }`}
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3.5">
              <button
                onClick={handleRestartDeck}
                className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Restart Deck [Space]</span>
              </button>

              {onSwitchToReels && (
                <button
                  onClick={onSwitchToReels}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-white/[0.06] flex items-center gap-1.5 transition-colors active:scale-[0.98]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                  <span>Browse Full Vault</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // 2. STUDY MILESTONE CHECKPOINT SCREEN (Fixed Static Dimensions)
  if (isIntermission) {
    return (
      <ErrorBoundary fallbackTitle="Error displaying milestone intermission">
        <div className="max-w-2xl mx-auto py-2">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Flashcards
              </span>
              <span className="text-xs text-zinc-600">•</span>
              <span className="text-xs text-brand-400 font-mono">
                {safeIndex + 1} of {reels.length}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              [Space] continue
            </span>
          </div>

          {/* Fixed Height Intermission Card */}
          <div className="h-[520px] sm:h-[540px] rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between select-none">
            {/* Top Celebration */}
            <div className="text-center pt-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-3">
                <Award className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-300 border border-white/[0.06] mb-2 font-mono">
                {safeIndex + 1} / {reels.length} Mastered
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Study Checkpoint &bull; Take a Breath
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                You’ve completed {safeIndex + 1} actionable video takeaways. Keep up the momentum!
              </p>
            </div>

            {/* Scrollable Center Sponsor */}
            <div className="flex-1 min-h-0 overflow-y-auto my-3 pr-1 flex flex-col justify-center">
              <FlashcardIntermissionAd
                slotId="flashcard-study-checkpoint"
                category="Sponsored Learning Resource"
              />
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3.5">
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium border border-white/[0.06] transition-colors"
              >
                &larr; Back to Card
              </button>

              <button
                onClick={handleNext}
                className="flex-1 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <span>Continue Studying [Space]</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  const entityList = current?.entities
    ? current.entities
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
    : [];

  return (
    <ErrorBoundary fallbackTitle="Error displaying flashcard">
      <div className="max-w-2xl mx-auto py-2">
        {/* Top Header & Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Flashcards
            </span>
            <span className="text-xs text-zinc-600">•</span>
            <span className="text-xs text-zinc-400 font-mono">
              {safeIndex + 1} of {reels.length}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline font-mono">
            [Space] flip • [←] [→] navigate
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-800 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${((safeIndex + 1) / reels.length) * 100}%` }}
          />
        </div>

        {/* Main Study Card: Strictly Fixed Height (h-[520px] sm:h-[540px]) to prevent jumping */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="h-[520px] sm:h-[540px] rounded-2xl bg-zinc-900/60 border border-white/[0.08] hover:border-white/[0.16] p-6 sm:p-7 backdrop-blur-xl cursor-pointer transition-colors duration-150 flex flex-col justify-between select-none"
        >
          {/* 1. Card Top Header (Fixed Height, flex-shrink-0) */}
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3.5 flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-white/[0.06]">
                {current.domain || 'General'}
              </span>
              {current.subdomain && (
                <span className="text-xs text-zinc-400 font-medium">
                  {current.subdomain}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-white/[0.06] transition-colors active:scale-[0.98]"
              >
                <RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{isFlipped ? 'Show Topic' : 'Reveal Solution'}</span>
              </button>
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                title="View on Instagram"
                aria-label="View on Instagram"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* 2. Card Body (Scrollable Center with flex-1 min-h-0) */}
          <div className="flex-1 min-h-0 overflow-y-auto my-3 pr-1">
            {!isFlipped ? (
              /* FRONT: Topic / Subject / Key Takeaway Challenge (Centered in available height) */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-2">
                <div className="inline-flex p-3 rounded-xl bg-zinc-800/80 text-zinc-300 border border-white/[0.06]">
                  <Bookmark className="w-5 h-5" strokeWidth={1.5} />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug max-w-lg mx-auto">
                  {current.subject || 'Actionable Video Insight'}
                </h2>

                {current.personalUtility && (
                  <div className="w-full max-w-lg mx-auto p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06] text-left">
                    <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" strokeWidth={1.5} />
                      <div>
                        <span className="font-semibold text-zinc-200">Takeaway:</span>{' '}
                        <span className="text-zinc-400">{current.personalUtility}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-zinc-500 font-medium pt-1">
                  Click anywhere to flip and reveal full solution [Space]
                </div>
              </div>
            ) : (
              /* BACK: Fluid Solution Rendering (Scrollable inside fixed frame) */
              <div className="space-y-3 text-left" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.06] prose prose-invert prose-xs max-w-none text-zinc-300 leading-relaxed overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {current.summary || '*No summary available.*'}
                  </ReactMarkdown>
                </div>

                {/* Tools & Tags */}
                {entityList.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <Wrench className="w-3 h-3 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                    {entityList.map((ent) => (
                      <span
                        key={ent}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.06]"
                      >
                        {ent}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Card Footer Controls (Fixed Height, flex-shrink-0) */}
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.06] text-xs font-medium text-zinc-200 transition-colors active:scale-[0.98]"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-zinc-400">
              {safeIndex + 1} / {reels.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors active:scale-[0.98]"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
