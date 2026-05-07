import React, { useCallback, useRef } from 'react';
import {
  useGridApiContext,
  ColumnsPanelTrigger,
} from '@mui/x-data-grid-pro';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../stores/dashboardStore';
import type { FilterMode } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useScaling } from '@/hooks/useScaling';

const FILTERS: { mode: FilterMode; label: string }[] = [
  { mode: 'all', label: 'All' },
  { mode: 'commenced', label: 'Commenced' },
  { mode: 'pipeline', label: 'Pipeline' },
  { mode: 'approved', label: 'Approved' },
  { mode: 'nmi', label: 'Need Info' },
  { mode: 'void', label: 'Void/Dup' },
  { mode: 'rejected', label: 'Rejected' },
  { mode: 'no_program', label: 'No Program' },
];

const SearchIcon = () => {
  const { sc } = useScaling();
  return (
    <svg width={sc(12)} height={sc(12)} viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
};

export const GridToolbarComposite: React.FC = () => {
  const { sc, font, rem } = useScaling();
  const apiRef = useGridApiContext();

  const searchQuery = useDashboardStore(s => s.searchQuery);
  const filterMode = useDashboardStore(s => s.filterMode);
  const totalRows = useDashboardStore(s => s.totalRows);
  const paginatedStudents = useDashboardStore(s => s.paginatedStudents);
  const expandedRowIds = useDashboardStore(s => s.expandedRowIds);

  const setSearchQuery = useDashboardStore(s => s.setSearchQuery);
  const setFilterMode = useDashboardStore(s => s.setFilterMode);
  const toggleExpandAll = useDashboardStore(s => s.toggleExpandAll);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [setSearchQuery]
  );

  const handleClear = useCallback(() => {
    setSearchQuery('');
    inputRef.current?.focus();
  }, [setSearchQuery]);

  // derive state
  const isAllExpanded =
    paginatedStudents.length > 0 &&
    paginatedStudents.every(s => expandedRowIds.has(`std::${s.std_id}`));

  const totalOpps = paginatedStudents.reduce(
    (a, s) => a + s.opportunities.length,
    0
  );

  const buttonStyle = {
    fontSize: font(0.875),
    paddingLeft: rem(0.875),
    paddingRight: rem(0.875),
    paddingTop: rem(0.375),
    paddingBottom: rem(0.375),
    borderRadius: rem(9999),
    height: 'auto',
  };

  return (
    <div className="flex flex-col border-b border-[rgba(0,0,0,0.08)] bg-[#FAFAF9]">
      {/* Row 1 */}
      <div
        className="flex items-center px-4 flex-wrap"
        style={{ gap: rem(1), paddingTop: rem(0.5), paddingBottom: rem(0.5), minHeight: sc(44) }}
      >
        {/* Search */}
        <div className="w-full text-black" style={{ maxWidth: sc(320) }}>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearch}
            onClear={handleClear}
            leftIcon={<SearchIcon />}
            style={{ height: sc(34), fontSize: font(0.875) }}
            className="placeholder:text-black/50"
          />
        </div>

        {/* Divider */}
        <div className="w-px bg-[rgba(0,0,0,0.09)]" style={{ height: sc(20) }} />

        {/* Toolbar Buttons */}
        <div className="flex items-center" style={{ gap: rem(0.5) }}>
          <ColumnsPanelTrigger
            render={(buttonProps) => (
              <Button
                {...buttonProps}
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 font-medium text-black bg-white shadow-sm hover:bg-[#F2F1EE] transition-all border-[rgba(0,0,0,0.12)]"
                style={buttonStyle}
              >
                Columns
              </Button>
            )}
          />

          {/* Export Button */}
          {/* <Button
            className={buttonClass}
            variant="outline"
            size="sm"
            onClick={handleExportClick}
          >
            <DownloadIcon style={{ fontSize: 18, marginRight: 6 }} />
            Export
          </Button> */}

          {/* Export Menu // Enable with Premium*/}
          {/* <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem
              onClick={() => {
                apiRef.current.exportDataAsCsv();
                handleExportClose();
              }}
            >
              Download as CSV
            </MenuItem>
            <MenuItem
              onClick={() => {
                apiRef.current.exportDataAsExcel(); 
                alert('Excel export available in Premium version');
                handleExportClose();
              }}
            >
              Download as Excel
            </MenuItem>
            <MenuItem
              onClick={() => {
                window.print();
                handleExportClose();
              }}
            >
              Print
            </MenuItem>
          </Menu> */}
          <motion.div whileTap={{ scale: 0.94 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpandAll}
              className="flex items-center gap-1.5 font-medium text-black bg-white shadow-sm hover:bg-[#F2F1EE] transition-all border-[rgba(0,0,0,0.12)]"
              style={buttonStyle}
              title={isAllExpanded ? 'Collapse all students' : 'Expand all students'}
            >
              {isAllExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-px bg-[rgba(0,0,0,0.09)]" style={{ height: sc(20) }} />

        {/* Stats */}
        <div
          className="ml-auto text-black tabular-nums whitespace-nowrap"
          style={{ fontSize: font(0.875) }}
        >
          <span className="font-bold">{totalRows.toLocaleString()}</span> Students
          &nbsp;·&nbsp;
          <span className="font-bold">{totalOpps.toLocaleString()}</span> Programs
        </div>
      </div>

      {/* Row 2 - Filters */}
      <div
        className="flex items-center px-4"
        style={{ gap: rem(0.625), paddingBottom: rem(0.625), flexWrap: 'wrap' }}
      >
        <span
          className="font-bold uppercase tracking-[0.8px] text-black opacity-80"
          style={{ fontSize: font(0.75), marginRight: rem(0.5) }}
        >
          Filter:
        </span>

        {FILTERS.map(f => (
          <motion.button
            key={f.mode}
            onClick={() => setFilterMode(f.mode)}
            className={[
              'inline-flex items-center rounded-full border transition-all duration-150 cursor-pointer shadow-sm font-medium',
              filterMode === f.mode
                ? 'bg-[#18181A] text-white border-[#18181A]'
                : 'bg-white text-black border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.22)] hover:bg-[#F2F1EE]',
            ].join(' ')}
            style={{ fontSize: font(0.875), paddingLeft: rem(0.75), paddingRight: rem(0.75), paddingTop: rem(0.25), paddingBottom: rem(0.25) }}
            whileTap={{ scale: 0.95 }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};