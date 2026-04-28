import React, { useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DataGridPro,
  useGridApiRef,
  type GridRowParams,
  type GridSortModel,
  type GridPaginationModel,
  type GridRowClassNameParams,
  type GridColumnGroupingModel,
} from '@mui/x-data-grid-pro';
import { useDashboardStore, PAGE_SIZE_OPTIONS } from '../../store/dashboardStore';
import { buildGridRows, type GridRow } from '../../lib/gridRows';
import { ALL_COLUMNS, COLUMN_GROUPS } from './ColumnDefs';
import { GridToolbarComposite } from './GridToolbarComposite';
import { GridNoRows } from './GridNoRows';
import { GridFooterComposite } from './GridFooterComposite';

// ── Row height getter ─────────────────────────────────────
const getRowHeight = (params: { model: GridRow }) =>
  params.model.kind === 'student' ? 32 : 28;

// ── Row class names ───────────────────────────────────────
const getRowClassName = (params: GridRowClassNameParams<GridRow>): string => {
  const row = params.row as GridRow;
  const classes: string[] = [];
  if (row.kind === 'student') classes.push('std-group-row');
  if (row.kind === 'opportunity') classes.push('opp-child-row');
  if (row.kind === 'opportunity' && row.isLastOpp) classes.push('opp-last-child');
  if (row.kind === 'opportunity') classes.push('opp-indent-border');
  return classes.join(' ');
};

// ── Animated Row ─────────────────────────────────────────
// Framer Motion wraps are injected via sx slotProps on DataGridPro
// We use a CSS-var + inline-style trick for zero-jitter hover scale
const ROW_SX = {
  '&.std-group-row': {
    background: 'var(--crm-row-std-bg)',
    fontWeight: 500,
    '& .MuiDataGrid-cell': {
      borderBottom: 'none',
    },
  },
  '&.opp-child-row': {
    background: 'var(--crm-row-opp-bg)',
    '& .MuiDataGrid-cell:first-of-type': {
      borderLeft: '2.5px solid rgba(43,127,212,0.28)',
    },
  },
  '&.opp-last-child': {
    borderBottom: '2px solid rgba(0,0,0,0.1) !important',
  },
  // Row hover — GPU-accelerated scale via transform
  '&.std-group-row:hover': {
    background: '#EFF0EE',
    transform: 'scaleY(1.005)',
    transformOrigin: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
    zIndex: 1,
    position: 'relative',
    transition: 'transform 150ms cubic-bezier(0.22,1,0.36,1), box-shadow 150ms cubic-bezier(0.22,1,0.36,1), background 150ms',
  },
  '&.opp-child-row:hover': {
    background: '#F5F4F1',
    transition: 'background 150ms',
  },
  // Deselect blue highlight
  '&.Mui-selected': {
    background: 'rgba(43,127,212,0.06) !important',
  },
  '&.Mui-selected:hover': {
    background: 'rgba(43,127,212,0.10) !important',
  },
};

// ── Column group header SX ────────────────────────────────
const COL_GROUP_SX = {
  '& .MuiDataGrid-columnGroupHeader': {
    background: 'var(--crm-header-bg)',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    height: '22px !important',
    minHeight: '22px !important',
  },
  '& .MuiDataGrid-columnGroupHeaderTitle': {
    fontSize: '9px !important',
    fontWeight: '700 !important',
    textTransform: 'uppercase !important',
    letterSpacing: '0.8px !important',
    color: '#18181A !important',
    padding: '0 8px !important',
  },
};

