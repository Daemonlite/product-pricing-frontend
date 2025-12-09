import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Select } from './select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, itemsPerPageOptions = [5, 10, 25], className }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const selectOptions = itemsPerPageOptions.map(option => ({ value: option.toString(), label: `${option}` }));

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Select
        options={selectOptions}
        value={itemsPerPage.toString()}
        onChange={(value) => onItemsPerPageChange(Number(value))}
        className="w-32"
        size='sm'
        placeholder='Items per page'
        variant='filled'
      />
      <button
         className={`flex items-center gap-1 px-2 py-2 text-sm font-medium border rounded-full ${currentPage === totalPages ? 'bg-primary border border-border hover:bg-primary/90 cursor-pointer' : 'bg-muted border border-border hover:bg-input cursor-not-allowed'}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
            key={page}
            className={`px-3 py-1 text-sm font-medium border rounded-full ${currentPage === page ? 'bg-primary text-white border border-border hover:bg-primary/90 cursor-default' : 'bg-muted text-foreground border border-border hover:bg-input hover:text-accent-foreground cursor-pointer'}`}
            onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={`flex items-center gap-1 px-2 py-2 text-sm font-medium border rounded-full ${currentPage === totalPages ? 'bg-muted border border-border hover:bg-input cursor-not-allowed' : 'bg-primary border border-border hover:bg-primary/90 cursor-pointer'}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
