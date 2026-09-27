'use client';

import { useEffect } from 'react';

/**
 * SiteVisitorTracker
 * Tracks site-wide unique visitor sessions (24-hour deduplicated)
 * across all pages of the website (Homepage, Vault, Privacy, Uninstall, etc.)
 */
export const SiteVisitorTracker: React.FC = () => {
  useEffect(() => {
    // Non-blocking call to log site visitor
    fetch('/api/analytics/view', { method: 'POST' }).catch(() => {
      // Silent failover for offline/local usage
    });
  }, []);

  return null;
};
