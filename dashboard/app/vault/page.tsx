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
  const [feedViewMode, setFeedViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState<'reels' | 'flashcards'>('reels');

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
  }, [selectedDomain, selectedSubdomain, searchQuery, feedViewMode, activeTab]);

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

  // Regex-safe Search & Filtering (incorporating Category and Subcategory)
  const filteredReels = useMemo(() => {
    return reels.filter((r) => {
      const domainMatch = selectedDomain === 'All' || r.domain === selectedDomain;
      const subMatch = selectedSubdomain === 'All' || r.subdomain === selectedSubdomain;

      if (!domainMatch || !subMatch) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        (r.subject && r.subject.toLowerCase().includes(q)) ||
        (r.domain && r.domain.toLowerCase().includes(q)) ||
        (r.subdomain && r.subdomain.toLowerCase().includes(q)) ||
        (r.personalUtility && r.personalUtility.toLowerCase().includes(q)) ||
        (r.entities && r.entities.toLowerCase().includes(q)) ||
        (r.tags && r.tags.toLowerCase().includes(q)) ||
        (r.summary && r.summary.toLowerCase().includes(q))
      );
    });
  }, [reels, selectedDomain, selectedSubdomain, searchQuery]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredReels.length / pageSize) || 1;
  const paginatedReels = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReels.slice(start, start + pageSize);
  }, [filteredReels, currentPage, pageSize]);

  // Handlers for Data Sync
  const handleImportReels = (imported: ReelItem[]) => {
    const existingUrls = new Set(reels.map((r) => r.url));
    const newItems = imported.filter((r) => !existingUrls.has(r.url));
    const merged = [...newItems, ...reels];
    setReels(merged);
    saveStoredReels(merged);
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
                          />
                          {/* Native Sponsored Slot */}
                          {(idx === 3 || (paginatedReels.length < 4 && idx === paginatedReels.length - 1)) && (
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
      />

      {/* Sync & Export Modals */}
      <SyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onImportReels={handleImportReels}
        onResetSample={handleResetSample}
        onClearData={handleClearData}
        currentCount={reels.length}
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
