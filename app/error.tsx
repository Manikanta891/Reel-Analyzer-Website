'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="text-center p-8 rounded-2xl bg-zinc-900/60 border border-white/[0.08] max-w-md w-full">
        <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
          <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-bold text-white mb-1">
          Something went wrong
        </h2>
        <p className="text-xs text-zinc-400 mb-5">
          {error?.message || 'An unexpected error occurred while loading the dashboard.'}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-all duration-150 active:scale-[0.98]"
        >
          <RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Reload Dashboard</span>
        </button>
      </div>
    </div>
  );
}
