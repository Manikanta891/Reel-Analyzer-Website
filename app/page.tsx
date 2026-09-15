'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CreatorContactSection } from '@/components/landing/CreatorContactSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar />

      {/* 4 Focused Single-Scroll Sections */}
      <main className="flex-1">
        {/* Screen 1: Punchy Hero with Live Transformation Card */}
        <HeroSection />

        {/* Screen 2: 3-Step Clean Visual Pipeline */}
        <HowItWorksSection />

        {/* Screen 3: 4 Core Capabilities */}
        <FeaturesSection />

        {/* Screen 4: Call-to-Action & Creator Feedback */}
        <CreatorContactSection />
      </main>

      {/* Landing Footer */}
      <LandingFooter />
    </div>
  );
}
