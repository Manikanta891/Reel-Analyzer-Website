'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  Folder,
  LayoutGrid,
  Table,
  ArrowUpDown,
} from 'lucide-react';
import { ReelItem } from '@/types';
import {
  getStoredReels,
  saveStoredReels,
  subscribeToExtensionBridge,
} from '@/lib/storage';
import { INITIAL_SAMPLE_REELS } from '@/lib/sampleData';

import { Navbar } from '@/components/Navbar';
import { DomainSidebar } from '@/components/DomainSidebar';
import { ReelCard } from '@/components/ReelCard';
import { ReelTableView } from '@/components/ReelTableView';
import { SyncModal } from '@/components/SyncModal';
import { PlaybookExportModal } from '@/components/PlaybookExportModal';
import { ReelDetailModal } from '@/components/ReelDetailModal';
import { Pagination } from '@/components/Pagination';
import { SkeletonCard } from '@/components/SkeletonCard';

export default function VaultPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [feedViewMode, setFeedViewMode] = useState<'grid' | 'table'>('table'); // Table view as default
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'domain'>('default');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query for 60fps performance
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedSearchQuery('');
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 120);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Global Keyboard Shortcut: '/' or 'Ctrl+K' / 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        if (!['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [selectedReelForModal, setSelectedReelForModal] = useState<ReelItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isHydrating, setIsHydrating] = useState<boolean>(true);

  const [isSyncOpen, setIsSyncOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);
  const [isExtensionConnected, setIsExtensionConnected] = useState<boolean>(false);

  const PAGE_SIZE_GRID = 8;
  const PAGE_SIZE_TABLE = 12;
  const pageSize = feedViewMode === 'table' ? PAGE_SIZE_TABLE : PAGE_SIZE_GRID;

  // Initialize data and track analytics
  useEffect(() => {
    // 1. Read cached visitor count to prevent jump on refresh
    try {
      const cachedVisitors = localStorage.getItem('cached_unique_visitors');
      if (cachedVisitors) {
        const parsed = parseInt(cachedVisitors, 10);
        if (!isNaN(parsed)) setUniqueVisitors(parsed);
      }
    } catch {}

    // 2. Load cached reels from localStorage or sample
    const loaded = getStoredReels();
    setReels(loaded);
    setIsHydrating(false);

    // 3. Subscribe to Chrome Extension direct bridge
    const unsubscribe = subscribeToExtensionBridge(
      (extensionReels) => {
        setIsExtensionConnected(true);
        setReels(extensionReels);
        saveStoredReels(extensionReels);
      },
      () => {
        setIsExtensionConnected(true);
      }
    );

    // 4. Log unique visitor to MongoDB Atlas (non-blocking)
    fetch('/api/analytics/view', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.uniqueVisitors) {
          setUniqueVisitors(data.uniqueVisitors);
          try {
            localStorage.setItem('cached_unique_visitors', String(data.uniqueVisitors));
          } catch {}
        }
      })
      .catch((err) => console.log('Analytics logging fallback:', err));

    return () => unsubscribe();
  }, []);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDomain, selectedSubdomain, debouncedSearchQuery, feedViewMode, sortBy]);

  // Compute Categories, Subcategories, and Counts for Hierarchical Tree
  const {
    domains,
    domainCounts,
    subdomainMap,
    totalEntitiesCount,
    totalSubtopicsCount,
  } = useMemo(() => {
    const dCounts: { [d: string]: number } = {};
    const subMap: { [d: string]: { [s: string]: number } } = {};
    const entitySet = new Set<string>();
    const allSubtopicsSet = new Set<string>();

    reels.forEach((r) => {
      const d = r.domain || 'Uncategorized';
      const s = r.subdomain || 'General';

      dCounts[d] = (dCounts[d] || 0) + 1;

      if (!subMap[d]) subMap[d] = {};
      subMap[d][s] = (subMap[d][s] || 0) + 1;
      allSubtopicsSet.add(`${d}-${s}`);

      if (r.entities) {
        r.entities
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean)
          .forEach((ent) => entitySet.add(ent));
      }
    });

    const domainList = Object.keys(dCounts).sort();

    return {
      domains: domainList,
      domainCounts: dCounts,
      subdomainMap: subMap,
      totalEntitiesCount: entitySet.size,
      totalSubtopicsCount: allSubtopicsSet.size,
    };
  }, [reels]);

  // Levenshtein edit distance for typo-tolerant fuzzy matching
  const levenshtein = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const matchesTokenFuzzy = (fieldStr: string, token: string): boolean => {
    if (!fieldStr || !token) return false;
    const lowerField = fieldStr.toLowerCase();
    const lowerToken = token.toLowerCase();

    if (lowerField.includes(lowerToken)) return true;

    const words = lowerField.split(/[\s,./\-_|()#]+/);
    const maxDistance = lowerToken.length <= 3 ? 0 : lowerToken.length <= 6 ? 1 : 2;

    for (const w of words) {
      if (!w || w.length < 2) continue;
      if (w.startsWith(lowerToken) || lowerToken.startsWith(w)) return true;
      if (maxDistance > 0 && Math.abs(w.length - lowerToken.length) <= maxDistance) {
        if (levenshtein(w, lowerToken) <= maxDistance) return true;
      }
    }

    return false;
  };

  // Relevance scoring
  const calculateRelevanceScore = (r: ReelItem, query: string, tokens: string[]): number => {
    let score = 0;
    const lowerQuery = query.toLowerCase().trim();
    const subject = (r.subject || '').toLowerCase();
    const domain = (r.domain || '').toLowerCase();
    const subdomain = (r.subdomain || '').toLowerCase();
    const entities = (r.entities || '').toLowerCase();
    const tags = (r.tags || '').toLowerCase();
    const summary = (r.summary || '').toLowerCase();
    const utility = (r.personalUtility || '').toLowerCase();

    if (subject.includes(lowerQuery)) score += 100;
    if (domain.includes(lowerQuery) || subdomain.includes(lowerQuery)) score += 60;
    if (entities.includes(lowerQuery) || tags.includes(lowerQuery)) score += 50;

    for (const t of tokens) {
      if (subject.includes(t)) {
        score += 40;
      } else {
        const subWords = subject.split(/[\s,./\-_|()#]+/);
        for (const w of subWords) {
          if (w.length >= 3) {
            const dist = levenshtein(w, t);
            if (dist === 1) score += 25;
            else if (dist === 2 && t.length >= 6) score += 15;
          }
        }
      }

      if (entities.includes(t) || tags.includes(t)) {
        score += 30;
      } else {
        const entWords = (entities + ' ' + tags).split(/[\s,./\-_|()#]+/);
        for (const w of entWords) {
          if (w.length >= 3 && levenshtein(w, t) === 1) score += 18;
        }
      }

      if (domain.includes(t) || subdomain.includes(t)) {
        score += 20;
      }

      if (utility.includes(t) || summary.includes(t)) {
        score += 10;
      }
    }

    return score;
  };

  // Typo-tolerant multi-token Search & Filtering with Relevance Ranking (Debounced)
  const filteredReels = useMemo(() => {
    const rawTokens = debouncedSearchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    let result = reels.filter((r) => {
      const domainMatch = selectedDomain === 'All' || r.domain === selectedDomain;
      const subMatch = selectedSubdomain === 'All' || r.subdomain === selectedSubdomain;

      if (!domainMatch || !subMatch) return false;
      if (rawTokens.length === 0) return true;

      const searchableFields = [
        r.subject || '',
        r.domain || '',
        r.subdomain || '',
        r.personalUtility || '',
        r.entities || '',
        r.tags || '',
        r.summary || '',
        r.caption || '',
      ];

      return rawTokens.every((token) =>
        searchableFields.some((field) => matchesTokenFuzzy(field, token))
      );
    });

    if (rawTokens.length > 0) {
      result = result.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a, debouncedSearchQuery, rawTokens);
        const scoreB = calculateRelevanceScore(b, debouncedSearchQuery, rawTokens);
        return scoreB - scoreA;
      });
    } else {
      if (sortBy === 'title') {
        result = result.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
      } else if (sortBy === 'domain') {
        result = result.sort((a, b) => (a.domain || '').localeCompare(b.domain || ''));
      }
    }

    return result;
  }, [reels, selectedDomain, selectedSubdomain, debouncedSearchQuery, sortBy]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredReels.length / pageSize) || 1;
  const paginatedReels = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReels.slice(start, start + pageSize);
  }, [filteredReels, currentPage, pageSize]);

  // Handlers for Data Sync & Management
  const handleImportReels = (imported: ReelItem[]) => {
    const existingUrls = new Set(reels.map((r) => r.url.toLowerCase()));
    const existingSubjects = new Set(reels.map((r) => (r.subject || '').toLowerCase().trim()));
    const newItems = imported.filter(
      (r) => !existingUrls.has(r.url.toLowerCase()) && !existingSubjects.has((r.subject || '').toLowerCase().trim())
    );
    const merged = [...newItems, ...reels];
    setReels(merged);
    saveStoredReels(merged);
  };

  const handleDeleteReel = (reelToDelete: ReelItem) => {
    const updated = reels.filter((r) => r.url !== reelToDelete.url);
    setReels(updated);
    saveStoredReels(updated);
    if (selectedReelForModal && selectedReelForModal.url === reelToDelete.url) {
      setSelectedReelForModal(null);
    }
  };

  const handleResetSample = () => {
    setReels(INITIAL_SAMPLE_REELS);
    saveStoredReels(INITIAL_SAMPLE_REELS);
    setSelectedDomain('All');
    setSelectedSubdomain('All');
  };

  const handleClearData = () => {
    setReels([]);
    saveStoredReels([]);
    setSelectedDomain('All');
    setSelectedSubdomain('All');
  };

  const handleEntityClick = (entity: string) => {
    setSearchQuery(entity);
  };

  const hasActiveFilters = selectedDomain !== 'All' || selectedSubdomain !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        uniqueVisitors={uniqueVisitors}
        isExtensionConnected={isExtensionConnected}
        totalNotesCount={reels.length}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-6 min-h-[600px]">
          {/* Left Hierarchical Sidebar */}
          <DomainSidebar
            domains={domains}
            selectedDomain={selectedDomain}
            selectedSubdomain={selectedSubdomain}
            onSelectDomain={setSelectedDomain}
            onSelectSubdomain={setSelectedSubdomain}
            domainCounts={domainCounts}
            subdomainMap={subdomainMap}
            totalCount={reels.length}
          />

          {/* Main Knowledge Canvas */}
          <section className="flex-1 w-full min-w-0 flex flex-col justify-between min-h-[550px]">
            <div>
              {/* Unified Command & Search Bar */}
              <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-3 sm:p-4 mb-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                  {/* Search Input with Shortcut Badge */}
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      strokeWidth={1.5}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search knowledge notes, frameworks, concepts... (Press /)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 rounded-xl bg-[#0c0d12] border border-white/[0.06] focus:border-indigo-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-all shadow-inner"
                    />
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
                      >
                        Clear
                      </button>
                    ) : (
                      <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                        Ctrl+K
                      </kbd>
                    )}
                  </div>

                  {/* Right Toolbar Controls */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 flex-shrink-0">
                    {/* Sort Dropdown */}
                    <div className="relative flex-1 sm:flex-initial flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0c0d12] border border-white/[0.06] text-xs text-zinc-400 focus-within:border-indigo-500/50 transition-colors">
                      <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 pointer-events-none shrink-0" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full sm:w-auto bg-transparent text-zinc-300 outline-none cursor-pointer text-xs pr-1"
                      >
                        <option value="default" className="bg-[#111218] text-zinc-200">Relevance / Recent</option>
                        <option value="title" className="bg-[#111218] text-zinc-200">Sort by Title</option>
                        <option value="domain" className="bg-[#111218] text-zinc-200">Sort by Category</option>
                      </select>
                    </div>

                    {/* Grid vs Table View Mode Toggle */}
                    <div className="flex items-center p-1 rounded-xl bg-[#0c0d12] border border-white/[0.06] shrink-0">
                      <button
                        onClick={() => setFeedViewMode('table')}
                        title="Table / List View"
                        aria-label="Table / List View"
                        className={`p-1.5 rounded-lg text-xs transition-all ${
                          feedViewMode === 'table'
                            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Table className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setFeedViewMode('grid')}
                        title="Grid View"
                        aria-label="Grid View"
                        className={`p-1.5 rounded-lg text-xs transition-all ${
                          feedViewMode === 'grid'
                            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filter Indicators Bar */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.04] text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-zinc-500">Showing:</span>
                    <span className="font-mono text-xs font-semibold text-zinc-200">
                      {filteredReels.length} {filteredReels.length === 1 ? 'note' : 'notes'}
                    </span>

                    {selectedDomain !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px]">
                        <span>{selectedDomain}</span>
                        {selectedSubdomain !== 'All' && <span>&gt; {selectedSubdomain}</span>}
                        <button
                          onClick={() => {
                            setSelectedDomain('All');
                            setSelectedSubdomain('All');
                          }}
                          className="hover:text-white ml-0.5"
                        >
                          &times;
                        </button>
                      </span>
                    )}

                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px]">
                        <span>&quot;{searchQuery}&quot;</span>
                        <button onClick={() => setSearchQuery('')} className="hover:text-white ml-0.5">
                          &times;
                        </button>
                      </span>
                    )}
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setSelectedDomain('All');
                        setSelectedSubdomain('All');
                        setSearchQuery('');
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Content Views */}
              {isHydrating ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : feedViewMode === 'table' ? (
                <ReelTableView
                  reels={paginatedReels}
                  onSelect={(reel) => setSelectedReelForModal(reel)}
                  onDelete={handleDeleteReel}
                />
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr">
                  {paginatedReels.map((item) => (
                    <ReelCard
                      key={item.url}
                      item={item}
                      onSelect={(reel) => setSelectedReelForModal(reel)}
                      onEntityClick={handleEntityClick}
                      onDelete={handleDeleteReel}
                    />
                  ))}
                </div>
              )}

              {/* Actionable Empty State */}
              {!isHydrating && filteredReels.length === 0 && (
                <div className="text-center py-20 px-6 bg-[#111218] rounded-2xl border border-white/[0.08] mt-4 shadow-xl">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#181924] text-zinc-400 flex items-center justify-center border border-white/[0.08]">
                    <Folder className="w-6 h-6 text-indigo-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-1">
                    No matching knowledge notes found
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-5">
                    {searchQuery
                      ? `No notes match "${searchQuery}". Try a different search term or reset filters.`
                      : 'No notes available in this category.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDomain('All');
                      setSelectedSubdomain('All');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {!isHydrating && filteredReels.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredReels.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Reader Modal (100% Preserved Markdown Rendering) */}
      <ReelDetailModal
        reel={selectedReelForModal}
        onClose={() => setSelectedReelForModal(null)}
        onEntityClick={handleEntityClick}
        onDelete={handleDeleteReel}
      />

      {/* Sync & Import Modal */}
      <SyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onImportReels={handleImportReels}
        onResetSample={handleResetSample}
        onClearData={handleClearData}
        currentCount={reels.length}
        existingReels={reels}
      />

      {/* Playbook Export Modal */}
      <PlaybookExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reels={reels}
        currentDomain={selectedDomain}
        currentSubdomain={selectedSubdomain}
        domains={domains}
      />

      {/* Minimal Footer with Option 4 Visitors Counter + Logo */}
      <footer className="border-t border-white/[0.06] py-6 bg-[#0b0c10] text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Reel Analyzer Studio</span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-[11px] text-zinc-500 font-mono">Personal Knowledge Vault</span>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-300 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] shadow-sm">
            <div className="w-4 h-4 rounded-md overflow-hidden shrink-0 border border-white/[0.1] bg-[#12131a] flex items-center justify-center">
              <Image
                src="/logos/icon-48.png"
                alt="Reel Analyzer"
                width={16}
                height={16}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            {uniqueVisitors !== null ? (
              <span>{uniqueVisitors.toLocaleString()} Website Visitors</span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-6 h-3 bg-white/10 rounded animate-pulse inline-block" />
                <span>Website Visitors</span>
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
