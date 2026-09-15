'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Folder, LayoutGrid, Table, X, Users } from 'lucide-react';
import { ReelItem, ViewMode } from '@/types';
import {
  getStoredReels,
  saveStoredReels,
  subscribeToExtensionBridge,
} from '@/lib/storage';
import { INITIAL_SAMPLE_REELS } from '@/lib/sampleData';

import { Navbar } from '@/components/Navbar';
import { StatsCounter } from '@/components/StatsCounter';
import { DomainSidebar } from '@/components/DomainSidebar';
import { SubdomainPills } from '@/components/SubdomainPills';
import { ReelCard } from '@/components/ReelCard';
import { ReelTableView } from '@/components/ReelTableView';
import { FlashcardViewer } from '@/components/FlashcardViewer';
import { SyncModal } from '@/components/SyncModal';
import { PlaybookExportModal } from '@/components/PlaybookExportModal';
import { ReelDetailModal } from '@/components/ReelDetailModal';
import { Pagination } from '@/components/Pagination';
import { SkeletonCard } from '@/components/SkeletonCard';
import { TopBannerAdSpot } from '@/components/ads/TopBannerAdSpot';
import { FeedAdSpot } from '@/components/ads/FeedAdSpot';

export default function VaultPage() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [feedViewMode, setFeedViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState<'reels' | 'flashcards'>('reels');

  // Debounce search query to guarantee 60fps performance on fuzzy Levenshtein calculations
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

  const [selectedReelForModal, setSelectedReelForModal] = useState<ReelItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isHydrating, setIsHydrating] = useState<boolean>(true);

  const [isSyncOpen, setIsSyncOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const [uniqueVisitors, setUniqueVisitors] = useState<number>(1420);
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);
  const [isExtensionConnected, setIsExtensionConnected] = useState<boolean>(false);

  const PAGE_SIZE_GRID = 6;
  const PAGE_SIZE_TABLE = 10;
  const pageSize = feedViewMode === 'table' ? PAGE_SIZE_TABLE : PAGE_SIZE_GRID;

  // Initialize data and track analytics
  useEffect(() => {
    // 1. Load cached reels from localStorage or sample
    const loaded = getStoredReels();
    setReels(loaded);
    setIsHydrating(false);

    // 2. Subscribe to Chrome Extension direct bridge
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

    // 3. Log unique visitor to MongoDB Atlas
    fetch('/api/analytics/view', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.uniqueVisitors) {
          setUniqueVisitors(data.uniqueVisitors);
          setIsMongoConnected(Boolean(data.connected));
        }
      })
      .catch((err) => console.log('Analytics logging fallback:', err));

    return () => unsubscribe();
  }, []);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDomain, selectedSubdomain, debouncedSearchQuery, feedViewMode, activeTab]);

  // Compute Categories, Subcategories, and Counts
  const {
    domains,
    domainCounts,
    subdomainsForDomain,
    subdomainCounts,
    totalEntitiesCount,
    totalSubtopicsCount,
  } = useMemo(() => {
    const dCounts: { [d: string]: number } = {};
    const subMap: { [d: string]: Set<string> } = {};
    const subCounts: { [s: string]: number } = {};
    const entitySet = new Set<string>();
    const allSubtopicsSet = new Set<string>();

    reels.forEach((r) => {
      const d = r.domain || 'Uncategorized';
      const s = r.subdomain || 'General';

      dCounts[d] = (dCounts[d] || 0) + 1;

      if (!subMap[d]) subMap[d] = new Set();
      subMap[d].add(s);
      allSubtopicsSet.add(`${d}-${s}`);

      if (selectedDomain === 'All' || r.domain === selectedDomain) {
        subCounts[s] = (subCounts[s] || 0) + 1;
      }

      if (r.entities) {
        r.entities
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean)
          .forEach((ent) => entitySet.add(ent));
      }
    });

    const domainList = Object.keys(dCounts).sort();
    const currentSubSet =
      selectedDomain === 'All'
        ? Array.from(new Set(reels.map((r) => r.subdomain || 'General'))).sort()
        : Array.from(subMap[selectedDomain] || []).sort();

    return {
      domains: domainList,
      domainCounts: dCounts,
      subdomainsForDomain: currentSubSet,
      subdomainCounts: subCounts,
      totalEntitiesCount: entitySet.size,
      totalSubtopicsCount: allSubtopicsSet.size,
    };
  }, [reels, selectedDomain]);

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

    // 1. Direct substring match
    if (lowerField.includes(lowerToken)) return true;

    // 2. Token / word-level typo-tolerant check
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

  // Relevance scoring to guarantee highest relevance (and closest typo matches) rank first
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

    // 1. Exact full phrase matches
    if (subject.includes(lowerQuery)) score += 100;
    if (domain.includes(lowerQuery) || subdomain.includes(lowerQuery)) score += 60;
    if (entities.includes(lowerQuery) || tags.includes(lowerQuery)) score += 50;

    // 2. Token-by-token scoring (exact match vs. close typo matches)
    for (const t of tokens) {
      if (subject.includes(t)) {
        score += 40;
      } else {
        const subWords = subject.split(/[\s,./\-_|()#]+/);
        for (const w of subWords) {
          if (w.length >= 3) {
            const dist = levenshtein(w, t);
            if (dist === 1) score += 25; // 1-letter typo in title
            else if (dist === 2 && t.length >= 6) score += 15; // 2-letter typo in title
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

    return reels
      .filter((r) => {
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

        // Every token typed by user must match at least one field (fuzzy or substring)
        return rawTokens.every((token) =>
          searchableFields.some((field) => matchesTokenFuzzy(field, token))
        );
      })
      .sort((a, b) => {
        if (rawTokens.length === 0) return 0;
        const scoreA = calculateRelevanceScore(a, debouncedSearchQuery, rawTokens);
        const scoreB = calculateRelevanceScore(b, debouncedSearchQuery, rawTokens);
        return scoreB - scoreA; // Highest relevance score always ranks first
      });
  }, [reels, selectedDomain, selectedSubdomain, debouncedSearchQuery]);

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
    setActiveTab('reels');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      {/* Top Static Navbar (Reels | Tools | Flashcards) */}
      <Navbar
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        uniqueVisitors={uniqueVisitors}
        isExtensionConnected={isExtensionConnected}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Metric Cards Banner (4 Static Vault Metrics) */}
        <StatsCounter
          totalReels={reels.length}
          totalDomains={domains.length}
          totalSubtopics={totalSubtopicsCount}
          totalEntities={totalEntitiesCount}
        />

        {/* Professional Dismissible Partner Banner */}
        <TopBannerAdSpot />

        {/* Tabs Content Container (Guaranteed Min Height to prevent footer jumps) */}
        <div className="flex-1 flex flex-col min-h-[560px]">
          {/* 1. Saved Reels Feed View */}
          <div className={activeTab === 'reels' ? 'block flex-1' : 'hidden'}>
            <div className="flex flex-col lg:flex-row items-start gap-7 min-h-[520px]">
              {/* Category Sidebar */}
              <DomainSidebar
                domains={domains}
                selectedDomain={selectedDomain}
                onSelectDomain={(d) => {
                  setSelectedDomain(d);
                  setSelectedSubdomain('All');
                }}
                domainCounts={domainCounts}
                totalCount={reels.length}
              />

              {/* Feed Section */}
              <section className="flex-1 w-full min-w-0 flex flex-col justify-between min-h-[500px]">
                <div>
                  {/* Toolbar: Search + Filter Count + Grid/Table Toggle (Static & Grounded) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search
                        className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        strokeWidth={1.5}
                      />
                      <input
                        type="text"
                        placeholder="Search by topic, tools (Docker, Tailwind), or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] focus:border-brand-500 text-xs text-white placeholder-zinc-500 outline-none transition-colors duration-150"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-200"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Right controls: Filter Counter + View Mode Toggle */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/50 border border-white/[0.08] text-xs text-zinc-400">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                        <span>
                          <strong className="text-white font-mono">{filteredReels.length}</strong> reels
                        </span>
                      </div>

                      {/* Grid vs Table View Mode Toggle */}
                      <div className="flex items-center p-1 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
                        <button
                          onClick={() => setFeedViewMode('grid')}
                          title="Grid View"
                          aria-label="Grid View"
                          className={`p-1.5 rounded-lg text-xs transition-colors duration-150 ${
                            feedViewMode === 'grid'
                              ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => setFeedViewMode('table')}
                          title="Table View"
                          aria-label="Table View"
                          className={`p-1.5 rounded-lg text-xs transition-colors duration-150 ${
                            feedViewMode === 'table'
                              ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Table className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subcategory Pills */}
                  <SubdomainPills
                    subdomains={subdomainsForDomain}
                    selectedSubdomain={selectedSubdomain}
                    onSelectSubdomain={setSelectedSubdomain}
                    subdomainCounts={subdomainCounts}
                    totalInDomain={
                      selectedDomain === 'All' ? reels.length : domainCounts[selectedDomain] || 0
                    }
                  />

                  {/* Content Renderers */}
                  {isHydrating ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  ) : feedViewMode === 'table' ? (
                    <>
                      <ReelTableView
                        reels={paginatedReels}
                        onDelete={handleDeleteReel}
                      />
                    </>
                  ) : (
                    /* Grid View with auto-rows-fr for uniform card sizing */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 auto-rows-fr">
                      {paginatedReels.map((item, idx) => (
                        <React.Fragment key={item.url}>
                          <ReelCard
                            item={item}
                            onSelect={(reel) => setSelectedReelForModal(reel)}
                            onEntityClick={handleEntityClick}
                            onDelete={handleDeleteReel}
                          />
                          {/* Native Sponsored Slot - Hidden during search */}
                          {!searchQuery.trim() && (idx === 3 || (paginatedReels.length < 4 && idx === paginatedReels.length - 1)) && (
                            <FeedAdSpot
                              key="feed-sponsor-slot"
                              sponsorName="DevFlow Cloud"
                              category="Featured Partner"
                              title="Automate Full-Stack Deployments & Edge Caching"
                              description="Build, preview, and deploy high-performance applications with global edge distribution, zero-config CDN, and instant rollbacks."
                              link="https://github.com"
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Actionable Empty State */}
                  {!isHydrating && filteredReels.length === 0 && (
                    <div className="text-center py-16 px-6 bg-zinc-900/30 rounded-2xl border border-white/[0.08] mt-4">
                      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center border border-white/[0.06]">
                        <Folder className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">
                        No matching reels
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-5">
                        Try adjusting your search query or category filter.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedDomain('All');
                          setSelectedSubdomain('All');
                        }}
                        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white border border-white/[0.08] transition-colors duration-150 active:scale-[0.98]"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Grounded Pagination */}
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
          </div>

          {/* 2. Flashcards Focus Study Tab */}
          <div className={activeTab === 'flashcards' ? 'block flex-1' : 'hidden'}>
            <FlashcardViewer
              reels={filteredReels}
              domains={domains}
              selectedDomain={selectedDomain}
              onSelectDomain={(domain) => {
                setSelectedDomain(domain);
                setSelectedSubdomain('All');
              }}
              onResetFilters={() => {
                setSearchQuery('');
                setSelectedDomain('All');
                setSelectedSubdomain('All');
              }}
              onSwitchToReels={() => {
                setSearchQuery('');
                setSelectedDomain('All');
                setSelectedSubdomain('All');
                setActiveTab('reels');
              }}
            />
          </div>
        </div>
      </main>

      {/* Reader Modal */}
      <ReelDetailModal
        reel={selectedReelForModal}
        onClose={() => setSelectedReelForModal(null)}
        onEntityClick={handleEntityClick}
        onDelete={handleDeleteReel}
      />

      {/* Sync & Export Modals */}
      <SyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onImportReels={handleImportReels}
        onResetSample={handleResetSample}
        onClearData={handleClearData}
        currentCount={reels.length}
        existingReels={reels}
      />

      <PlaybookExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reels={reels}
        currentDomain={selectedDomain}
        currentSubdomain={selectedSubdomain}
        domains={domains}
      />

      {/* Clean Footer */}
      <footer className="border-t border-white/[0.08] py-6 bg-zinc-950 text-center text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Reel Analyzer &bull; Video Knowledge Vault</span>
          <span className="text-[11px] text-zinc-600">
            Personal Knowledge Management System
          </span>
        </div>
      </footer>
    </div>
  );
}
