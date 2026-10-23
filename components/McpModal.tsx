'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Sparkles,
  Cpu,
  FolderOpen,
} from 'lucide-react';
import { ReelItem } from '@/types';

interface McpModalProps {
  isOpen: boolean;
  onClose: () => void;
  reels: ReelItem[];
}

// Suggested folder where the user places both downloaded files.
// Shown in IDE config snippets so paths are immediately usable.
const WIN_DIR  = 'C:\\Users\\YourName\\reel-vault';
const MAC_DIR  = '~/reel-vault';

export const McpModal: React.FC<McpModalProps> = ({ isOpen, onClose, reels }) => {
  const [activeTab, setActiveTab] = useState<'cursor' | 'claude' | 'antigravity'>('cursor');
  const [copied, setCopied] = useState<string | null>(null);
  const [downloadDone, setDownloadDone] = useState(false);

  if (!isOpen) return null;

  /* ── helpers ─────────────────────────────────────────────── */

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const triggerDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Downloads vault.json — the user's reel data snapshot
  const downloadVaultJson = () => {
    triggerDownload(JSON.stringify(reels, null, 2), 'vault.json', 'application/json');
  };

  // Downloads mcp-server.mjs — the local MCP server the IDE will run
  const downloadServerScript = async () => {
    try {
      const res = await fetch('/api/mcp-server-script');
      if (!res.ok) throw new Error('not ok');
      const code = await res.text();
      triggerDownload(code, 'mcp-server.mjs', 'application/javascript');
    } catch {
      // Fallback: open GitHub raw file in new tab
      window.open(
        'https://github.com/Manikanta891/Reel-Analyzer-Website/blob/main/scripts/mcp-server.mjs',
        '_blank',
      );
    }
  };

  // One-click: download both files, then mark step 1 done
  const handleDownloadAll = async () => {
    downloadVaultJson();
    await new Promise(r => setTimeout(r, 500));
    await downloadServerScript();
    setDownloadDone(true);
  };

  /* ── IDE config snippets ─────────────────────────────────── */

  const cursorConfig = `{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": ["${WIN_DIR}\\\\mcp-server.mjs"],
      "env": {
        "VAULT_PATH": "${WIN_DIR}\\\\vault.json"
      }
    }
  }
}`;

  const claudeConfig = `{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": ["${WIN_DIR}\\\\mcp-server.mjs"],
      "env": {
        "VAULT_PATH": "${WIN_DIR}\\\\vault.json"
      }
    }
  }
}`;

  const antigravityConfig = `{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": ["${MAC_DIR}/mcp-server.mjs"],
      "env": {
        "VAULT_PATH": "${MAC_DIR}/vault.json"
      }
    }
  }
}`;

  const activeConfig =
    activeTab === 'cursor' ? cursorConfig :
    activeTab === 'claude' ? claudeConfig :
    antigravityConfig;

  const configHint =
    activeTab === 'cursor'      ? 'Paste into  .cursor/mcp.json' :
    activeTab === 'claude'      ? 'Paste into  %APPDATA%/Claude/claude_desktop_config.json' :
                                  'Paste into  agent MCP settings';

  /* ── render ──────────────────────────────────────────────── */

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Connect AI Coding Agents via MCP"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0e1017] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-[#12141d]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
              <Cpu className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-100 tracking-tight">
                  Connect Coding Agents (MCP)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Model Context Protocol
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Let Cursor, Claude Code, or Antigravity query your{' '}
                <strong className="text-indigo-300">{reels.length} saved reel notes</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 custom-scrollbar">

          {/* STEP 1 ── Download both files */}
          <div className={`p-4 rounded-2xl border transition-colors ${downloadDone ? 'bg-emerald-950/30 border-emerald-500/20' : 'bg-[#141622] border-white/[0.08]'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${downloadDone ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                {downloadDone ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <span className="text-xs font-bold text-zinc-200">Download Both Files</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3 max-w-lg">
              You need <strong className="text-zinc-200">2 files</strong> on your machine:{' '}
              <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">vault.json</code> (your reel data) and{' '}
              <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">mcp-server.mjs</code> (the local server your IDE runs).{' '}
              Save them together in one folder, e.g.{' '}
              <code className="text-zinc-300 bg-zinc-800/60 px-1 rounded">C:\Users\YourName\reel-vault\</code>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Both Files</span>
              </button>
              <button
                onClick={downloadVaultJson}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-all active:scale-95"
              >
                vault.json only
              </button>
              <button
                onClick={downloadServerScript}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-all active:scale-95"
              >
                mcp-server.mjs only
              </button>
            </div>
            {downloadDone && (
              <p className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Both files downloaded! Move them to the same folder before Step 2.
              </p>
            )}
          </div>

          {/* STEP 2 ── Place files & update path */}
          <div className="p-4 rounded-2xl bg-[#141622] border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
              <span className="text-xs font-bold text-zinc-200">Place Files & Update the Path</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed max-w-lg">
              Move both downloaded files into one folder on your machine.
              Then replace <code className="text-amber-300 bg-amber-500/10 px-1 rounded">YourName</code> in the config below with your actual Windows username (or the full path you chose).
            </p>
          </div>

          {/* STEP 3 ── Add IDE Config */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
              <span className="text-xs font-bold text-zinc-200">Add MCP Config to Your IDE</span>
            </div>

            {/* IDE Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#12141d] border border-white/[0.06] mb-3">
              {(['cursor', 'claude', 'antigravity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-xs transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab === 'cursor' ? 'Cursor IDE' : tab === 'claude' ? 'Claude Desktop' : 'Antigravity / VS Code'}
                </button>
              ))}
            </div>

            {/* Config Code Block */}
            <div className="relative rounded-2xl bg-[#090a0f] border border-white/[0.08] p-4 font-mono text-[11px] text-zinc-300">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/[0.06] text-zinc-500 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3 h-3" />
                  {configHint}
                </span>
                <button
                  onClick={() => handleCopy(activeConfig, 'config')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copied === 'config' ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /><span>Copy Config</span></>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto text-indigo-200/90 leading-relaxed whitespace-pre-wrap">
                {activeConfig}
              </pre>
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">
              After saving the config, restart your IDE — it will spawn the MCP server automatically.
            </p>
          </div>

          {/* STEP 4 ── Try example prompts */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">4</span>
              <span className="text-xs font-bold text-zinc-200">Ask Your Agent While You Code</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">Once connected, try these in your IDE chat:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Search my reel vault for Docker rollouts',
                'Generate a cheat sheet of all Tailwind CSS tricks',
                'What are the latest 5 reels I saved?',
                'Review my current code against my vault rules',
              ].map((query, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-[#12141e] border border-white/[0.06] flex items-center justify-between gap-2 text-[11px] text-zinc-300"
                >
                  <span className="truncate">&quot;{query}&quot;</span>
                  <button
                    onClick={() => handleCopy(query, `prompt-${i}`)}
                    className="text-zinc-500 hover:text-indigo-400 shrink-0"
                    title="Copy prompt"
                  >
                    {copied === `prompt-${i}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#12141d]/60 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            100% local — your data never leaves your machine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1c1d29] hover:bg-[#252737] text-xs font-medium text-zinc-200 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
