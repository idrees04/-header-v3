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
import { PAGE_SIZE_OPTIONS, useDashboardStore } from '@/store/dashboardStore';
import { buildGridRows, type GridRow } from '../../lib/gridRows';
import { ALL_COLUMNS, COLUMN_GROUPS } from './ColumnDefs';
import { GridToolbarComposite } from './GridToolbarComposite';
import { GridNoRows } from './GridNoRows';
import { GridFooterComposite } from './GridFooterComposite';

// ── Row height getter ─────────────────────────────────────
const getRowHeight = (params: { model: GridRow }) =>
  params.model.kind === 'student' ? 32 : 28;

// ── Row class names ───────────────────────────────────────
// const getRowClassName = (params: GridRowClassNameParams<GridRow>): string => {
//   const row = params.row as GridRow;
//   const classes: string[] = [];
//   if (row.kind === 'student') classes.push('std-group-row cursor-pointer');
//   if (row.kind === 'opportunity') classes.push('opp-child-row');
//   if (row.kind === 'opportunity' && row.isLastOpp) classes.push('opp-last-child');
//   if (row.kind === 'opportunity') classes.push('opp-indent-border');
//   return classes.join(' ');
// };

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

  // Active / Expanded row (RED)
  '&.std-group-row-active, &.std-group-row-active .MuiDataGrid-cell, &.std-group-row-active .MuiDataGrid-cell--pinnedLeft':
  {
    backgroundColor: '#FEE2E2 !important',
  },


  '&.std-group-row-active:hover, &.std-group-row-active:hover .MuiDataGrid-cell, &.std-group-row-active:hover .MuiDataGrid-cell--pinnedLeft':
  {
    backgroundColor: '#FECACA !important',
  },

  '&.opp-child-row': {
    background: 'var(--crm-row-opp-bg)',
    '& .MuiDataGrid-cell:first-of-type': {
      borderLeft: '2.5px solid rgba(43,127,212,0.28)',
    },
  },
  // '&.opp-child-row': {
  //   background: 'var(--crm-row-opp-bg)',
  // },
  '& .opp-section-header .MuiDataGrid-cell': {
    backgroundColor: '#F0EFEB !important',
    fontWeight: 700,
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(0,0,0,0.15)',
  },
  '& .opp-child-row-even .MuiDataGrid-cell': {
    backgroundColor: '#FFFFFF !important',
  },

  '& .opp-child-row-odd .MuiDataGrid-cell': {
    backgroundColor: '#EDECE8 !important',
  },

  '&.opp-last-child': {
    borderBottom: '2px solid rgba(0,0,0,0.1) !important',
  },
  '& .opp-group-first .MuiDataGrid-cell': {
    borderTop: '1px solid oklch(71.5% 0.143 215.221) !important',
  },

  '& .opp-group-last .MuiDataGrid-cell': {
    borderBottom: '1px solid oklch(71.5% 0.143 215.221) !important',
  },

  '& .opp-child-row .MuiDataGrid-cell:first-of-type': {
    borderLeft: '1px solid oklch(71.5% 0.143 215.221) !important',
  },

  '& .opp-group-first .MuiDataGrid-cell:first-of-type': {
    borderTopLeftRadius: '2px',
  },

  '& .opp-group-first .MuiDataGrid-cell:last-of-type': {
    borderTopRightRadius: '2px',
  },

  '& .opp-group-last .MuiDataGrid-cell:first-of-type': {
    borderBottomLeftRadius: '2px',
  },

  '& .opp-group-last .MuiDataGrid-cell:last-of-type': {
    borderBottomRightRadius: '2px',
  },
  '&.std-group-row:hover': {
    background: '#EFF0EE',
    transform: 'scaleY(1.005)',
    transformOrigin: 'center',
    boxShadow:
      '0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
    zIndex: 1,
    position: 'relative',
    transition:
      'transform 150ms cubic-bezier(0.22,1,0.36,1), box-shadow 150ms cubic-bezier(0.22,1,0.36,1), background 150ms',
  },

  '&.opp-child-row:hover': {
    background: '#F5F4F1',
    transition: 'background 150ms',
  },

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

  const getRowClassName = (params: GridRowClassNameParams<GridRow>): string => {
    const row = params.row;
    const classes: string[] = [];

    if (row.kind === 'student') {
      classes.push('std-group-row', 'cursor-pointer');

      const hasChildren = row.opp_count > 0;
      const isExpanded = expandedRowIds.has(`std::${String(row.std_id)}`);

      if (hasChildren && isExpanded) {
        classes.push('std-group-row-active');
      }
    }

    if (row.kind === 'opportunity') {
      classes.push('opp-child-row', 'opp-indent-border');

      if (row.opp_row_index != null) {
        classes.push(
          row.opp_row_index % 2 === 0
            ? 'opp-child-row-even'
            : 'opp-child-row-odd'
        );
      }

      // 🔥 GROUP BORDER LOGIC
      if (row.opp_row_index === 0) {
        classes.push('opp-group-first');
      }

      if (row.isLastOpp) {
        classes.push('opp-group-last');
        classes.push('opp-last-child');
      }

      // middle rows
      if (row?.opp_row_index > 0 && !row.isLastOpp) {
        classes.push('opp-group-middle');
      }
    }
    if (row.kind === 'opp_header') {
      classes.push('opp-section-header');
    }

    return classes.join(' ');
  };
  // Build flat rows from paginated students (memoized)
  const rows = useMemo(
    () => buildGridRows(paginatedStudents),
    [paginatedStudents]
  );

  // Filtered rows: only show student rows + expanded children
  const visibleRows = useMemo((): GridRow[] => {
    const out: GridRow[] = [];

    for (const row of rows) {
      const parentId = `std::${row.std_id}`;
      const isExpanded = expandedRowIds.has(parentId);

      // 1️⃣ Always show student row
      if (row.kind === 'student') {
        out.push(row);
        continue;
      }

      // 2️⃣ Header row (Opportunity Detail)
      if (row.kind === 'opp_header') {
        if (isExpanded) {
          out.push(row);
        }
        continue;
      }

      // 3️⃣ Opportunity rows
      if (row.kind === 'opportunity') {
        if (isExpanded) {
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
  const sx = useMemo(
    () => ({
      height: '100%',
      ...ROW_SX,
      ...COL_GROUP_SX,
      // Column header text
      '& .MuiDataGrid-columnHeaderTitle': {
        color: '#18181A !important',
      },

      // Cell hover
      '& .MuiDataGrid-cell:hover': {
        background: 'rgba(0,0,0,0.02)',
      },

      // Active sorted column header
      '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-columnHeaderTitle': {
        color: 'var(--crm-blue) !important',
      },

      // Pinned columns container
      '& .MuiDataGrid-pinnedColumns--left': {
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        borderRight: '1px solid rgba(0,0,0,0.1)',
      },

      // Divider after student section
      '& .MuiDataGrid-cell[data-field="opp_count"]': {
        borderRight: '1.5px solid rgba(0,0,0,0.08)',
      },

      '& .MuiDataGrid-columnHeader[data-field="opp_count"]': {
        borderRight: '1.5px solid rgba(0,0,0,0.08)',
      },

      // Optional: ensure pinned cells inherit row hover for normal student rows
      '& .std-group-row:hover .MuiDataGrid-cell--pinnedLeft': {
        backgroundColor: '#EFF0EE !important',
      },
      '& .std-group-row:active .MuiDataGrid-cell--pinnedLeft': {
        backgroundColor: '#CFFAFE !important',
      },
      '& .std-group-row-active .MuiDataGrid-cell--pinnedLeft': {
        backgroundColor: '#CFFAFE !important',
      },

      '& .std-group-row-active': {
        backgroundColor: '#CFFAFE !important', // cyan-100
      },

      '& .std-group-row-active .MuiDataGrid-cell': {
        backgroundColor: '#CFFAFE !important',
      },



      // Optional: ensure pinned cells inherit opportunity hover
      '& .opp-child-row:hover .MuiDataGrid-cell--pinnedLeft': {
        backgroundColor: '#F5F4F1 !important',
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
        rows={visibleRows}
        columns={ALL_COLUMNS}
        columnGroupingModel={columnGroupingModel}
        showToolbar
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
