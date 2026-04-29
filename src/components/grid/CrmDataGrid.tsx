import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  DataGridPro,
  useGridApiRef,
  type GridRowParams,
  type GridSortModel,
  type GridPaginationModel,
  type GridRowClassNameParams,
  type GridRowId,
} from '@mui/x-data-grid-pro';
import { PAGE_SIZE_OPTIONS, useDashboardStore } from '@/store/dashboardStore';
import { buildGridRows, type GridRow } from '../../lib/gridRows';
import { ALL_COLUMNS } from './ColumnDefs';
import { GridToolbarComposite } from './GridToolbarComposite';
import { GridNoRows } from './GridNoRows';
import { GridFooterComposite } from './GridFooterComposite';
import { OppDetailPanel } from './OppDetailPanel';

// ── Row height getter ──────────────────────────────────────
const getRowHeight = () => 32;

// ── Row sx ────────────────────────────────────────────────
const ROW_SX = {
  // Student row base
  '&.std-group-row': {
    background: 'var(--crm-row-std-bg, #FFFFFF)',
    fontWeight: 500,
  },

  // Student row — expanded / active (cyan highlight)
  '&.std-group-row-active, &.std-group-row-active .MuiDataGrid-cell, &.std-group-row-active .MuiDataGrid-cell--pinnedLeft':
    {
      backgroundColor: '#CFFAFE !important',
    },

  '&.std-group-row-active:hover, &.std-group-row-active:hover .MuiDataGrid-cell, &.std-group-row-active:hover .MuiDataGrid-cell--pinnedLeft':
    {
      backgroundColor: '#A5F3FC !important',
    },

  // Student row hover
  '&.std-group-row:hover': {
    background: '#EFF0EE',
    zIndex: 1,
    position: 'relative',
  },

  // Pinned cell hover sync
  '&.std-group-row:hover .MuiDataGrid-cell--pinnedLeft': {
    backgroundColor: '#EFF0EE !important',
  },

  '&.std-group-row-active .MuiDataGrid-cell--pinnedLeft': {
    backgroundColor: '#CFFAFE !important',
  },

  // Selection
  '&.Mui-selected': {
    background: 'rgba(43,127,212,0.06) !important',
  },
  '&.Mui-selected:hover': {
    background: 'rgba(43,127,212,0.10) !important',
  },
};

// ── Main column header sx ─────────────────────────────────
const HEADER_SX = {
  '& .MuiDataGrid-columnHeader': {
    background: 'var(--crm-header-bg, #F5F4F1)',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: '#18181A !important',
    fontSize: '10px !important',
    fontWeight: '700 !important',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-columnHeaderTitle': {
    color: 'var(--crm-blue, #2B7FD4) !important',
  },
};

// ── Detail panel sx ───────────────────────────────────────
const DETAIL_PANEL_SX = {
  // Remove the default MUI detail panel border / shadow
  '& .MuiDataGrid-detailPanel': {
    overflow: 'visible',
  },
};

