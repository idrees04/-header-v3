import { createFileRoute } from '@tanstack/react-router';
import { format, isValid, parse } from 'date-fns';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { Tooltip, LinearProgress, Chip } from '@mui/material';
import { CalendarClock, DollarSign, TrendingUp, User, Building, Flag, Phone, Mail } from 'lucide-react';

import { AppLayout } from '@/components/AppLayout';
import { AppDataGrid } from '@/components/AppDataGrid';
import { dashboardPayload } from '@/data/dashboardPayload';

export const Route = createFileRoute('/ceo/students-new')({
    component: StudentsNewPage,
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

function StudentsNewPage() {
    const rows = createRows(dashboardPayload.data);

    const columns: GridColDef<StudentRow>[] = [
        {
            field: 'studentName',
            headerName: 'Student',
            flex: 1.2,
            minWidth: 220,
            renderCell: ({ row, value }) => (
                <div className="flex items-center gap-3">
                    {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                    </div> */}
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">{value}</span>
                        <span className="text-xs text-muted-foreground">{row.crmNumber}</span>
                    </div>
                </div>
            ),
        },
        {
            field: 'nationality',
            headerName: 'Nationality',
            flex: 0.7,
            minWidth: 130,
            renderCell: ({ value }) => (
                <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            field: 'programName',
            headerName: 'Program',
            flex: 1.3,
            minWidth: 250,
            renderCell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.programName}</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        <span>{row.institute}</span>
                    </div>
                </div>
            ),
        },
        {
            field: 'stage',
            headerName: 'Stage',
            flex: 0.8,
            minWidth: 150,
            renderCell: ({ value }) => {
                const isCommenced = value.includes('Commenced');
                return (
                    <Chip
                        label={value}
                        size="small"
                        color={isCommenced ? 'success' : 'warning'}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                );
            },
        },
        {
            field: 'commenceDate',
            headerName: 'Commence Date',
            flex: 0.8,
            minWidth: 160,
            renderCell: ({ value }) => (
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span className="font-medium">{value}</span>
                </div>
            ),
        },
        {
            field: 'budget',
            headerName: 'Budget',
            flex: 0.9,
            minWidth: 140,
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
                            <span className="text-muted-foreground">Used</span>
                            <span className="font-semibold">{percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor: percent > 70 ? '#10b981' : percent > 30 ? '#f59e0b' : '#ef4444',
                                }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            field: 'email',
            headerName: 'Contact',
            flex: 1.1,
            minWidth: 200,
            renderCell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm truncate">{row.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{row.phone}</span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            {/* No padding container */}
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="mx-auto" style={{ maxWidth: 'calc(100% - 2rem)' }}>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            All Students
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Comprehensive overview of student.
                        </p>
                    </div>

                    {/* Grid with no outer padding */}
                    <AppDataGrid
                        rows={rows}
                        columns={columns}
                        emptyTitle="No student records"
                        emptyDescription="Add new students to see them here."
                        gridProps={{
                            getRowHeight: () => 68,
                            sx: {
                                border: 0,
                                borderRadius: 0,
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'hsl(var(--muted))',
                                    borderBottom: '2px solid hsl(var(--border))',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: 'hsl(var(--foreground))',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderColor: 'hsl(var(--border) / 0.2)',
                                    fontSize: '0.875rem',
                                    padding: '10px 16px',
                                },
                                '& .MuiDataGrid-row': {
                                    transition: 'all 0.25s ease',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'hsl(var(--accent) / 0.3)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
                                },
                                '& .MuiDataGrid-virtualScroller': {
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'hsl(var(--primary)) transparent',
                                },
                            },
                        }}
                        className="shadow-none"
                    />
                </div>
            </div>
        </AppLayout>
    );
}