import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  ShieldCheck,
  HardDrive,
  EyeOff,
  DownloadCloud,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Reel Analyzer by Manikanta Sandula',
  description:
    'Privacy Policy for Reel Analyzer Chrome Extension and Web Dashboard. 100% Local-First, Zero Data Tracking, and Chrome Web Store Limited Use Compliance.',
  alternates: {
    canonical: 'https://reelanalyzer.manikanta.co.in/privacy',
  },
  authors: [{ name: 'Manikanta Sandula', url: 'https://manikanta.co.in' }],
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <LandingNavbar />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 text-center sm:text-left border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Local-First &amp; Zero Tracking Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-400">
            <span><strong>Last Updated:</strong> September 24, 2026</span>
            <span>&bull;</span>
            <span><strong>Applies to:</strong> Reel Analyzer Chrome Extension &amp; Web Dashboard</span>
            <span>&bull;</span>
            <span><strong>Developer:</strong> Manikanta Sandula</span>
          </div>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">Local-First Storage</h3>
            <p className="text-zinc-400 leading-relaxed">
              All extracted notes, living taxonomy trees, and custom prompts reside strictly on your device via <code className="text-zinc-300 font-mono">chrome.storage.local</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">Zero Data Harvesting</h3>
            <p className="text-zinc-400 leading-relaxed">
              We never collect your personal data, passwords, Instagram cookies, browsing history, or payment information.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">Direct AI Synthesis</h3>
            <p className="text-zinc-400 leading-relaxed">
              Prompts are dispatched directly inside your active Meta AI tab session. No intermediate servers or AI proxy backends intercept your reels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">Total Data Portability</h3>
            <p className="text-zinc-400 leading-relaxed">
              Export your knowledge base to structured Markdown Obsidian Vaults (<code className="text-zinc-300 font-mono">.zip</code>) or Playbooks (<code className="text-zinc-300 font-mono">.md</code>) anytime. Delete everything with 1-click.
            </p>
          </div>
        </div>

        {/* Detailed Policy Text */}
        <div className="space-y-10 text-sm text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">1.</span> Introduction &amp; Scope
            </h2>
            <p>
              Reel Analyzer (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the extension&rdquo;), developed by <strong>Manikanta Sandula</strong>, is a developer and creator productivity tool designed to convert educational Instagram Reels into permanent, structured knowledge notes, prompts for AI coding agents, and Obsidian-ready markdown vaults.
            </p>
            <p>
              This Privacy Policy explains how information is processed by the <strong>Reel Analyzer Chrome Extension</strong> and the companion web platform (<strong>https://reelanalyzer.manikanta.co.in/</strong>). We are committed to transparency and privacy by design: your content remains yours, runs client-side, and is stored locally on your machine.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">2.</span> Single Purpose Statement
            </h2>
            <p>
              The single, exclusive purpose of Reel Analyzer is:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs font-mono text-zinc-300 leading-relaxed">
              &ldquo;To extract publicly visible educational content from Instagram Reels, synthesize it into structured knowledge notes via Meta AI in the user&apos;s active session, and organize it into an offline-first Obsidian markdown knowledge vault.&rdquo;
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">3.</span> Information Processing &amp; Use
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <h4 className="font-semibold text-white">A. Public Instagram Reel Content</h4>
                <p className="text-zinc-400">
                  When you activate the extension on Instagram, it reads the publicly visible post caption and video URL of the active reel currently in view. This text is used solely to construct the analysis prompt.
                </p>
                <p className="text-zinc-500 text-xs">
                  &bull; We do <strong>NOT</strong> access your private messages, follower lists, personal profile credentials, or private non-public media.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <h4 className="font-semibold text-white">B. Meta AI Synthesis &amp; Local Prompt Engine</h4>
                <p className="text-zinc-400">
                  The extension interacts with your own authenticated Meta AI (<code className="text-zinc-300 font-mono">meta.ai</code>) browser tab. It injects structured prompts into the chat editor using synthetic paste events and reads the synthesized response.
                </p>
                <p className="text-zinc-500 text-xs">
                  &bull; No API keys, passwords, or login cookies are read or transmitted. The extension relies on your existing, logged-in browser session.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <h4 className="font-semibold text-white">C. In-Memory Markdown Parsing (Zero Clipboard Hijacking)</h4>
                <p className="text-zinc-400">
                  Reel Analyzer uses a dedicated in-memory HTML-to-Markdown DOM walker to preserve headings, bold highlights, code blocks, and bullet points.
                </p>
                <p className="text-zinc-500 text-xs">
                  &bull; The extension does <strong>NOT</strong> hijack, read, or overwrite your operating system clipboard.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <h4 className="font-semibold text-white">D. No Personal Identifiable Information (PII)</h4>
                <p className="text-zinc-400">
                  We do not collect names, email addresses, phone numbers, IP addresses, browsing histories, location data, or payment details.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">4.</span> Chrome Extension Permissions Justification
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Reel Analyzer adheres strictly to the principle of least privilege. Every requested permission is essential for its core features:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.04] text-zinc-300">
                    <th className="p-3.5 font-semibold">Permission</th>
                    <th className="p-3.5 font-semibold">Purpose &amp; Technical Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-zinc-400">
                  <tr>
                    <td className="p-3.5 font-mono text-indigo-400 font-semibold">storage</td>
                    <td className="p-3.5">
                      Saves your extracted reel notes, taxonomy trees, and custom prompt preferences locally in <code className="text-zinc-300 font-mono">chrome.storage.local</code>.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-indigo-400 font-semibold">unlimitedStorage</td>
                    <td className="p-3.5">
                      Prevents quota limit errors so users can maintain a long-term knowledge vault containing hundreds of notes and playbooks without losing data.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-indigo-400 font-semibold">activeTab &amp; tabs</td>
                    <td className="p-3.5">
                      Detects the active Instagram reel URL, verifies connection to your open Meta AI tab, and coordinates batch transitions.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-indigo-400 font-semibold">scripting</td>
                    <td className="p-3.5">
                      Facilitates secure content script communication between the extension and the active Instagram / Meta AI tabs.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-indigo-400 font-semibold">sidePanel</td>
                    <td className="p-3.5">
                      Displays the Reel Analyzer controller and live note feed inside Chrome&apos;s native Side Panel for seamless multitasking.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-indigo-400 font-semibold">Host Permissions</td>
                    <td className="p-3.5">
                      Scoped strictly to <code className="text-zinc-300 font-mono">*://*.instagram.com/*</code> (for caption extraction), <code className="text-zinc-300 font-mono">*://*.meta.ai/*</code> (for AI synthesis), and <code className="text-zinc-300 font-mono">https://reelanalyzer.manikanta.co.in/*</code> (for local vault syncing).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">5.</span> Data Storage, Transmission &amp; Third-Party AI
            </h2>
            <p>
              <strong>Zero Chrome Extension Telemetry:</strong> The Reel Analyzer Chrome Extension operates 100% locally. It contains no tracking scripts, ad networks, or background telemetry. Your summaries and taxonomy never leave your machine to any database owned by us.
            </p>
            <p>
              <strong>Third-Party AI Services:</strong> When you generate notes, prompts are submitted directly inside your personal, authenticated web session on <a href="https://www.meta.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Meta AI</a>. Your interaction with Meta AI is governed by Meta&apos;s Privacy Policy and Terms of Service. Reel Analyzer does not act as an AI proxy or middleman.
            </p>
            <p>
              <strong>Website Analytics (Web Dashboard Only):</strong> When visiting the companion web app at <code className="text-zinc-300 font-mono">reelanalyzer.manikanta.co.in</code>, aggregate page views and unique visitor counters are calculated using a privacy-preserving, one-way cryptographic hash (<code className="text-zinc-300 font-mono">SHA-256(IP + UserAgent)</code>). <strong>Raw IP addresses are never stored in the database.</strong> If you voluntarily submit a message via the feedback form, only the message text and any optional email you supply are stored to assist with product development.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">6.</span> Data Portability, Retention &amp; Permanent Deletion
            </h2>
            <p>
              You maintain 100% ownership and control over all knowledge generated through Reel Analyzer:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 text-xs sm:text-sm pl-2">
              <li>
                <strong>Obsidian Vault Export (.zip):</strong> Download an offline-ready ZIP archive containing your structured <code className="text-zinc-300 font-mono">Domain/Subdomain.md</code> playbooks with internal tables of contents and a wiki-linked <code className="text-zinc-300 font-mono">00_Master_Index.md</code>.
              </li>
              <li>
                <strong>Markdown Playbook (.md):</strong> Export formatted markdown playbooks by domain/category directly from the web dashboard.
              </li>
              <li>
                <strong>Immediate Permanent Deletion:</strong> You can purge all saved notes, taxonomy, and settings instantly by clicking the <strong>&ldquo;Clear All&rdquo;</strong> button in the extension popup, or by uninstalling the extension from Chrome.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">7.</span> Chrome Web Store Limited Use Compliance
            </h2>
            <p>
              Reel Analyzer adheres strictly to the <strong>Google Chrome Web Store Developer Program Policies</strong>, including the <strong>Limited Use Policy</strong>:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Developer Policy Guarantees</span>
              </div>
              <p>&bull; We do not sell, rent, monetize, or transfer user data to third parties, data brokers, or advertising networks.</p>
              <p>&bull; We do not use or transfer user data for serving personalized ads, retargeting, or credit assessment.</p>
              <p>&bull; We do not use user data to train generalized artificial intelligence or machine learning models.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">8.</span> Children&apos;s Privacy
            </h2>
            <p>
              Reel Analyzer is not intended for use by children under the age of 13. We do not knowingly collect or solicit any personal information from children.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">9.</span> Updates to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect new features, version improvements, or regulatory updates. Any changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 border-t border-white/[0.08] pt-8">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">10.</span> Contact &amp; Developer Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              If you have any questions, feedback, or data privacy inquiries regarding Reel Analyzer, please reach out via our official developer channels:
            </p>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs space-y-2 text-zinc-300">
              <p>
                <strong>Developer:</strong> Manikanta Sandula
              </p>
              <p>
                <strong>Portfolio:</strong>{' '}
                <a
                  href="https://manikanta.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  https://manikanta.co.in
                </a>
              </p>
              <p>
                <strong>Official Website:</strong>{' '}
                <a
                  href="https://reelanalyzer.manikanta.co.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  https://reelanalyzer.manikanta.co.in/
                </a>
              </p>
              <p>
                <strong>Email Contact:</strong>{' '}
                <a
                  href="mailto:manikantasandula1234@gmail.com"
                  className="text-indigo-400 hover:underline"
                >
                  manikantasandula1234@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
