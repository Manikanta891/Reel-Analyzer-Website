'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/[0.06]">
      {/* Range Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12131a] border border-white/[0.06] text-xs text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        <span className="text-zinc-400">
          Showing <span className="font-mono font-semibold text-zinc-200">{startItem}–{endItem}</span>
        </span>
        <span className="text-zinc-600">&bull;</span>
        <span className="text-zinc-400">
          <span className="font-mono font-semibold text-zinc-200">{totalItems}</span> notes
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#12131a] hover:bg-[#1a1c26] disabled:opacity-30 disabled:pointer-events-none border border-white/[0.06] text-xs font-medium text-zinc-300 hover:text-white transition-all active:scale-[0.98]"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Number Pills */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-zinc-600 select-none font-mono"
                >
                  •••
                </span>
              );
            }
            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-mono font-medium transition-all active:scale-[0.98] ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-[#12131a] hover:bg-[#1a1c26] text-zinc-400 hover:text-zinc-200 border border-white/[0.05]'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#12131a] hover:bg-[#1a1c26] disabled:opacity-30 disabled:pointer-events-none border border-white/[0.06] text-xs font-medium text-zinc-300 hover:text-white transition-all active:scale-[0.98]"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
