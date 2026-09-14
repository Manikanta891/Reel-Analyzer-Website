'use client';

import React, { useState, useRef } from 'react';
import { Upload, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ReelItem } from '@/types';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportReels: (reels: ReelItem[]) => void;
  onResetSample: () => void;
  onClearData: () => void;
  currentCount: number;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  onImportReels,
  onResetSample,
  onClearData,
  currentCount,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.endsWith('.json')) {
      setFeedback({ type: 'error', msg: 'Please select a valid JSON file (reelsData.json).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportReels(parsed);
          setFeedback({
            type: 'success',
            msg: `Successfully imported ${parsed.length} summarized reels!`,
          });
          setTimeout(() => {
            setFeedback(null);
            onClose();
          }, 1500);
        } else {
          setFeedback({ type: 'error', msg: 'JSON file does not contain a valid reels array.' });
        }
      } catch (err) {
        setFeedback({ type: 'error', msg: 'Failed to parse JSON file. Check file format.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-900 border border-white/[0.1] rounded-2xl p-6 sm:p-7 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Data Management
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Sync Reels Library
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-white/[0.06] transition-all duration-150 active:scale-[0.98]"
          >
            Close
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150 ${
            dragActive
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-white/[0.12] hover:border-white/[0.25] bg-zinc-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center border border-white/[0.06]">
            <Upload className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <p className="text-xs font-semibold text-white mb-1">
            Drop `reelsData.json` here or click to browse
          </p>
          <p className="text-[11px] text-zinc-400">
            Exported from Reel Analyzer Chrome Extension
          </p>
        </div>

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

        {/* Quick Action Buttons */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetSample();
              setFeedback({ type: 'success', msg: 'Loaded sample insights library.' });
              setTimeout(() => {
                setFeedback(null);
                onClose();
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
                  setFeedback(null);
                  onClose();
                }, 1200);
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 border border-red-500/20 transition-all duration-150 active:scale-[0.98]"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Clear Library ({currentCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
