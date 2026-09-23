'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Github,
  Bug,
  Lightbulb,
  Code2,
} from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/nfoegekloemokpjdmhbkfaihnokfecci?utm_source=item-share-cb';

export const CreatorContactSection: React.FC = () => {
  const router = useRouter();
  const [topic, setTopic] = useState<'feature' | 'bug' | 'feedback' | 'other'>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleAddToChrome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
    router.push('/vault');
  };

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

  const CATEGORIES = [
    { id: 'feature', label: 'Feature', icon: Sparkles },
    { id: 'bug', label: 'Bug', icon: Bug },
    { id: 'feedback', label: 'Idea', icon: Lightbulb },
    { id: 'other', label: 'General', icon: MessageSquare },
  ];

  return (
    <section
      id="contact"
      className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[300px] bg-indigo-600/[0.07] blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Callout */}
        <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-indigo-300">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">Direct Developer Connection</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Turn saved reels into your personal second brain.
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto lg:mx-0">
            Install the free Chrome extension and start organizing coding tips, frameworks, and architecture blueprints in one click.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start pt-2 max-w-sm sm:max-w-none mx-auto">
            <a
              href={CHROME_STORE_URL}
              onClick={handleAddToChrome}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Add to Chrome &mdash; Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/vault"
              className="px-6 py-3 rounded-xl bg-[#14151e] hover:bg-[#1a1c26] text-zinc-200 text-xs font-bold border border-white/[0.08] flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Web Vault</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center gap-4 justify-center lg:justify-start text-xs text-zinc-400">
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

        {/* Right Column: Premium Feedback Card (Redesigned) */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <span>Message the Creator</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Direct feedback shapes upcoming releases
                </p>
              </div>

              {/* Minimal Social Links */}
              <div className="flex items-center gap-1">
                <a
                  href="https://manikanta.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                  title="Creator Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/Manikanta891"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {isSent ? (
              <div className="p-8 rounded-xl bg-[#0c0d12] border border-emerald-500/25 text-center space-y-3 my-2 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-100">Feedback Sent!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Thank you for reaching out. Your feedback helps make Reel Analyzer better.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-indigo-300 font-medium border border-white/[0.06] transition-colors mt-2"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Category Pills */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = topic === cat.id;
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => setTopic(cat.id as any)}
                          className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-xs font-medium ${
                            isSelected
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border-indigo-500/40 shadow-sm'
                              : 'bg-[#0c0d12] text-zinc-400 hover:text-zinc-200 border-white/[0.06] hover:bg-white/[0.02]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Your Feedback or Feature Request
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share what features you'd like to see, or any thoughts..."
                    className="w-full p-3 rounded-xl bg-[#0c0d12] border border-white/[0.08] focus:border-indigo-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all resize-none shadow-inner"
                  />
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Email</label>
                    <span className="text-[10px] text-zinc-500 font-mono">Optional</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d12] border border-white/[0.08] focus:border-indigo-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-indigo-600/20 active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
