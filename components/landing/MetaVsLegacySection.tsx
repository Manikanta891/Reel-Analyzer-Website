'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Eye,
  Code2,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const MetaVsLegacySection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<0 | 1 | 2>(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance slideshow every 5.5 seconds (paused on hover or touch)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Touch Swipe Handling for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      setActiveSlide((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      setActiveSlide((prev) => (prev === 0 ? 2 : ((prev - 1) as 0 | 1 | 2)));
    }
  };

  const nextSlide = () => setActiveSlide((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? 2 : ((prev - 1) as 0 | 1 | 2)));

  const slides = [
    {
      id: 0,
      badge: 'Multimodal Vision',
      icon: Eye,
      iconColor: 'text-purple-400',
      glowColor: 'bg-purple-600/10',
      dotColor: 'bg-purple-400',
      title: 'It Watches What Happens on Screen',
      text: 'Speech-to-text is blind when creators code silently, cook without speaking, or sketch diagrams. Meta AI analyzes real-time video frames and physical actions.',
      tag: 'Understands silent demos, gestures & screen workflows',
    },
    {
      id: 1,
      badge: 'Syntax Intelligence',
      icon: Code2,
      iconColor: 'text-indigo-400',
      glowColor: 'bg-indigo-600/10',
      dotColor: 'bg-indigo-400',
      title: 'Clean Syntax, Zero Broken OCR Typos',
      text: 'Traditional screen-scrapers confuse "1" with "l" and mangle indentation. Meta AI perceives language syntax trees, returning production-ready code for Obsidian.',
      tag: 'Preserves exact indentation, brackets & language ASTs',
    },
    {
      id: 2,
      badge: 'Local & Free Forever',
      icon: Zap,
      iconColor: 'text-emerald-400',
      glowColor: 'bg-emerald-600/10',
      dotColor: 'bg-emerald-400',
      title: '$0 / Month. Powered by Your Browser',
      text: 'No $20/month cloud GPU subscriptions or reel limits. Reel Analyzer runs securely through your authenticated Meta AI session and works privately on your device.',
      tag: 'Unlimited processing • 100% private on your device',
    },
  ];

  const currentSlide = slides[activeSlide];
  const CurrentIcon = currentSlide.icon;

  return (
    <section className="snap-section py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-[#08090e] border-t border-white/[0.06] relative overflow-hidden">
      {/* Background ambient subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/[0.04] blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Minimal Section Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase font-semibold tracking-wider px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Meta AI Advantage</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Beyond Audio.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              True Video Comprehension.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Unlike generic transcribers, Reel Analyzer understands what creators visually demonstrate.
          </p>
        </div>

        {/* Minimalist Showcase Slideshow Card */}
        <div
          className="relative max-w-2xl mx-auto rounded-3xl bg-[#0f1118] border border-white/[0.08] p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden text-center group select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Ambient soft glow matching active slide */}
          <div
            className={`absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${currentSlide.glowColor}`}
          />

          {/* Minimal Slide Content with Fade Transition */}
          <div
            key={activeSlide}
            className="relative z-10 space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-300 ease-out"
          >
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300">
              <CurrentIcon className={`w-3.5 h-3.5 ${currentSlide.iconColor}`} />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Bold Minimal Headline */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight max-w-lg mx-auto">
              {currentSlide.title}
            </h3>

            {/* Crisp 1-Sentence Description */}
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed px-2">
              {currentSlide.text}
            </p>

            {/* Minimal High-Impact Pill */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] sm:text-xs font-medium text-zinc-300">
                <span className={`w-1.5 h-1.5 rounded-full ${currentSlide.dotColor} animate-pulse`} />
                <span>{currentSlide.tag}</span>
              </span>
            </div>
          </div>

          {/* Minimalist Navigation Footer */}
          <div className="relative z-10 flex items-center justify-between pt-8 sm:pt-10 mt-6 border-t border-white/[0.06]">
            {/* Clean Counter */}
            <span className="font-mono text-xs text-zinc-500 tracking-wider">
              0{activeSlide + 1} &mdash; 03
            </span>

            {/* Apple-style Pill Dots */}
            <div className="flex items-center gap-2">
              {slides.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlide(s.id as 0 | 1 | 2)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === s.id
                      ? 'w-7 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Slide ${s.id + 1}`}
                />
              ))}
            </div>

            {/* Minimal Arrow Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-90 text-zinc-400 hover:text-white border border-white/[0.06] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-90 text-zinc-400 hover:text-white border border-white/[0.06] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
