import React, { useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  DataGridPro,
  useGridApiContext,
  useGridSelector,
  gridDetailPanelExpandedRowIdsSelector,
  type GridRowParams,
  type GridRenderCellParams,
  type GridSortModel,
  type GridPaginationModel,
  type GridRowClassNameParams,
  type GridRowId,
  type GridInitialState,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { PAGE_SIZE_OPTIONS, useDashboardStore } from '@/stores/dashboardStore';
import { useTheme, useMediaQuery } from '@mui/material';
import { buildGridRows, type GridRow } from '../../lib/gridRows';
import { ALL_COLUMNS } from './ColumnDefs';
import { calculateColumnWidths } from '../../lib/columnWidthUtils';
import { GridToolbarComposite } from './GridToolbarComposite';
import { GridNoRows } from './GridNoRows';
import { GridFooterComposite } from './GridFooterComposite';
import { OppDetailPanel } from './OppDetailPanel';
import { useScaling } from '@/hooks/useScaling';
import { extractColumnWidths } from '@/hooks/useGridWidthSync';

// ── Row height getter (scales with resolution) ───────────────
const BASE_ROW_HEIGHT = 32;
const getRowHeight = (scale: number) => BASE_ROW_HEIGHT * scale;

// Normal expand icon (blue)
const PlusIcon = () => {
  const { sc } = useScaling();
  return (
    <div
      className="flex items-center justify-center rounded-[3px] bg-[#2B7FD4] text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:bg-[#1E5FB0] transition-colors"
      style={{ width: sc(18), height: sc(18) }}
    >
      <svg width={sc(11)} height={sc(11)} viewBox="0 0 12 12" fill="none">
        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Normal collapse icon (orange)
const MinusIcon = () => {
  const { sc } = useScaling();
  return (
    <div
      className="flex items-center justify-center rounded-[3px] bg-[#D97706] text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:bg-[#B45309] transition-colors"
      style={{ width: sc(18), height: sc(18) }}
    >
      <svg width={sc(11)} height={sc(11)} viewBox="0 0 12 12" fill="none">
        <path d="M2 6h8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Disabled plus icon (gray, no hover, no click)
const DisabledPlusIcon = () => {
  const { sc } = useScaling();
  return (
    <div
      className="flex items-center justify-center rounded-[3px] bg-gray-300 text-gray-500"
      style={{ width: sc(18), height: sc(18), opacity: 0.6, cursor: 'default' }}
    >
      <svg width={sc(11)} height={sc(11)} viewBox="0 0 12 12" fill="none">
        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ── Custom toggle cell component (uses grid hooks safely) ──
const CustomToggleCell = ({ row }: { row: GridRow }) => {
  const apiRef = useGridApiContext();
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  // const { sc, toggleExpanded } = useScaling(); // also need toggleExpanded from store? Better pass via props or context
  // Actually we need the store's toggleExpanded – we'll get it from parent via closure, but we can't use hooks here? 
  // We'll pass toggleExpanded as a prop from the column definition's renderCell (which has closure over the store action).
  // To avoid complexity, we'll use the apiRef only and let the parent sync via onDetailPanelExpandedRowIdsChange.
  // But we also need to know if the row has opportunities. That's in row.opp_count.

  const hasOpportunities = row.opp_count > 0;
  const isExpanded = expandedRowIds.has(row.id);

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!hasOpportunities) return;
    apiRef.current.toggleDetailPanel(row.id);
  };

  if (!hasOpportunities) {
    return <DisabledPlusIcon />;
  }

  return (
    <div onClick={handleToggle} style={{ cursor: 'pointer', display: 'flex' }}>
      {isExpanded ? <MinusIcon /> : <PlusIcon />}
    </div>
  );
};

// ── Row sx (unchanged) ─────────────────────────────────────
const ROW_SX = { /* same as before */ };
const HEADER_SX = { /* same */ };
const DETAIL_PANEL_SX = { /* same */ };

export const CrmDataGrid: React.FC = () => {
  const apiRef = useGridApiRef();
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // ── Store selectors ──────────────────────────────────────
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

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const { scale, font, rem, sc } = useScaling();

  const rows = useMemo(() => buildGridRows(paginatedStudents), [paginatedStudents]);

  const dataColumns = useMemo(
    () =>
      calculateColumnWidths(ALL_COLUMNS, rows, {
        charWidth: 8 * scale,
        padding: 16 * scale,
        minWidth: 40 * scale,
        maxWidth: 600 * scale,
        includeHeader: true,
        factor: 1.2,
        useFlex: true,
        flexBase: 1,
      }),
    [rows, scale]
  );

  // Custom toggle column definition using the safe component
  const toggleColumn = useMemo(() => ({
    field: '__detail_panel_toggle__',
    type: 'custom' as const,
    headerName: '',
    width: sc(44),
    minWidth: sc(44),
    maxWidth: sc(44),
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<GridRow>) => <CustomToggleCell row={params.row} />,
  }), [sc]);

  const columns = useMemo(() => [toggleColumn, ...dataColumns], [toggleColumn, dataColumns]);

  // Extract column width information for synchronization
  const columnWidths = useMemo(() => {
    return extractColumnWidths(columns);
  }, [columns]);

  const detailPanelExpandedRowIds = useMemo<Set<GridRowId>>(
    () => new Set<GridRowId>(expandedRowIds),
    [expandedRowIds]
  );

  const getDetailPanelContent = useCallback(
    (params: GridRowParams<GridRow>) => {
      const row = params.row;
      if (row._student.opportunities.length === 0) return null;
      return (
        <OppDetailPanel
          student={row._student}
          parentColumnWidths={columnWidths}
          containerRef={gridContainerRef}
        />
      );
    },
    [columnWidths]
  );

  const getDetailPanelHeight = useCallback(
    (params: GridRowParams<GridRow>) => {
      const count = params.row._student.opportunities.length;
      if (count === 0) return 0;
      const contentHeight = 30 * scale + count * 28 * scale;
      return Math.min(contentHeight, 600 * scale);
    },
    [scale]
  );

  const getRowClassName = useCallback(
    (params: GridRowClassNameParams<GridRow>): string => {
      const row = params.row;
      const classes = ['std-group-row', 'cursor-pointer'];
      const isExpanded = expandedRowIds.has(`std::${String(row.std_id)}`);
      const hasOpps = row.opp_count > 0;
      if (hasOpps && isExpanded) classes.push('std-group-row-active');
      return classes.join(' ');
    },
    [expandedRowIds]
  );

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

  const handleRowClick = useCallback(
    (params: GridRowParams<GridRow>) => {
      const row = params.row;
      if (row.opp_count > 0) {
        toggleExpanded(`std::${row.std_id}`);
      }
    },
    [toggleExpanded]
  );

  const handleDetailPanelExpandedRowIdsChange = useCallback(
    (ids: Set<GridRowId>) => {
      const next = new Set<string>(Array.from(ids).map(String));
      const prev = expandedRowIds;
      for (const id of next) {
        if (!prev.has(id)) toggleExpanded(id);
      }
      for (const id of prev) {
        if (!next.has(id)) toggleExpanded(id);
      }
    },
    [expandedRowIds, toggleExpanded]
  );

  const sx = useMemo(
    () => ({
      height: '100%',
      ...ROW_SX,
      ...HEADER_SX,
      ...DETAIL_PANEL_SX,
      border: 'none',
      '& .MuiDataGrid-cell': {
        color: '#000000',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiDataGrid-cell:hover': {
        background: 'rgba(0,0,0,0.015)',
      },
      '& .MuiDataGrid-pinnedColumns--left': {
        boxShadow: '4px 0 12px rgba(0,0,0,0.04)',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        zIndex: 5,
      },
      '& .MuiDataGrid-cell[data-field="opp_count"]': {
        borderRight: '1.5px solid rgba(0,0,0,0.06)',
      },
      '& .MuiDataGrid-columnHeader[data-field="opp_count"]': {
        borderRight: '1.5px solid rgba(0,0,0,0.06)',
      },
      '& .MuiDataGrid-detailPanelToggleCell': {
        color: 'var(--crm-blue, #2B7FD4)',
        paddingLeft: rem(0.5),
        paddingRight: rem(0.5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      '& .MuiDataGrid-detailPanelToggleCell:hover': {
        background: 'transparent',
      },
      '& .MuiDataGrid-columnHeader--detailPanelToggle': {
        background: 'var(--crm-header-bg, #F5F4F1)',
      },
    }),
    [rem]
  );

  return (
    <motion.div
      ref={gridContainerRef}
      className="flex-1 min-h-0 rounded-[8px] border border-[rgba(0,0,0,0.1)] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <DataGridPro<GridRow>
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        showToolbar
        getRowId={(row) => row.id}
        getRowHeight={() => getRowHeight(scale)}
        columnHeaderHeight={sc(36)}
        getRowClassName={getRowClassName}
        autosizeOptions={{
          expand: true,
          includeOutliers: true,
          includeHeaders: true,
        }}
        initialState={
          {
            rowGrouping: { model: [] },
            treeData: { defaultGroupingExpansionDepth: 0 },
          } as GridInitialState & { rowGrouping?: unknown; treeData?: unknown }
        }
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelExpandedRowIds={detailPanelExpandedRowIds}
        onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
        rowCount={totalRows}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPaginationModelChange={handlePaginationChange}
        sortModel={muiSortModel}
        onSortModelChange={handleSortChange}
        columnVisibilityModel={{
          ...columnVisibility,
          std_phone_mobile: isLargeScreen,
          std_passport: isLargeScreen,
        }}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}
        pinnedColumns={{ left: [], right: [] }}
        disableColumnPinning
        density="compact"
        loading={isLoading}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick={false}
        checkboxSelection={false}
        disableColumnFilter={false}
        disableColumnMenu={false}
        disableMultipleColumnsSorting={false}
        slots={{
          toolbar: GridToolbarComposite,
          noRowsOverlay: GridNoRows,
          footer: GridFooterComposite,
        }}
        slotProps={{}}
        rowBufferPx={10}
        columnBufferPx={4}
        sx={sx}
        style={{ fontFamily: 'var(--font-body)', fontSize: font(0.875) }}
        aria-label="Student CRM Pipeline"
      />
    </motion.div>
  );
};