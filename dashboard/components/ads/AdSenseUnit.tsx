'use client';

import React, { useEffect, useRef } from 'react';

interface AdSenseUnitProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  layoutKey?: string;
  className?: string;
  devMockup?: React.ReactNode;
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slotId,
  format = 'auto',
  layoutKey,
  className = '',
  devMockup,
}) => {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const [isLocalOrDev, setIsLocalOrDev] = React.useState<boolean>(true);
  const isAdPushed = useRef(false);

  useEffect(() => {
    // Check if running on localhost/127.0.0.1 or dev mode
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.local') ||
        process.env.NODE_ENV === 'development');

    setIsLocalOrDev(isLocal);

    // In live production with a valid Google AdSense client ID, request the ad unit
    if (!isLocal && adClient && !isAdPushed.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isAdPushed.current = true;
      } catch (err) {
        console.error('AdSense unit render error:', err);
      }
    }
  }, [adClient]);

  // 1. On Localhost / Development: Always show custom designer preview
  if (isLocalOrDev) {
    if (devMockup) {
      return <>{devMockup}</>;
    }
    return (
      <div className={`p-4 rounded-xl border border-dashed border-white/20 bg-zinc-900/30 text-xs text-zinc-500 text-center ${className}`}>
        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
          AdSense Dev Preview (Slot: {slotId})
        </span>
        <span className="text-zinc-600">Visible on localhost &bull; Hidden in production unless AdSense client is active</span>
      </div>
    );
  }

  // 2. In Live Production: If no AdSense Client ID is set, hide completely (no dummy boxes)
  if (!adClient) {
    return null;
  }

  // 3. In Production: Render official Google AdSense <ins> container
  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format={format}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
};
