import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { Select } from './select';
import { useState, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  onItemsPerPageChange, 
  itemsPerPageOptions = [5, 10, 25], 
  className 
}: PaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectOptions = itemsPerPageOptions.map(option => ({ 
    value: option.toString(), 
    label: `${option}` 
  }));

  // Generate visible page numbers with ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    if (isMobile) {
      // Mobile: Show first, last, current and neighbors
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    } else {
      // Desktop: Show more pages
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items per page selector - always visible */}
      <div className="w-full sm:w-auto">
        <Select
          options={selectOptions}
          value={itemsPerPage.toString()}
          onChange={(value) => onItemsPerPageChange(Number(value))}
          className="w-full sm:w-32"
          size='sm'
          placeholder='Items per page'
          variant='filled'
        />
      </div>
      
      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {/* Previous button */}
        <button
          className={`flex items-center justify-center p-2 text-sm font-medium border rounded-full min-w-[40px] h-[40px] ${
            currentPage === 1 
              ? 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50' 
              : 'bg-muted text-foreground border-border hover:bg-input hover:text-accent-foreground cursor-pointer'
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span 
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-8 h-8 text-foreground/50"
                aria-hidden="true"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            ) : (
              <button
                key={page}
                className={`flex items-center justify-center min-w-[32px] h-8 px-2 sm:px-3 text-sm font-medium border rounded-full transition-all ${
                  currentPage === page 
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 cursor-default shadow-sm scale-105' 
                    : 'bg-muted text-foreground border-border hover:bg-input hover:text-accent-foreground cursor-pointer'
                }`}
                onClick={() => onPageChange(page as number)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next button */}
        <button
          className={`flex items-center justify-center p-2 text-sm font-medium border rounded-full min-w-[40px] h-[40px] ${
            currentPage === totalPages 
              ? 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50' 
              : 'bg-muted text-foreground border-border hover:bg-input hover:text-accent-foreground cursor-pointer'
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Optional: Page info summary */}
      <div className="hidden lg:flex items-center text-sm text-muted-foreground whitespace-nowrap">
        Page <span className="font-medium mx-1">{currentPage}</span> of 
        <span className="font-medium mx-1">{totalPages}</span>
      </div>
    </div>
  );
};