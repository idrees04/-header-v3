import { createFileRoute } from '@tanstack/react-router';
import { format, isValid, parse } from 'date-fns';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { Tooltip, LinearProgress } from '@mui/material';
import { CalendarClock, TrendingUp, DollarSign, Target, Users } from 'lucide-react';

import { AppLayout } from '@/components/AppLayout';
import { AppDataGrid } from '@/components/AppDataGrid';
import { dashboardPayload } from '@/data/dashboardPayload';

export const Route = createFileRoute('/ceo/all-programs')({
    component: AllStudentsPage,
});

/* ---------------- TYPES ---------------- */

type SourceRow = (typeof dashboardPayload.data)[number];

type StudentRow = {
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
    budgetUtilization: number;
    forecast: number;
    risk: 'Low' | 'Medium' | 'High';
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

const getRisk = (id: number): 'Low' | 'Medium' | 'High' => {
    const mod = id % 3;
    if (mod === 0) return 'Low';
    if (mod === 1) return 'Medium';
    return 'High';
};

/* ---------------- DATA MAPPER ---------------- */

const createRows = (data: SourceRow[]): StudentRow[] =>
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
        forecast: 5000 + (item.id % 30) * 500,
        risk: getRisk(item.id),
    }));

/* ---------------- PAGE ---------------- */

function AllStudentsPage() {
    const rows = createRows(dashboardPayload.data);

    const columns: GridColDef<StudentRow>[] = [
        {
            field: 'studentName',
            headerName: 'Student',
            flex: 1,
            minWidth: 200,
            renderCell: ({ row, value }) => (
                <Tooltip title={`${row.crmNumber} • ${row.email}`} arrow>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">{value}</span>
                        <span className="text-xs text-muted-foreground">{row.nationality}</span>
                    </div>
                </Tooltip>
            ),
        },
        {
            field: 'programName',
            headerName: 'Program & Institute',
            flex: 1.5,
            minWidth: 280,
            renderCell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.programName}</span>
                    <span className="text-sm text-muted-foreground">{row.institute}</span>
                </div>
            ),
        },
        {
            field: 'stage',
            headerName: 'Stage',
            flex: 0.7,
            minWidth: 140,
            renderCell: ({ value }) => (
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${value.includes('Commenced') ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            field: 'commenceDate',
            headerName: 'Commence',
            flex: 0.7,
            minWidth: 140,
            renderCell: ({ value }) => (
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            field: 'budget',
            headerName: 'Budget',
            flex: 0.9,
            minWidth: 150,
            renderCell: ({ value }) => (
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold">${value.toLocaleString()}</span>
                </div>
            ),
        },
        {
            field: 'budgetUtilization',
            headerName: 'Utilization',
            flex: 1,
            minWidth: 180,
            renderCell: ({ value }) => {
                const percent = Math.round(value);
                return (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-semibold">{percent}%</span>
                        </div>
                        <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'hsl(var(--muted))',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: percent > 70 ? '#10b981' : percent > 30 ? '#f59e0b' : '#ef4444',
                                },
                            }}
                        />
                    </div>
                );
            },
        },
        {
            field: 'forecast',
            headerName: 'Forecast',
            flex: 0.8,
            minWidth: 140,
            renderCell: ({ value }) => (
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">${value.toLocaleString()}</span>
                </div>
            ),
        },
        {
            field: 'risk',
            headerName: 'Risk',
            flex: 0.6,
            minWidth: 120,
            renderCell: (params) => {
                const value = params.value as StudentRow['risk'];
                const colorMap = {
                    Low: 'bg-green-100 text-green-800 border-green-300',
                    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    High: 'bg-red-100 text-red-800 border-red-300',
                };
                return (
                    <div className={`px-3 py-1 rounded-full border text-xs font-bold text-center ${colorMap[value]}`}>
                        {value}
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        All Students 1
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Comprehensive overview of student.
                    </p>
                </div>

                {/* Grid */}
                <AppDataGrid
                    rows={rows}
                    columns={columns}
                    emptyTitle="No student data"
                    emptyDescription="Data will appear here once available."
                    gridProps={{
                        getRowHeight: () => 70,
                        sx: {
                            border: 0,
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            backgroundColor: 'hsl(var(--card))',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'hsl(var(--muted))',
                                borderBottom: '2px solid hsl(var(--border))',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: 'hsl(var(--foreground))',
                            },
                            '& .MuiDataGrid-cell': {
                                borderColor: 'hsl(var(--border) / 0.3)',
                                fontSize: '0.875rem',
                            },
                            '& .MuiDataGrid-row': {
                                transition: 'all 0.3s ease',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: 'hsl(var(--accent) / 0.4)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'hsl(var(--primary)) transparent',
                            },
                        },
                    }}
                    className="shadow-2xl border border-border"
                />
            </div>
        </AppLayout>
    );
}