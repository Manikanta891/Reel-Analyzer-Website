'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const CreatorContactSection: React.FC = () => {
  const [topic, setTopic] = useState<'feature' | 'bug' | 'feedback' | 'other'>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'creator_message',
          reason: topic,
          message: message.trim(),
          senderEmail: email.trim() || 'anonymous',
        }),
      });
      setIsSent(true);
    } catch (err) {
      console.error('Error submitting message:', err);
      setIsSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0c10] border-t border-white/[0.06] relative"
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Get Started Callout */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Building Your Vault</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Ready to turn saved reels into permanent knowledge?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto lg:mx-0">
            Install the free Chrome extension and start organizing coding tips, frameworks, and tools in one click.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              <span>Add to Chrome — Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/vault"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#14151e] hover:bg-[#1a1c26] text-zinc-300 text-xs font-semibold border border-white/[0.08] flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Web Vault</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center gap-2 justify-center lg:justify-start text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Local Storage &bull; </span>
            <Link href="/privacy" className="text-zinc-400 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Right Column: Direct Creator Message Box */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-[#12131a] border border-white/[0.06] p-6 sm:p-7 shadow-xl">
            <div className="mb-4">
              <span className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Message the Creator
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Have a feature idea or feedback? Send a direct note.
              </p>
            </div>

            {isSent ? (
              <div className="p-6 rounded-xl bg-[#0e0f14] border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-semibold text-zinc-100">Message Delivered!</h4>
                <p className="text-[11px] text-zinc-400">
                  Thanks for your feedback. It directly shapes our next update.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                  }}
                  className="text-[11px] text-indigo-400 hover:underline font-medium pt-2"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {/* Topic selector */}
                <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                  {[
                    { id: 'feature', label: 'Feature' },
                    { id: 'bug', label: 'Bug' },
                    { id: 'feedback', label: 'Feedback' },
                    { id: 'other', label: 'Other' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTopic(t.id as any)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                        topic === t.id
                          ? 'bg-[#1a1c26] text-zinc-100 font-semibold border-indigo-500/30'
                          : 'bg-[#0e0f14] text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Message Textarea */}
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your suggestions or feedback..."
                  className="w-full p-2.5 rounded-lg bg-[#0e0f14] border border-white/[0.08] focus:border-indigo-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors resize-none"
                />

                {/* Email Input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-[#0e0f14] border border-white/[0.08] focus:border-indigo-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
