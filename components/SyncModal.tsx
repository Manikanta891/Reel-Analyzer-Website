'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FolderArchive,
  FileText,
  ShieldCheck,
  Wrench,
  Layers,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ReelItem } from '@/types';
import { parseMarkdownPlaybook, parseZipVault } from '@/lib/vaultParser';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportReels: (reels: ReelItem[]) => void;
  onResetSample: () => void;
  onClearData: () => void;
  currentCount: number;
  existingReels?: ReelItem[];
}

interface ParsedInspection {
  fileName: string;
  fileType: 'zip' | 'md' | 'folder';
  totalFound: number;
  newItems: ReelItem[];
  duplicateCount: number;
  domains: { name: string; count: number }[];
  subdomains: { name: string; domain: string; count: number }[];
  tools: string[];
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  onImportReels,
  onResetSample,
  onClearData,
  currentCount,
  existingReels = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inspection, setInspection] = useState<ParsedInspection | null>(null);
  const [showAllDomains, setShowAllDomains] = useState(false);
  const [showAllSubdomains, setShowAllSubdomains] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Esc key listener & Body scroll-lock
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResetState = () => {
    setInspection(null);
    setShowAllDomains(false);
    setShowAllSubdomains(false);
    setShowAllTools(false);
    setFeedback(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    handleResetState();
    onClose();
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setFeedback(null);

    try {
      const fileArray = Array.from(files);
      const isZip = fileArray.some((f) => f.name.toLowerCase().endsWith('.zip'));
      const hasInvalid = fileArray.some((f) => {
        const lower = f.name.toLowerCase();
        return !lower.endsWith('.zip') && !lower.endsWith('.md') && !lower.endsWith('.markdown');
      });

      if (hasInvalid) {
        setFeedback({
          type: 'error',
          msg: 'Invalid file format. Only Obsidian Vault (.zip) or Markdown Playbooks (.md) are supported.',
        });
        setIsProcessing(false);
        return;
      }

      let parsedReels: ReelItem[] = [];
      let sourceName = '';
      let sourceType: 'zip' | 'md' | 'folder' = 'md';

      if (isZip) {
        const zipFile = fileArray.find((f) => f.name.toLowerCase().endsWith('.zip'))!;
        sourceName = zipFile.name;
        sourceType = 'zip';
        const buffer = await zipFile.arrayBuffer();
        const res = await parseZipVault(buffer);
        parsedReels = res.reels;
      } else {
        if (fileArray.length > 1) {
          sourceName = `${fileArray.length} Markdown Playbooks`;
          sourceType = 'folder';
        } else {
          sourceName = fileArray[0].name;
          sourceType = 'md';
        }

        for (const file of fileArray) {
          const text = await file.text();
          // Infer domain / subdomain from file name if available
          const baseName = file.name.replace(/\.(md|markdown)$/i, '');
          const parts = baseName.split(/[_\-]/);
          const inferredDomain = parts[0] ? parts[0].trim() : 'General';
          const inferredSub = parts.length > 1 ? parts.slice(1).join(' ').trim() : 'General';

          const reelsInFile = parseMarkdownPlaybook(text, inferredDomain, inferredSub);
          parsedReels.push(...reelsInFile);
        }
      }

      if (parsedReels.length === 0) {
        setFeedback({
          type: 'error',
          msg: 'No valid reel summaries could be extracted. Ensure the file contains formatted headings or key takeaways.',
        });
        setIsProcessing(false);
        return;
      }

      // Compute duplicates vs new items against existing library
      const existingUrls = new Set(existingReels.map((r) => r.url.toLowerCase()));
      const existingSubjects = new Set(existingReels.map((r) => (r.subject || '').toLowerCase().trim()));

      const seenInBatch = new Set<string>();
      const newItems: ReelItem[] = [];
      let duplicateCount = 0;

      const domainCountMap: Record<string, number> = {};
      const subCountMap: Record<string, { count: number; domain: string }> = {};
      const toolSet = new Set<string>();

      parsedReels.forEach((r) => {
        const urlKey = r.url.toLowerCase();
        const subjectKey = (r.subject || '').toLowerCase().trim();

        if (existingUrls.has(urlKey) || existingSubjects.has(subjectKey) || seenInBatch.has(urlKey)) {
          duplicateCount++;
        } else {
          seenInBatch.add(urlKey);
          newItems.push(r);
        }

        const d = r.domain || 'General';
        const s = r.subdomain || 'General';
        domainCountMap[d] = (domainCountMap[d] || 0) + 1;

        const subKey = `${d} > ${s}`;
        if (!subCountMap[subKey]) {
          subCountMap[subKey] = { count: 0, domain: d };
        }
        subCountMap[subKey].count += 1;

        if (r.entities) {
          r.entities
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean)
            .forEach((ent) => toolSet.add(ent));
        }
      });

      const domainBreakdown = Object.entries(domainCountMap).map(([name, count]) => ({
        name,
        count,
      })).sort((a, b) => b.count - a.count);

      const subBreakdown = Object.entries(subCountMap).map(([fullKey, data]) => ({
        name: fullKey,
        domain: data.domain,
        count: data.count,
      })).sort((a, b) => b.count - a.count);

      setInspection({
        fileName: sourceName,
        fileType: sourceType,
        totalFound: parsedReels.length,
        newItems,
        duplicateCount,
        domains: domainBreakdown,
        subdomains: subBreakdown,
        tools: Array.from(toolSet),
      });
    } catch (err: any) {
      console.error('Vault parsing error:', err);
      setFeedback({
        type: 'error',
        msg: `Failed to process vault: ${err?.message || 'Unknown error. Check file integrity.'}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmMerge = () => {
    if (!inspection || inspection.newItems.length === 0) return;
    onImportReels(inspection.newItems);
    setFeedback({
      type: 'success',
      msg: `Successfully imported ${inspection.newItems.length} new insights into your vault!`,
    });
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-zinc-900 border border-white/[0.1] rounded-2xl p-6 sm:p-7 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-400">
              Knowledge Management
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {inspection ? 'Vault Import Inspection' : 'Sync & Import Reels Vault'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
          >
            Close
          </button>
        </div>

        {/* STEP 1: Upload / Drag-and-Drop Area */}
        {!inspection && (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                processFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-7 text-center cursor-pointer transition-all duration-150 relative ${
                dragActive
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-white/[0.12] hover:border-white/[0.25] bg-zinc-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.md,.markdown"
                multiple
                className="hidden"
                onChange={(e) => processFiles(e.target.files)}
              />

              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center border border-white/[0.06]">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 text-brand-400 animate-spin" strokeWidth={1.5} />
                ) : (
                  <Upload className="w-6 h-6 text-brand-400" strokeWidth={1.5} />
                )}
              </div>

              <p className="text-sm font-semibold text-white mb-1">
                {isProcessing ? 'Analyzing & Sanitizing Vault...' : 'Drop Obsidian Vault (.zip) or Playbooks (.md)'}
              </p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Upload your previous extracted reels, Obsidian knowledge vault, or markdown files.
              </p>

              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-[11px] font-mono text-zinc-400">
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/[0.06] flex items-center gap-1">
                  <FolderArchive className="w-3 h-3 text-brand-400" /> .zip (Vault)
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/[0.06] flex items-center gap-1">
                  <FileText className="w-3 h-3 text-brand-400" /> .md (Playbook)
                </span>
              </div>
            </div>

            {/* Alternative: Folder selection */}
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 px-1">
              <span className="text-[11px] text-zinc-500">Have a folder of markdown files?</span>
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="text-brand-400 hover:text-brand-300 font-medium hover:underline text-[11px]"
              >
                Upload Folder
              </button>
              <input
                ref={folderInputRef}
                type="file"
                // @ts-ignore
                webkitdirectory="true"
                // @ts-ignore
                directory="true"
                multiple
                className="hidden"
                onChange={(e) => processFiles(e.target.files)}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Inspection & Verification Preview */}
        {inspection && (
          <div className="space-y-4">
            {/* Safe Verification Badge */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                <span>Security & Format Verified</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[200px]">
                {inspection.fileName}
              </span>
            </div>

            {/* Statistics Metric Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.06] text-center">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Total Found</span>
                <p className="text-xl font-bold font-mono text-white mt-0.5">
                  {inspection.totalFound}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-400">New to Add</span>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  +{inspection.newItems.length}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.06] text-center">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Duplicates</span>
                <p className="text-xl font-bold font-mono text-zinc-400 mt-0.5">
                  {inspection.duplicateCount}
                </p>
              </div>
            </div>

            {/* Domains Breakdown with +X More */}
            {inspection.domains.length > 0 && (
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06] space-y-2.5">
                <div>
                  <div className="flex items-center justify-between gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.5} />
                      <span>Domains Discovered ({inspection.domains.length})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(showAllDomains ? inspection.domains : inspection.domains.slice(0, 4)).map((d) => (
                      <span
                        key={d.name}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/[0.06] flex items-center gap-1"
                      >
                        <span>{d.name}</span>
                        <span className="font-mono text-brand-400 text-[10px]">({d.count})</span>
                      </span>
                    ))}
                    {!showAllDomains && inspection.domains.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowAllDomains(true)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition-colors"
                      >
                        +{inspection.domains.length - 4} more
                      </button>
                    )}
                    {showAllDomains && inspection.domains.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowAllDomains(false)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                </div>

                {/* Subdomains Breakdown with +X More */}
                {inspection.subdomains && inspection.subdomains.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.04]">
                    <div className="text-[11px] font-medium text-zinc-400 mb-1.5">
                      Subtopics / Playbooks ({inspection.subdomains.length})
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(showAllSubdomains ? inspection.subdomains : inspection.subdomains.slice(0, 4)).map((s) => (
                        <span
                          key={s.name}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/[0.04] flex items-center gap-1"
                        >
                          <span>{s.name}</span>
                          <span className="text-zinc-500">({s.count})</span>
                        </span>
                      ))}
                      {!showAllSubdomains && inspection.subdomains.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setShowAllSubdomains(true)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition-colors"
                        >
                          +{inspection.subdomains.length - 4} more
                        </button>
                      )}
                      {showAllSubdomains && inspection.subdomains.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setShowAllSubdomains(false)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tools Discovered with +X More */}
            {inspection.tools.length > 0 && (
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                  <Wrench className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.5} />
                  <span>Tools & Frameworks ({inspection.tools.length})</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap font-mono text-[10px] text-zinc-400">
                  {(showAllTools ? inspection.tools : inspection.tools.slice(0, 6)).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-zinc-800/80 border border-white/[0.04]">
                      {t}
                    </span>
                  ))}
                  {!showAllTools && inspection.tools.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllTools(true)}
                      className="px-2 py-0.5 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition-colors"
                    >
                      +{inspection.tools.length - 6} more
                    </button>
                  )}
                  {showAllTools && inspection.tools.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllTools(false)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* User Confirmation Callout */}
            <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
              {inspection.newItems.length > 0 ? (
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-400" />
                  <span>
                    Do you wish to import and merge these <strong>{inspection.newItems.length}</strong> new insight(s) into your existing library?
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <span>All insights in this vault are already present in your library. No new items to merge.</span>
                </div>
              )}
            </div>

            {/* Inspection Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetState}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-white/[0.06] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Choose Different File</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmMerge}
                disabled={inspection.newItems.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all duration-150 ${
                  inspection.newItems.length > 0
                    ? 'bg-brand-600 hover:bg-brand-500 text-white active:scale-[0.98]'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.04]'
                }`}
              >
                <span>Confirm & Import ({inspection.newItems.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Quick Action Buttons (Sample & Clear) */}
        {!inspection && (
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                onResetSample();
                setFeedback({ type: 'success', msg: 'Loaded sample insights library.' });
                setTimeout(() => {
                  handleClose();
                }, 1200);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
              <span>Load Sample Data</span>
            </button>

            <button
              onClick={() => {
                const warningMsg =
                  `⚠️ WARNING: Permanent Data Deletion\n\n` +
                  `This will permanently delete all ${currentCount} stored insight(s) and your knowledge taxonomy from this browser.\n\n` +
                  `• This action CANNOT be undone.\n` +
                  `• If you want to keep your notes, please download your Obsidian Vault (.zip) before deleting.\n\n` +
                  `Are you sure you want to delete everything?`;

                if (confirm(warningMsg)) {
                  onClearData();
                  setFeedback({ type: 'success', msg: 'Cleared all stored insights.' });
                  setTimeout(() => {
                    handleClose();
                  }, 1200);
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 border border-red-500/20 transition-all duration-150 active:scale-[0.98]"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Clear Library ({currentCount})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
