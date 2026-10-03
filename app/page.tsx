

import React from 'react';
import type { Metadata } from 'next';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { MetaVsLegacySection } from '@/components/landing/MetaVsLegacySection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CreatorContactSection } from '@/components/landing/CreatorContactSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Free Instagram Reels AI Summarizer',
  description: 'Extract Instagram Reels into structured AI summaries, transcripts, code blocks, and Obsidian notes. Free & private tool by Manikanta Sandula.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar />

      {/* Focused Single-Scroll Sections */}
      <main className="flex-1">
        {/* Screen 1: Punchy Hero with Live Transformation Card */}
        <HeroSection />

        {/* Screen 2: 3-Step Clean Visual Pipeline */}
        <HowItWorksSection />

        {/* Screen 3: 4 Core Capabilities */}
        <FeaturesSection />

        {/* Screen 4: Multimodal Meta AI vs Legacy OCR/Whisper Comparison */}
        <MetaVsLegacySection />

        {/* Screen 5: Interactive FAQ Section (SEO & Rich Snippets) */}
        <FaqSection />

        {/* Screen 5: Call-to-Action & Creator Feedback */}
        <CreatorContactSection />
      </main>

      {/* Landing Footer */}
      <LandingFooter />
    </div>
  );
}
