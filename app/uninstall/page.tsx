'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';

const UNINSTALL_REASONS = [
  'Missing features I needed',
  'Too slow or performance lag',
  'Encountered a bug or error',
  'Did not use it often enough',
  'Just testing it out',
  'Other',
];

export default function UninstallFeedbackPage() {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'uninstall_survey',
          reason: selectedReason || 'Not specified',
          message: message.trim(),
          senderEmail: email.trim() || 'anonymous',
        }),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting survey:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col justify-between font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <header className="w-full border-b border-white/[0.08] bg-[#0b0c10]/80 backdrop-blur-xl py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.1] bg-zinc-900 flex items-center justify-center">
              <Image
                src="/logos/icon-48.png"
                alt="Reel Analyzer"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              Reel Analyzer
            </span>
          </Link>

          <Link
            href="/vault"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Open Web Vault</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        {isSubmitted ? (
          <div className="p-8 rounded-2xl bg-[#12131a] border border-white/[0.08] backdrop-blur-xl text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-white">Thank You for Your Feedback!</h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              Your honest review helps us make Reel Analyzer faster and more useful for developers.
            </p>
            <div className="pt-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-white/[0.08] transition-colors"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#12131a] border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06] inline-flex items-center gap-1 mb-2">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" strokeWidth={1.5} />
                <span>Extension Offboarding</span>
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                We’re sorry to see you go!
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Help us improve. Why did you decide to remove the Chrome extension?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason Selector Chips */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  What was the primary reason?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {UNINSTALL_REASONS.map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setSelectedReason(r)}
                      className={`text-left text-xs px-3 py-2.5 rounded-xl border transition-colors ${
                        selectedReason === r
                          ? 'bg-zinc-800 text-white border-white/[0.24] font-semibold'
                          : 'bg-[#0b0c10]/80 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border-white/[0.06]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Any suggestions or message for the creator?
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what we could do better or features you wished existed..."
                  className="w-full p-3 rounded-xl bg-[#0b0c10]/80 border border-white/[0.08] focus:border-indigo-500 text-xs text-white placeholder-zinc-500 outline-none transition-colors duration-150 resize-none"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email <span className="text-zinc-500 font-normal">(Optional, if you want a response)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0c10]/80 border border-white/[0.08] focus:border-indigo-500 text-xs text-white placeholder-zinc-500 outline-none transition-colors duration-150"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20 transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </form>

            {/* Privacy note */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06] text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
              <span>Your local data remains stored in your browser and is never deleted unless you clear site data.</span>
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-white/[0.08] py-4 bg-[#0b0c10] text-center text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-[11px]">
          <span>Reel Analyzer &bull; Personal Knowledge Management</span>
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
            Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
