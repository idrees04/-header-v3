// dashboard.tsx
import { createFileRoute } from '@tanstack/react-router';
import { format, isValid, parse } from 'date-fns';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { Tooltip } from '@mui/material';
import { CalendarClock } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

import { AppLayout } from '@/components/AppLayout';
import { AppDataGrid } from '@/components/AppDataGrid';
import { dashboardPayload } from '@/data/dashboardPayload';
import { useSidebarStore } from '@/stores/sidebarStore';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

/* ---------------- TYPES ---------------- */

type SourceRow = (typeof dashboardPayload.data)[number];

type DashboardRow = {
  id: number;
  studentName: string;
  nationality: string;
  programName: string;
  stage: string;
  commenceDate: string;
  commenceDateSort: number;
  institute: string;
  level: string;
  counselor: string;
  crmNumber: string;
  email: string;
  phone: string;
  budget: number;
  budgetUtilization: number; // percentage
};

/* ---------------- HELPERS ---------------- */

const toTitleCase = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

const cleanText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const parseDate = (value: string): Date | null => {
  const parsed = parse(value, 'dd-MMM-yyyy', new Date());
  return isValid(parsed) ? parsed : null;
};

const formatReadableDate = (value: string): string => {
  const parsed = parseDate(value);
  return parsed ? format(parsed, 'dd MMM yyyy') : value;
};

const getDateSortValue = (value: string): number => {
  const parsed = parseDate(value);
  return parsed ? parsed.getTime() : Number.MAX_SAFE_INTEGER;
};

/* ---------------- DATA MAPPER ---------------- */

const createRows = (data: SourceRow[]): DashboardRow[] =>
  data.map((item) => ({
    id: item.id,
    studentName: cleanText(item.std_name ?? ''),
    nationality: toTitleCase(item.std_nationality ?? ''),
    programName: cleanText(item.opp_name ?? ''),
    stage: cleanText(item.opp_salaes_stage ?? item.std_stage ?? ''),
    commenceDate: formatReadableDate(item.opp_commence_date ?? ''),
    commenceDateSort: getDateSortValue(item.opp_commence_date ?? ''),
    institute: cleanText(item.opp_institute_name ?? ''),
    level: cleanText(item.opp_course_level ?? ''),
    counselor: cleanText(item.opp_counselor ?? ''),
    crmNumber: item.std_crm_number ?? '',
    email: item.std_email ?? '',
    phone: item.std_phone_mobile ?? '',
    budget: 10000 + (item.id % 40) * 1000,
    budgetUtilization: 10 + (item.id % 90),
  }));

/* ---------------- PAGE ---------------- */

function DashboardPage() {
  const rows = createRows(dashboardPayload.data);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const collapsed = useSidebarStore((s) => s.collapsed);

  // Monitor container width changes including sidebar transitions
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateWidth);
      resizeObserver.disconnect();
    };
  }, [collapsed]); // Re-run when sidebar collapses/expands

  const columns: GridColDef<DashboardRow>[] = [
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: containerWidth < 768 ? 1.5 : 1.2,
      minWidth: containerWidth < 640 ? 160 : 220,
      renderCell: ({ row, value }) => (
        <Tooltip
          title={`${String(value)} • ${row.crmNumber}`}
          arrow
        >
          <div className="flex gap-1 items-center">
            <span className="font-semibold truncate">{value}</span>
            <span className="text-black text-xs flex-shrink-0">
              {row.crmNumber}
            </span>
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'nationality',
      headerName: 'Nationality',
      flex: 0.7,
      minWidth: 100,
    },
    {
      field: 'programName',
      headerName: 'Program',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Tooltip title={value} arrow>
          <span className="truncate">{value}</span>
        </Tooltip>
      ),
    },
    {
      field: 'stage',
      headerName: 'Stage',
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: 'commenceDate',
      headerName: 'Commence Date',
      flex: 0.8,
      minWidth: 140,
      sortComparator: (_a, _b, paramA, paramB) =>
        (paramA.api.getRow(paramA.id)?.commenceDateSort ?? 0) -
        (paramB.api.getRow(paramB.id)?.commenceDateSort ?? 0),
      renderCell: ({ value }) => (
        <div className="flex items-center gap-2">
          {value && <CalendarClock className="h-4 w-4 flex-shrink-0" />}
          <span className="truncate">{value || ''}</span>
        </div>
      ),
    },
    {
      field: 'level',
      headerName: 'Level',
      flex: 0.7,
      minWidth: 120,
    },
    {
      field: 'counselor',
      headerName: 'Counselor',
      flex: 1,
      minWidth: 140,
      renderCell: ({ value }) => (
        <Tooltip title={value} arrow>
          <span className="truncate">{value}</span>
        </Tooltip>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      renderCell: ({ value }) => (
        <Tooltip title={value} arrow>
          <span className="truncate">{value}</span>
        </Tooltip>
      ),
    },
    {
      field: 'budget',
      headerName: 'Budget',
      flex: 0.9,
      minWidth: 100,
      renderCell: ({ value }) => (
        <div className="font-medium text-foreground">
          ${value.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'budgetUtilization',
      headerName: 'Utilization',
      flex: 0.8,
      minWidth: 160,
      renderCell: ({ value }) => {
        const percent = Math.round(value);
        let color = 'bg-green-500';
        if (percent < 30) color = 'bg-red-500';
        else if (percent < 70) color = 'bg-yellow-500';
        return (
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-300`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-sm font-semibold flex-shrink-0">{percent}%</span>
          </div>
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 0.9,
      minWidth: 130,
    },
  ];

  return (
    <AppLayout>
      <div ref={containerRef} className="w-full h-full min-w-0">
        <div className="w-full px-3 sm:px-4 md:px-6 py-4 lg:py-6">
          <div className="w-full min-w-0">
            <AppDataGrid
              rows={rows}
              columns={columns}
              emptyTitle="No pipeline data"
              emptyDescription="Data will appear here once available."
              gridProps={{
                getRowHeight: () => 64,
                autoHeight: false,
                density: 'comfortable',
                disableColumnMenu: true,
                disableColumnSelector: true,
                disableDensitySelector: true,
                pageSizeOptions: [10, 25, 50, 100],
                initialState: {
                  pagination: { paginationModel: { pageSize: 25 } },
                },
                sx: {
                  '& .MuiDataGrid-main': {
                    width: '100%',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    width: '100%',
                  },
                  '& .MuiDataGrid-cell': {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'hsl(var(--muted))',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}