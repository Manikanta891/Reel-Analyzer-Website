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
  CheckCircle2,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { ReelItem } from '@/types';

interface McpModalProps {
  isOpen: boolean;
  onClose: () => void;
  reels: ReelItem[];
}

// Whether the browser supports the File System Access API
// (Chrome 86+, Edge 86+ — covers ~95% of developers)
const supportsFilePicker =
  typeof window !== 'undefined' && 'showDirectoryPicker' in window;

type SetupState =
  | 'idle'          // Nothing done yet
  | 'picking'       // Folder picker is open
  | 'writing'       // Writing files to disk
  | 'done'          // Files written successfully
  | 'error'         // Something went wrong
  | 'manual';       // User chose manual path input fallback

export const McpModal: React.FC<McpModalProps> = ({ isOpen, onClose, reels }) => {
  const [activeTab, setActiveTab]   = useState<'cursor' | 'claude' | 'antigravity'>('cursor');
  const [copied, setCopied]         = useState<string | null>(null);
  const [setupState, setSetupState] = useState<SetupState>('idle');
  const [chosenPath, setChosenPath] = useState('');   // Actual path user picked / typed
  const [manualPath, setManualPath] = useState('');   // Text input for manual fallback
  const [errorMsg, setErrorMsg]     = useState('');

  /* ─────────────────────────────────────────────
     Helpers (Strictly standard functions, NO hooks after early returns)
  ───────────────────────────────────────────── */

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const fetchServerScript = async (): Promise<string> => {
    const res = await fetch('/api/mcp-server-script');
    if (!res.ok) throw new Error('Could not fetch mcp-server.mjs');
    return res.text();
  };

  /* ─────────────────────────────────────────────
     File System Access API flow (Chrome/Edge)
     User picks a folder → we write both files
     directly → we know the exact path
  ───────────────────────────────────────────── */

  const handlePickFolder = async () => {
    setSetupState('picking');
    setErrorMsg('');
    try {
      // Open the native OS folder picker
      // @ts-expect-error — showDirectoryPicker is not yet in TS lib types
      const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });

      setSetupState('writing');

      // ── Write vault.json ──────────────────────
      const vaultHandle = await dirHandle.getFileHandle('vault.json', { create: true });
      const vaultWriter = await vaultHandle.createWritable();
      await vaultWriter.write(JSON.stringify(reels, null, 2));
      await vaultWriter.close();

      // ── Write mcp-server.mjs ──────────────────
      const serverCode   = await fetchServerScript();
      const serverHandle = await dirHandle.getFileHandle('mcp-server.mjs', { create: true });
      const serverWriter = await serverHandle.createWritable();
      await serverWriter.write(serverCode);
      await serverWriter.close();

      // ── Derive path hint from folder name ─────
      const folderName: string = dirHandle.name;
      const guessedPath = `C:\\Users\\<YourName>\\${folderName}`;
      setChosenPath(guessedPath);
      setSetupState('done');
    } catch (err: unknown) {
      // User cancelled the picker → go back to idle quietly
      if (err instanceof DOMException && err.name === 'AbortError') {
        setSetupState('idle');
        return;
      }
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setSetupState('error');
    }
  };

  /* ─────────────────────────────────────────────
     Fallback — manual downloads + path input
  ───────────────────────────────────────────── */

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

  const handleManualDownloadAll = async () => {
    triggerDownload(JSON.stringify(reels, null, 2), 'vault.json', 'application/json');
    await new Promise(r => setTimeout(r, 500));
    try {
      const code = await fetchServerScript();
      triggerDownload(code, 'mcp-server.mjs', 'application/javascript');
    } catch {
      window.open(
        'https://github.com/Manikanta891/Reel-Analyzer-Website/blob/main/scripts/mcp-server.mjs',
        '_blank',
      );
    }
    setSetupState('manual');
  };

  /* ─────────────────────────────────────────────
     IDE config generation
     Uses the confirmed path (from picker or manual input)
  ───────────────────────────────────────────── */

  // The effective path: from picker (done state) or manual input
  const effectivePath = setupState === 'done'
    ? chosenPath
    : manualPath || 'C:\\Users\\YourName\\reel-vault';

  // Normalise separators based on active tab
  const pathForConfig = activeTab === 'antigravity'
    ? effectivePath.replace(/\\/g, '/')
    : effectivePath;

  const sep = activeTab === 'antigravity' ? '/' : '\\\\';

  const configJson = `{
  "mcpServers": {
    "reel-vault": {
      "command": "node",
      "args": ["${pathForConfig}${sep}mcp-server.mjs"],
      "env": {
        "VAULT_PATH": "${pathForConfig}${sep}vault.json"
      }
    }
  }
}`;

  const configHint =
    activeTab === 'cursor'      ? '.cursor/mcp.json' :
    activeTab === 'claude'      ? '%APPDATA%/Claude/claude_desktop_config.json' :
                                  'Antigravity MCP settings';

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */

  if (!isOpen) return null;

  const pathIsPlaceholder = !chosenPath && !manualPath;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Connect AI Coding Agents via MCP"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0e1017] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-[#12141d]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 custom-scrollbar">

          {/* ── STEP 1: Save Files ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${setupState === 'done' ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                {setupState === 'done' ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <span className="text-xs font-bold text-zinc-200">Save Files to Your Machine</span>
            </div>

            {/* Primary: File System Picker */}
            {supportsFilePicker && setupState !== 'manual' && (
              <div className={`p-4 rounded-2xl border transition-all mb-3 ${
                setupState === 'done'
                  ? 'bg-emerald-950/30 border-emerald-500/25'
                  : 'bg-[#141622] border-white/[0.08]'
              }`}>
                {setupState === 'idle' || setupState === 'picking' || setupState === 'writing' || setupState === 'error' ? (
                  <>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                      <strong className="text-zinc-200">Recommended:</strong> Pick a folder on your machine — we write{' '}
                      <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">vault.json</code> and{' '}
                      <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">mcp-server.mjs</code> directly into it.
                      Your IDE config is then generated with the exact correct path automatically.
                    </p>
                    <button
                      onClick={handlePickFolder}
                      disabled={setupState === 'picking' || setupState === 'writing'}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      {setupState === 'picking'
                        ? 'Opening folder picker…'
                        : setupState === 'writing'
                        ? 'Writing files…'
                        : 'Choose Folder & Save Files'}
                    </button>
                    {setupState === 'error' && (
                      <p className="mt-2 text-[11px] text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errorMsg || 'Something went wrong. Try the manual download below.'}
                      </p>
                    )}
                  </>
                ) : (
                  /* Done state */
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      Both files saved! Now confirm the exact folder path below.
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Browser security doesn&apos;t expose the full path — please type or confirm it:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chosenPath}
                        onChange={(e) => setChosenPath(e.target.value)}
                        placeholder="e.g. C:\Users\Manik\reel-vault"
                        className="flex-1 bg-[#090a0f] border border-white/[0.12] rounded-xl px-3 py-2 text-[11px] text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                        spellCheck={false}
                      />
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-zinc-600">
                      The config below updates live as you type ↑
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            {supportsFilePicker && setupState !== 'done' && (
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] text-zinc-600 font-medium">or download manually</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
            )}

            {/* Fallback: Manual download + path input */}
            {(setupState !== 'done') && (
              <div className={`p-4 rounded-2xl border transition-all ${
                setupState === 'manual' ? 'bg-[#141622] border-white/[0.08]' : 'border-white/[0.05] bg-transparent'
              }`}>
                <p className="text-[11px] text-zinc-500 mb-3">
                  Download both files to <strong className="text-zinc-400">Downloads</strong>, then move them to a folder of your choice.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={handleManualDownloadAll}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Both Files
                  </button>
                </div>
                {(setupState === 'manual') && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-400">
                      Where did you put the files? Type the full folder path:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={manualPath}
                        onChange={(e) => setManualPath(e.target.value)}
                        placeholder="e.g. C:\Users\Manik\reel-vault"
                        className="flex-1 bg-[#090a0f] border border-white/[0.12] rounded-xl px-3 py-2 text-[11px] text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                        spellCheck={false}
                      />
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-zinc-600">Config below updates live as you type ↑</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── STEP 2: IDE Config ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
              <span className="text-xs font-bold text-zinc-200">Add Config to Your IDE</span>
            </div>

            {/* IDE Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#12141d] border border-white/[0.06] mb-3">
              {(['cursor', 'claude', 'antigravity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-xs transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab === 'cursor' ? 'Cursor IDE' : tab === 'claude' ? 'Claude Desktop' : 'Antigravity'}
                </button>
              ))}
            </div>

            {/* Config block */}
            <div className="relative rounded-2xl bg-[#090a0f] border border-white/[0.08] p-4 font-mono text-[11px] text-zinc-300">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/[0.06] text-zinc-500 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3 h-3" />
                  Paste into: <strong className="text-zinc-400 ml-1">{configHint}</strong>
                </span>
                <button
                  onClick={() => handleCopy(configJson, 'config')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copied === 'config' ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
                  )}
                </button>
              </div>

              {/* Live path highlight */}
              {pathIsPlaceholder && (
                <div className="mb-2 px-2 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Complete Step 1 first — the path below will auto-fill with your real folder.
                </div>
              )}

              <pre className="overflow-x-auto text-indigo-200/90 leading-relaxed whitespace-pre-wrap">
                {configJson}
              </pre>
            </div>

            <p className="mt-2 text-[11px] text-zinc-500">
              After saving the config, <strong className="text-zinc-400">restart your IDE</strong> — it will spawn the MCP server automatically.
            </p>
          </div>

          {/* ── STEP 3: Try prompts ── */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
              <span className="text-xs font-bold text-zinc-200">Ask Your Agent While You Code</span>
            </div>
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
                    {copied === `prompt-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#12141d]/60 flex items-center justify-between shrink-0">
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
