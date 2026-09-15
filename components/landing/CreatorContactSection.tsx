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
  Globe,
  Github,
  Mail,
  Heart,
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
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[300px] bg-indigo-600/[0.07] blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Get Started Callout */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-indigo-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Built for Builders &amp; Learners</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Ready to turn saved reels into permanent knowledge?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto lg:mx-0">
            Install the free Chrome extension and start organizing coding tips, frameworks, and architecture blueprints in one click.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all active:scale-[0.98]"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-xs font-bold border border-white/[0.08] flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Web Vault</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-3 flex items-center gap-4 justify-center lg:justify-start text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Local Storage</span>
            </div>
            <span className="text-zinc-600">&bull;</span>
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-700">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Right Column: Redesigned Creator Message Box */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-gradient-to-b from-[#141622] to-[#0d0e15] border border-white/[0.08] p-6 sm:p-7 shadow-2xl relative overflow-hidden group">
            {/* Header with Creator Info */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm shadow-md">
                  MS
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>Message the Creator</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Direct feedback shapes the next release
                  </p>
                </div>
              </div>

              {/* Creator Links */}
              <div className="flex items-center gap-1.5">
                <a
                  href="https://manikanta.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
                  title="Portfolio"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://github.com/Manikanta891"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
                  title="GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {isSent ? (
              <div className="p-8 rounded-xl bg-[#090a0f] border border-emerald-500/30 text-center space-y-3 my-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-zinc-100">Message Delivered!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Thank you for reaching out. Your feedback is delivered straight to the developer.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-indigo-300 font-semibold border border-white/[0.06] transition-colors mt-2"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {/* Topic selector pills */}
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1.5">Select Category</label>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                    {[
                      { id: 'feature', label: '⚡ Feature' },
                      { id: 'bug', label: '🐛 Bug' },
                      { id: 'feedback', label: '💡 Idea' },
                      { id: 'other', label: '💬 General' },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setTopic(t.id as any)}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                          topic === t.id
                            ? 'bg-indigo-600/20 text-indigo-300 font-bold border-indigo-500/40 shadow-sm'
                            : 'bg-[#0b0c12] text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 block mb-1.5">Your Feedback or Idea</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share what feature you'd like to see, or any thoughts..."
                    className="w-full p-3 rounded-xl bg-[#0a0b10] border border-white/[0.08] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-medium text-zinc-400">Email Address</label>
                    <span className="text-[10px] text-zinc-500 font-mono">Optional (for replies)</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0b10] border border-white/[0.08] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Note...' : 'Send to Creator'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
