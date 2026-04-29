import React, { useCallback, useRef } from 'react';
import {
  GridToolbarColumnsButton,
  GridToolbarExport,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../store/dashboardStore';
import type { FilterMode } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

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

const SearchIcon = () => (
  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
    <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ExpandAllIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M1 4V1h3M8 1h3v3M1 8v3h3M8 9h3v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CollapseAllIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M4 1v3H1M11 4V1H8M4 11v-3H1M11 8v3H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const GridToolbarComposite: React.FC = () => {
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

  return (
    <div className="flex flex-col border-b border-[rgba(0,0,0,0.08)] bg-[#FAFAF9]">
      {/* Row 1 */}
      <div className="flex items-center gap-2 px-3 py-2 flex-wrap">

        {/* Search */}
        <div className="w-72 flex-shrink-0 text-black">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search students, CRM#, office, program…"
            value={searchQuery}
            onChange={handleSearch}
            onClear={handleClear}
            leftIcon={<SearchIcon />}
          />
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[rgba(0,0,0,0.09)]" />

        {/* MUI Toolbar */}
        <div className="flex items-center gap-0.5">
          <GridToolbarColumnsButton
            slotProps={{
              button: {
                size: 'small',
                sx: {
                  fontFamily: 'var(--font-body)',
                  fontSize: '10.5px',
                  textTransform: 'none',
                  color: '#000000',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  '&:hover': { background: '#F2F1EE' },
                },
              },
            }}
          />

          <GridToolbarExport
            slotProps={{
              button: {
                size: 'small',
                sx: {
                  fontFamily: 'var(--font-body)',
                  fontSize: '10.5px',
                  textTransform: 'none',
                  color: '#000000',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  '&:hover': { background: '#F2F1EE' },
                },
              },
            }}
          />
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[rgba(0,0,0,0.09)]" />

        {/* Expand / Collapse */}
        <motion.div whileTap={{ scale: 0.94 }}>
          <Button
            className="rounded-full flex items-center gap-1.5 text-black"
            variant="ghost"
            size="sm"
            onClick={toggleExpandAll}
            title={isAllExpanded ? 'Collapse all students' : 'Expand all students'}
          >
            {isAllExpanded ? <CollapseAllIcon /> : <ExpandAllIcon />}
            {isAllExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="ml-auto text-[10px] text-black font-mono tabular-nums whitespace-nowrap">
          <span className="font-semibold text-black">
            {totalRows.toLocaleString()}
          </span>{' '}
          students
          &nbsp;·&nbsp;
          <span className="font-semibold text-black">
            {totalOpps.toLocaleString()}
          </span>{' '}
          opps
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-1 px-3 pb-2 flex-wrap">
        <span className="text-[9px] font-bold uppercase tracking-[0.6px] text-black mr-1">
          Filter:
        </span>

        {FILTERS.map(f => (
          <motion.button
            key={f.mode}
            onClick={() => setFilterMode(f.mode)}
            className={[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium border transition-all duration-150 cursor-pointer',
              filterMode === f.mode
                ? 'bg-[#18181A] text-white border-[#18181A]'
                : 'bg-white text-black border-[rgba(0,0,0,0.10)] hover:border-[rgba(0,0,0,0.18)] hover:bg-[#F2F1EE]',
            ].join(' ')}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};