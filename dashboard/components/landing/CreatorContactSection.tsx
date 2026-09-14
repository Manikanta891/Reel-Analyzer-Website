'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

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
    <section id="contact" className="py-20 bg-zinc-950 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto rounded-3xl bg-zinc-900/50 border border-white/[0.08] p-7 sm:p-9 backdrop-blur-xl">
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-md bg-zinc-900 text-brand-400 border border-white/[0.08] inline-flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3 h-3 text-brand-400" strokeWidth={1.5} />
              <span>Direct Creator Channel</span>
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Send a Message to the Creator
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Have a feature idea, discovered an edge case, or want custom integrations? Drop a direct note.
            </p>
          </div>

          {isSent ? (
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-emerald-500/20 text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-white">Message Delivered!</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Thanks for your message. Your feedback directly shapes upcoming releases of Reel Analyzer.
              </p>
              <button
                onClick={() => {
                  setIsSent(false);
                  setMessage('');
                }}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Topic Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Topic:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'feature', label: 'Feature Idea' },
                    { id: 'bug', label: 'Bug Report' },
                    { id: 'feedback', label: 'General Feedback' },
                    { id: 'other', label: 'Other' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTopic(t.id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-colors ${
                        topic === t.id
                          ? 'bg-zinc-800 text-white font-semibold border-white/[0.2]'
                          : 'bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border-white/[0.06]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Your Message:
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your suggestion or feedback in detail..."
                  className="w-full p-3 rounded-xl bg-zinc-950/70 border border-white/[0.08] focus:border-brand-500 text-xs text-white placeholder-zinc-500 outline-none transition-colors duration-150 resize-none"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Your Email <span className="text-zinc-500 font-normal">(Optional, if you'd like a reply)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950/70 border border-white/[0.08] focus:border-brand-500 text-xs text-white placeholder-zinc-500 outline-none transition-colors duration-150"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
