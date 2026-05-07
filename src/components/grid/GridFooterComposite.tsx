import React, { useCallback } from 'react';
import {
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { useDashboardStore, PAGE_SIZE_OPTIONS } from '../../stores/dashboardStore';
import { Button } from '@/components/ui/button';
import { useScaling } from '@/hooks/useScaling';

const ChevronLeft = () => {
  const { sc } = useScaling();
  return (
    <svg width={sc(12)} height={sc(12)} viewBox="0 0 12 12" fill="none">
      <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
const ChevronRight = () => {
  const { sc } = useScaling();
  return (
    <svg width={sc(12)} height={sc(12)} viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2L8.5 6l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const GridFooterComposite: React.FC = () => {
  const { sc, font, rem } = useScaling();
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
    <div
      className="flex items-center justify-between border-t border-[rgba(0,0,0,0.08)] bg-[#F9F8F6]"
      style={{ height: sc(36), paddingLeft: rem(0.75), paddingRight: rem(0.75) }}
    >
      {/* Left: rows per page */}
      <div className="flex items-center" style={{ gap: rem(0.5) }}>
        <span className="text-black whitespace-nowrap" style={{ fontSize: font(0.875) }}>Rows per page:</span>
        <select
          value={paginationModel.pageSize}
          onChange={handlePageSize}
          className="text-[#5C5B57] border border-[rgba(0,0,0,0.10)] rounded-[4px] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2B7FD4] font-mono"
          style={{ fontSize: font(0.875), paddingLeft: rem(0.375), paddingRight: rem(0.375), paddingTop: rem(0.125), paddingBottom: rem(0.125) }}
        >
          {PAGE_SIZE_OPTIONS.map(n => (
            <option key={n} value={n} style={{ fontSize: font(0.875) }}>{n}</option>
          ))}
        </select>
      </div>

      {/* Center: record range */}
      <div className="text-black font-mono tabular-nums" style={{ fontSize: font(0.875) }}>
        {totalRows > 0
          ? <><span className="font-semibold text-black">{start}–{end}</span> of <span className="font-semibold text-black">{totalRows}</span> students</>
          : 'No results'}
      </div>

      {/* Right: page navigation */}
      <div className="flex items-center" style={{ gap: rem(0.375) }}>
        <span className="text-black font-mono" style={{ fontSize: font(0.875) }}>
          Page <span className="font-semibold text-black">{currentPage}</span> / <span className="font-semibold text-black">{totalPages}</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={paginationModel.page === 0}
          style={{ height: sc(24), width: sc(24) }}
          title="Previous page"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          disabled={paginationModel.page >= totalPages - 1}
          style={{ height: sc(24), width: sc(24) }}
          title="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
