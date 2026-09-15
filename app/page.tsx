'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { CreatorContactSection } from '@/components/landing/CreatorContactSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      {/* Top Navbar */}
      <LandingNavbar />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero with interactive video-to-playbook pipeline demo */}
        <HeroSection />

        {/* 3-Step How It Works Breakdown */}
        <HowItWorksSection />

        {/* Core Capabilities & Features Grid */}
        <FeaturesSection />

        {/* Privacy & Security Guarantee */}
        <PrivacySection />

        {/* Direct Creator Feedback & Message Box */}
        <CreatorContactSection />
      </main>

      {/* Landing Footer */}
      <LandingFooter />
    </div>
  );
}
