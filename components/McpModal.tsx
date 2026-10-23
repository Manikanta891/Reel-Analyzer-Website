'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  Sparkles,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ReelItem } from '@/types';

interface McpModalProps {
  isOpen: boolean;
  onClose: () => void;
  reels: ReelItem[];
}

export const McpModal: React.FC<McpModalProps> = ({
  isOpen,
  onClose,
  reels,
}) => {
  const [activeTab, setActiveTab] = useState<'cursor' | 'claude' | 'antigravity'>('cursor');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1-Click Vault JSON Exporter for MCP
  const handleDownloadVaultJson = () => {
    const dataStr = JSON.stringify(reels, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vault.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 1-Click MCP Server Runner Script Downloader
  const handleDownloadServerScript = async () => {
    try {
      const res = await fetch('/scripts/mcp-server.mjs');
      let code = '';
      if (res.ok) {
        code = await res.text();
      } else {
        // Fallback fetch from api or bundled string
        const apiRes = await fetch('/api/vault/sync');
        code = `// Reel Analyzer MCP Runner\nconsole.log("Connect to your reel knowledge vault");`;
      }
      const blob = new Blob([code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mcp-server.mjs';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      handleDownloadVaultJson();
    }
  };

  const cursorConfig = `{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": [
        "${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/mcp-server.mjs"
      ]
    }
  }
}`;

  const claudeConfig = `{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": ["C:/path/to/mcp-server.mjs"]
    }
  }
}`;

  const antigravityConfig = `{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": ["scripts/mcp-server.mjs"]
    }
  }
}`;

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
        {/* Modal Header */}
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
                Allow Cursor, Claude Code, or Antigravity to query your {reels.length} saved reel notes & code snippets.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 custom-scrollbar">
          {/* STEP 1: Knowledge Snapshot */}
          <div className="p-4 rounded-2xl bg-[#141622] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                <span className="text-xs font-bold text-zinc-200">
                  Get Your Knowledge Vault File
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed max-w-md">
                Your browser contains <strong className="text-indigo-300">{reels.length} curated reel insights</strong>. Download your JSON snapshot so your local coding agent can read it offline.
              </p>
            </div>
            <button
              onClick={handleDownloadVaultJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download vault.json</span>
            </button>
          </div>

          {/* STEP 2: Configure Your IDE */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span className="text-xs font-bold text-zinc-200">
                Add MCP Config to Your IDE
              </span>
            </div>

            {/* IDE Selector Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#12141d] border border-white/[0.06] mb-3">
              <button
                onClick={() => setActiveTab('cursor')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-xs transition-all ${
                  activeTab === 'cursor'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cursor IDE
              </button>
              <button
                onClick={() => setActiveTab('claude')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-xs transition-all ${
                  activeTab === 'claude'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Claude Desktop
              </button>
              <button
                onClick={() => setActiveTab('antigravity')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-xs transition-all ${
                  activeTab === 'antigravity'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Antigravity / VS Code
              </button>
            </div>

            {/* Config Code Box */}
            <div className="relative rounded-2xl bg-[#090a0f] border border-white/[0.08] p-4 font-mono text-[11px] text-zinc-300">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/[0.06] text-zinc-500 text-[10px]">
                <span>
                  {activeTab === 'cursor'
                    ? 'Paste into .cursor/mcp.json'
                    : activeTab === 'claude'
                    ? 'Paste into %APPDATA%/Claude/claude_desktop_config.json'
                    : 'Paste into agent mcp settings'}
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      activeTab === 'cursor'
                        ? cursorConfig
                        : activeTab === 'claude'
                        ? claudeConfig
                        : antigravityConfig,
                      'config'
                    )
                  }
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copied === 'config' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Config</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto text-indigo-200/90 leading-relaxed">
                {activeTab === 'cursor'
                  ? cursorConfig
                  : activeTab === 'claude'
                  ? claudeConfig
                  : antigravityConfig}
              </pre>
            </div>
          </div>

          {/* STEP 3: What Your Agent Can Ask */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span className="text-xs font-bold text-zinc-200">
                Ask Your Agent While You Code
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Once connected, simply ask your coding agent in chat:
            </p>
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

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#12141d]/60 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Powered by standard JSON-RPC Stdio Protocol
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
