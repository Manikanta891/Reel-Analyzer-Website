'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { FAQ_ITEMS } from '@/components/seo/JsonLd';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/[0.04] blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-4xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase font-semibold tracking-wider px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Got Questions?</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Everything you need to know about Reel Analyzer, Meta AI integration, Obsidian exports, and privacy.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#12141e] border-indigo-500/30 shadow-lg shadow-indigo-950/20'
                    : 'bg-[#0e1017] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#11131c]'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06]'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-sm sm:text-base font-semibold tracking-tight transition-colors ${
                        isOpen ? 'text-white' : 'text-zinc-200'
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed pl-14 sm:pl-16 pr-6 animate-in fade-in duration-150">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
