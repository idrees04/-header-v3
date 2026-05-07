'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  DataGridPro,
  GridToolbar,
  GridRow,
  type DataGridProProps,
  type GridValidRowModel,
  type GridColDef,
  type GridRowProps,
} from '@mui/x-data-grid-pro';
import { Tooltip } from '@mui/material';
import { Database, SearchX } from 'lucide-react';
import { cn } from '@/lib/cn';

type AppDataGridProps<R extends GridValidRowModel> = {
  rows: readonly R[];
  columns: readonly GridColDef<R>[];
  loading?: boolean;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  gridProps?: Omit<
    DataGridProProps<R>,
    'rows' | 'columns' | 'loading'
  >;
};

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border bg-background/80 text-primary shadow-sm">
        <SearchX className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="max-w-md text-sm leading-6 text-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export function AppDataGrid<R extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  className,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting filters or search.',
  gridProps,
}: AppDataGridProps<R>) {
  const processedColumns = React.useMemo<GridColDef<R>[]>(() => {
    return columns.map((col) => {
      if (col.renderCell) return col;
      return {
        ...col,
        renderCell: (params) => {
          if (typeof params.value === 'number') {
            const formatted = params.value.toLocaleString();
            return (
              <Tooltip title={formatted} placement="top" arrow>
                <span className="truncate block w-full text-foreground">
                  {formatted}
                </span>
              </Tooltip>
            );
          }

          const value = params.value == null ? '' : String(params.value);

          if (value.length > 30) {
            return (
              <Tooltip title={value} placement="top" arrow>
                <span className="truncate block w-full text-foreground">
                  {value.substring(0, 30)}...
                </span>
              </Tooltip>
            );
          }

          return (
            <Tooltip title={value} placement="top" arrow>
              <span className="truncate block w-full text-foreground">
                {value}
              </span>
            </Tooltip>
          );
        },
      };
    });
  }, [columns]);

  const MotionRow = React.useCallback(
    (props: GridRowProps) => (
      <motion.div
        whileHover={{
          scale: 1.005,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: { duration: 0.2 },
        }}
        style={{ originX: 0, originY: 0 }}
      >
        <GridRow {...props} />
      </motion.div>
    ),
    []
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'premium-card overflow-hidden rounded-2xl shadow-premium',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Student Data
            </p>
            <p className="text-xs text-foreground">
              Sort, filter, and explore data
            </p>
          </div>
        </div>

        <span className="text-xs text-foreground">
          {rows.length} rows
        </span>
      </div>

      {/* Grid */}
      <div className="p-2">
        <DataGridPro
          rows={rows}
          columns={processedColumns}
          loading={loading}
          autoHeight
          density="comfortable"
          disableRowSelectionOnClick
          pagination
          rowSelection
          pageSizeOptions={[5, 10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
            sorting: {
              sortModel: [{ field: 'commenceDate', sort: 'asc' }],
            },
            pinnedColumns: {
              left: ['studentName'],
            },
            ...gridProps?.initialState,
          }}
          slots={{
            toolbar: GridToolbar,
            row: MotionRow,
            noRowsOverlay: () => (
              <EmptyState
                title={emptyTitle}
                description={emptyDescription}
              />
            ),
            noResultsOverlay: () => (
              <EmptyState
                title="No filtered results"
                description="No rows match the filters."
              />
            ),
            ...gridProps?.slots,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 250 },
            },
            ...gridProps?.slotProps,
          }}
          sx={{
            border: 0,
            width: '100%',
            maxWidth: '100%',

            '& .MuiDataGrid-columnHeaders': {
              fontWeight: 600,
              backgroundColor: 'hsl(var(--muted))',
              borderBottom: '2px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },

            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
              padding: '12px',
              color: 'hsl(var(--foreground))',
              transition: 'background-color 0.2s ease',
            },

            '& .MuiDataGrid-cell:hover': {
              backgroundColor: 'hsl(var(--accent) / 0.3)',
            },

            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'transparent',
            },

            '& .MuiDataGrid': {
              minWidth: '100%',
            },

            '& .MuiDataGrid-virtualScroller': {
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--border)) transparent',
            },

            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
            },

            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
              background: 'transparent',
            },

            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
              background: 'hsl(var(--border))',
              borderRadius: '5px',
            },

            ...gridProps?.sx,
          }}
          {...gridProps}
        />
      </div>
    </motion.section>
  );
}