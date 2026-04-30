import React, { useCallback } from 'react';
import {
  GridPagination,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
  gridPaginationModelSelector,
} from '@mui/x-data-grid-pro';
import { useDashboardStore, PAGE_SIZE_OPTIONS } from '../../store/dashboardStore';
import { Button } from '@/components/ui/button';

const ChevronLeft = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M4.5 2L8.5 6l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Composite Footer: custom pagination + page size + totals.
 * Uses MUI's GridPagination as a sub-component (composite).
 */
export const GridFooterComposite: React.FC = () => {
  const apiRef = useGridApiContext();
  const paginationModel = useDashboardStore(s => s.paginationModel);
  const totalRows = useDashboardStore(s => s.totalRows);
  const setPagination = useDashboardStore(s => s.setPaginationModel);

  const totalPages = Math.max(1, Math.ceil(totalRows / paginationModel.pageSize));
  const currentPage = paginationModel.page + 1;

  const start = paginationModel.page * paginationModel.pageSize + 1;
  const end = Math.min(start + paginationModel.pageSize - 1, totalRows);

  const goPrev = useCallback(() => {
    if (paginationModel.page > 0) {
      setPagination({ ...paginationModel, page: paginationModel.page - 1 });
    }
  }, [paginationModel, setPagination]);

  const goNext = useCallback(() => {
    if (paginationModel.page < totalPages - 1) {
      setPagination({ ...paginationModel, page: paginationModel.page + 1 });
    }
  }, [paginationModel, totalPages, setPagination]);

  const handlePageSize = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPagination({ page: 0, pageSize: Number(e.target.value) });
    },
    [setPagination]
  );

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-t border-[rgba(0,0,0,0.08)] bg-[#F9F8F6] h-9">
      {/* Left: rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#9B9992] whitespace-nowrap">Rows per page:</span>
        <select
          value={paginationModel.pageSize}
          onChange={handlePageSize}
          className="text-[10.5px] text-[#5C5B57] border border-[rgba(0,0,0,0.10)] rounded-[4px] bg-white px-1.5 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2B7FD4] font-mono"
        >
          {PAGE_SIZE_OPTIONS.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Center: record range */}
      <div className="text-[10px] text-[#9B9992] font-mono tabular-nums">
        {totalRows > 0
          ? <><span className="font-semibold text-[#5C5B57]">{start}–{end}</span> of <span className="font-semibold text-[#5C5B57]">{totalRows}</span> students</>
          : 'No results'}
      </div>

      {/* Right: page navigation */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-[#9B9992] font-mono">
          Page <span className="font-semibold text-[#5C5B57]">{currentPage}</span> / <span className="font-semibold text-[#5C5B57]">{totalPages}</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={paginationModel.page === 0}
          className="h-6 w-6"
          title="Previous page"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          disabled={paginationModel.page >= totalPages - 1}
          className="h-6 w-6"
          title="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
