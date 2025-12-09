import { useMemo, useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowUp, ArrowDown, Search, ChevronUp, ChevronDown, ArrowUpDown, XCircle } from 'lucide-react';
import { Pagination } from './pagination';

const tableVariants = cva(
  'w-full text-base text-left',
  {
    variants: {
      variant: {
        default: 'border-collapse',
        striped: 'border-collapse border-t border-border [&_tbody_tr:nth-child(even)]:bg-muted/50',
        hover: 'border-collapse border-t border-border [&_tbody_tr]:hover:bg-muted/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface Column<T> {
  key: keyof T;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  className?: string;
  cellClass?: (item: T) => string;
  format?: (value: any) => string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> extends VariantProps<typeof tableVariants> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  hoverable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: React.ComponentType<{ className?: string }>;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
  className?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  itemsPerPageOptions?: number[];
  header?: React.ReactNode;
  headerActions?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
  rowStyle?: (item: T, index: number) => React.CSSProperties;
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = false,
  searchPlaceholder = 'Search...',
  hoverable = true,
  selectable = false,
  pagination = false,
  itemsPerPage = 10,
  emptyStateTitle = 'No results found',
  emptyStateDescription = 'Try adjusting your search or filter to find what you\'re looking for.',
  emptyStateIcon: EmptyStateIcon = XCircle,
  sortKey,
  sortDirection,
  onSort,
  variant,
  className,
  currentPage = 1,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 25],
  header,
  headerActions,
  filters,
  actions,
  emptyState,
  footer,
  rowStyle,
}: TableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery) return data;
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, searchable]);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const clampedPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const startIndex = (clampedPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (onPageChange && clampedPage !== currentPage) {
      onPageChange(clampedPage);
    }
  }, [clampedPage, currentPage, onPageChange]);

  const getItemKey = (item: T) => {
    return (item as any).id || JSON.stringify(item);
  };

  return (
    <div className={`w-full rounded-lg border border-border bg-card ${className || ''}`}>
      {/* Header with title and actions */}
      {(header || title) && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            {header ? header : title && <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>}
            <div className="flex items-center space-x-3">{headerActions}</div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      {(searchable || filters) && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {searchable && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:placeholder-muted-foreground sm:text-sm"
                  />
                </div>
              </div>
            )}
            {filters && <div className="flex-shrink-0">{filters}</div>}
          </div>
        </div>
      )}

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          {/* Table header */}
          <thead className="bg-muted">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={[
                    'px-6 py-3 hover:bg-card text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                    col.sortable ? 'cursor-pointer hover:bg-card' : '',
                    col.className,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => (col.sortable && onSort ? onSort(col.key) : undefined)}
                >
                  <div className="flex items-center group">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="ml-1 text-muted-foreground group-hover:text-foreground pointer-events-none">
                        {sortKey !== col.key && <ArrowUpDown className="h-3 w-3" />}
                        {sortKey === col.key && sortDirection === 'asc' && <ChevronUp className="h-3 w-3" />}
                        {sortKey === col.key && sortDirection === 'desc' && <ChevronDown className="h-3 w-3" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>

          {/* Table body */}
          <tbody className="bg-card divide-y divide-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={rowStyle ? rowStyle(item, rowIndex) : undefined}
                  className={[
                    'transition-colors duration-150',
                    hoverable ? 'hover:bg-muted' : '',
                    selectable && selectedItems.has(getItemKey(item)) ? 'bg-accent' : '',
                    selectable ? 'cursor-pointer' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    if (!selectable) return;
                    const key = getItemKey(item);
                    setSelectedItems((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(key)) {
                        newSet.delete(key);
                      } else {
                        newSet.add(key);
                      }
                      return newSet;
                    });
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={[
                        'px-6 py-4 whitespace-nowrap text-sm',
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                        col.cellClass ? col.cellClass(item) : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {col.render ? (
                        col.render(item[col.key], item)
                      ) : col.format ? (
                        col.format(item[col.key])
                      ) : (
                        item[col.key]
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">{actions(item, rowIndex)}</div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    {emptyState || (
                      <>
                        <EmptyStateIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-card-foreground mb-2">{emptyStateTitle}</p>
                        <p className="text-sm text-muted-foreground">{emptyStateDescription}</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and footer */}
      {(pagination || footer) && (
        <div className="px-6 py-4 border-t border-border bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {pagination && (
              <>
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, sortedData.length)}</span> of{' '}
                  <span className="font-medium">{sortedData.length}</span> results
                </div>
                <div className="flex-shrink-0">
                  <Pagination
                    currentPage={clampedPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange ?? (() => {})}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange ?? (() => {})}
                    itemsPerPageOptions={itemsPerPageOptions}
                  />
                </div>
              </>
            )}
            {footer}
          </div>
        </div>
      )}
    </div>
  );
};
