'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

/**
 * Client-side component to handle Next.js App Router pageview tracking.
 * Wrapped in Suspense to satisfy Next.js useSearchParams requirements.
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname;
      const search = searchParams?.toString();
      if (search) {
        url += `?${search}`;
      }

      // Track pageview on route change
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey =
      process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const posthogHost =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

    // Only initialize if an API key is provided
    if (posthogKey && typeof window !== 'undefined') {
      posthog.init(posthogKey, {
        api_host: '/ingest',
        ui_host: posthogHost,
        person_profiles: 'identified_only', // Keep anonymous visitors completely private
        capture_pageview: false, // Handled manually via PostHogPageView for accurate Next.js SPA transitions
        capture_pageleave: true,
        // Session recording is disabled by default for strict privacy.
        // Set NEXT_PUBLIC_POSTHOG_RECORDING=true in .env to enable it.
        disable_session_recording:
          process.env.NEXT_PUBLIC_POSTHOG_RECORDING !== 'true',
        session_recording: {
          // If session recording is turned on, strictly mask all user inputs and text
          maskAllInputs: true,
        },
      });
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}

/**
 * Convenient helper to trigger custom PostHog analytics events from any client component
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  if (
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)
  ) {
    posthog.capture(eventName, properties);
  }
};