// ── Main DataGrid component ───────────────────────────────
export const CrmDataGrid: React.FC = () => {
  const apiRef = useGridApiRef();

  // Store selectors (stable refs)
  const paginatedStudents = useDashboardStore(s => s.paginatedStudents);
  const totalRows = useDashboardStore(s => s.totalRows);
  const muiSortModel = useDashboardStore(s => s.muiSortModel);
  const paginationModel = useDashboardStore(s => s.paginationModel);
  const isLoading = useDashboardStore(s => s.isLoading);
  const columnVisibility = useDashboardStore(s => s.columnVisibility);
  const expandedRowIds = useDashboardStore(s => s.expandedRowIds);
  const setMuiSortModel = useDashboardStore(s => s.setMuiSortModel);
  const setPaginationModel = useDashboardStore(s => s.setPaginationModel);
  const setColumnVisibility = useDashboardStore(s => s.setColumnVisibility);
  const toggleExpanded = useDashboardStore(s => s.toggleExpanded);

  // Build flat rows from paginated students (memoized)
  const rows = useMemo(
    () => buildGridRows(paginatedStudents),
    [paginatedStudents]
  );

  // Filtered rows: only show student rows + expanded children
  const visibleRows = useMemo((): GridRow[] => {
    const out: GridRow[] = [];
    for (const row of rows) {
      // Always include student rows
      if (row.kind === 'student') {
        out.push(row);
      } else {
        // Only show opportunity rows if parent student is expanded
        const parentId = `std::${row.std_id}`;
        if (expandedRowIds.has(parentId)) {
          out.push(row);
        }
      }
    }
    return out;
  }, [rows, expandedRowIds]);

  // Handlers (stable)
  const handleSortChange = useCallback(
    (model: GridSortModel) => setMuiSortModel(model),
    [setMuiSortModel]
  );

  const handlePaginationChange = useCallback(
    (model: GridPaginationModel) => setPaginationModel(model),
    [setPaginationModel]
  );

  const handleColumnVisibilityChange = useCallback(
    (model: Record<string, boolean>) => setColumnVisibility(model),
    [setColumnVisibility]
  );

  // Row click — toggle expand on student rows
  const handleRowClick = useCallback(
    (params: GridRowParams<GridRow>) => {
      const row = params.row as GridRow;
      if (row.kind === 'student' && row.opp_count > 0) {
        toggleExpanded(`std::${row.std_id}`);
      }
    },
    [toggleExpanded]
  );

  // Column group model (memoized)
  const columnGroupingModel = useMemo(
    (): GridColumnGroupingModel => COLUMN_GROUPS,
    []
  );

  // Merge row sx
  const sx = useMemo(() => ({
    height: '100%',
    ...ROW_SX,
    ...COL_GROUP_SX,
    // Column header text color
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#18181A !important',
    },
    // Cell hover (ultra-light)
    '& .MuiDataGrid-cell:hover': {
      background: 'rgba(0,0,0,0.02)',
    },
    // Header sort active
    '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-columnHeaderTitle': {
      color: 'var(--crm-blue) !important',
    },
    // Pinned columns shadow
    '& .MuiDataGrid-pinnedColumns--left': {
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
      borderRight: '1px solid rgba(0,0,0,0.1)',
    },
    // Student / opp section divider at column 13 (opp_count)
    '& .MuiDataGrid-cell[data-field="opp_count"]': {
      borderRight: '1.5px solid rgba(0,0,0,0.08)',
    },
    '& .MuiDataGrid-columnHeader[data-field="opp_count"]': {
      borderRight: '1.5px solid rgba(0,0,0,0.08)',
    },
  }), []);

  return (
    <motion.div
      className="flex-1 min-h-0 rounded-[8px] border border-[rgba(0,0,0,0.1)] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <DataGridPro<GridRow>
        apiRef={apiRef}
        rows={visibleRows}
        columns={ALL_COLUMNS}
        columnGroupingModel={columnGroupingModel}

        // Row identity
        getRowId={(row) => row.id}
        getRowHeight={getRowHeight as any}
        getRowClassName={getRowClassName as any}

        // Server-side simulation
        rowCount={totalRows}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"

        // Pagination
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPaginationModelChange={handlePaginationChange}

        // Sorting
        sortModel={muiSortModel}
        onSortModelChange={handleSortChange}

        // Column visibility
        columnVisibilityModel={columnVisibility}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}

        // Pinned columns
        pinnedColumns={{ left: ['std_name', 'std_crm_number'] }}

        // Density
        density="compact"

        // Loading
        loading={isLoading}

        // Interactions
        onRowClick={handleRowClick}
        disableRowSelectionOnClick={false}
        checkboxSelection={false}
        disableColumnFilter={false}
        disableColumnMenu={false}
        disableMultipleColumnsSorting={false}

        // Slots
        slots={{
          toolbar: GridToolbarComposite,
          noRowsOverlay: GridNoRows,
          footer: GridFooterComposite,
        }}

        // Virtual
        rowBufferPx={10}
        columnBufferPx={4}

        // Style
        sx={sx}
        style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px' }}

        // A11y
        aria-label="Student CRM Pipeline"
      />
    </motion.div>
  );
};