// ── Main DataGrid component ───────────────────────────────
export const CrmDataGrid: React.FC = () => {
  const apiRef = useGridApiRef();

  // ── Store selectors ──────────────────────────────────────
  const paginatedStudents  = useDashboardStore(s => s.paginatedStudents);
  const totalRows          = useDashboardStore(s => s.totalRows);
  const muiSortModel       = useDashboardStore(s => s.muiSortModel);
  const paginationModel    = useDashboardStore(s => s.paginationModel);
  const isLoading          = useDashboardStore(s => s.isLoading);
  const columnVisibility   = useDashboardStore(s => s.columnVisibility);
  const expandedRowIds     = useDashboardStore(s => s.expandedRowIds);
  const setMuiSortModel    = useDashboardStore(s => s.setMuiSortModel);
  const setPaginationModel = useDashboardStore(s => s.setPaginationModel);
  const setColumnVisibility= useDashboardStore(s => s.setColumnVisibility);
  const toggleExpanded     = useDashboardStore(s => s.toggleExpanded);

  // ── Build flat student rows ──────────────────────────────
  const rows = useMemo(
    () => buildGridRows(paginatedStudents),
    [paginatedStudents]
  );

  // ── Map store Set<string> → Set<GridRowId> for MUI prop ──
  // The store keeps `std::${id}` keys; this version of MUI expects Set<GridRowId>.
  const detailPanelExpandedRowIds = useMemo<Set<GridRowId>>(
    () => new Set<GridRowId>(expandedRowIds),
    [expandedRowIds]
  );

  // ── Detail panel content ─────────────────────────────────
  const getDetailPanelContent = useCallback(
    (params: GridRowParams<GridRow>) => {
      const row = params.row as GridRow;
      if (row._student.opportunities.length === 0) return null;
      return <OppDetailPanel student={row._student} />;
    },
    []
  );

  // ── Detail panel height ──────────────────────────────────
  // Each opp row is 30px + header row (26px) + section label (32px) + border (2px)
  const getDetailPanelHeight = useCallback(
    (params: GridRowParams<GridRow>) => {
      const count = (params.row as GridRow)._student.opportunities.length;
      if (count === 0) return 0;
      // 60px fixed overhead + 30px per row (capped at 10 rows before scroll)
      return Math.min(60 + count * 30, 60 + 10 * 30);
    },
    []
  );

  // ── Row class names ──────────────────────────────────────
  const getRowClassName = useCallback(
    (params: GridRowClassNameParams<GridRow>): string => {
      const row = params.row as GridRow;
      const classes = ['std-group-row', 'cursor-pointer'];

      const isExpanded = expandedRowIds.has(`std::${String(row.std_id)}`);
      const hasOpps    = row.opp_count > 0;

      if (hasOpps && isExpanded) classes.push('std-group-row-active');

      return classes.join(' ');
    },
    [expandedRowIds]
  );

  // ── Handlers ────────────────────────────────────────────
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

  // Row click — toggle expand on student rows that have opportunities
  const handleRowClick = useCallback(
    (params: GridRowParams<GridRow>) => {
      const row = params.row as GridRow;
      if (row.opp_count > 0) {
        toggleExpanded(`std::${row.std_id}`);
      }
    },
    [toggleExpanded]
  );

  // Handle MUI's own detail panel toggle (e.g. keyboard, programmatic)
  const handleDetailPanelExpandedRowIdsChange = useCallback(
    (ids: Set<GridRowId>) => {
      // Sync back to store: compute add/remove delta
      const next = new Set<string>(Array.from(ids).map(String));
      const prev = expandedRowIds;

      // rows that are now expanded but weren't before
      for (const id of next) {
        if (!prev.has(id)) toggleExpanded(id);
      }
      // rows that were expanded but are no longer
      for (const id of prev) {
        if (!next.has(id)) toggleExpanded(id);
      }
    },
    [expandedRowIds, toggleExpanded]
  );

  // ── Merged sx ────────────────────────────────────────────
  const sx = useMemo(
    () => ({
      height: '100%',
      ...ROW_SX,
      ...HEADER_SX,
      ...DETAIL_PANEL_SX,

      // Cell hover
      '& .MuiDataGrid-cell:hover': {
        background: 'rgba(0,0,0,0.02)',
      },

      // Pinned columns shadow
      '& .MuiDataGrid-pinnedColumns--left': {
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        borderRight: '1px solid rgba(0,0,0,0.1)',
      },

      // Visual divider after APPS column
      '& .MuiDataGrid-cell[data-field="opp_count"]': {
        borderRight: '1.5px solid rgba(0,0,0,0.08)',
      },
      '& .MuiDataGrid-columnHeader[data-field="opp_count"]': {
        borderRight: '1.5px solid rgba(0,0,0,0.08)',
      },
    }),
    []
  );

  return (
    <motion.div
      className="flex-1 min-h-0 rounded-[8px] border border-[rgba(0,0,0,0.1)] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <DataGridPro<GridRow>
        apiRef={apiRef}
        rows={rows}
        columns={ALL_COLUMNS}
        showToolbar

        // Row identity
        getRowId={(row) => row.id}
        getRowHeight={getRowHeight as any}
        getRowClassName={getRowClassName as any}

        // ── Detail panel ──────────────────────────────────
        getDetailPanelContent={getDetailPanelContent as any}
        getDetailPanelHeight={getDetailPanelHeight as any}
        detailPanelExpandedRowIds={detailPanelExpandedRowIds}
        onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}

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

        // Pinned columns (student name + CRM)
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
