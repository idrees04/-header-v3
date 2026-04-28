import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { GridRow } from '../../lib/gridRows';
import {
  NameCell, CrmCell, GenderCell, NatCell, StudentStageCell,
  OppStageCell, LevelCell, OppCountCell, TextCell, DateCell,
  ProgramCell, InstituteCell,EmailCell,PhoneCell
} from './CellRenderers';
import { RoleAvatarsCell } from './RoleAvatarsCell';

/**
 * Composite Column Definition Pattern:
 * Each column is a self-contained descriptor with:
 * - field, headerName, width (content-aware)
 * - renderCell (memoized)
 * - groupId for MUI column grouping
 * - pinnable, hideable, priority (for adaptive visibility)
 */

export type CrmColDef = GridColDef & {
  groupId?: 'student' | 'opportunity';
  priority?: number;   // 1 = always visible, 5 = hide first on small screens
};

// ── STUDENT GROUP ─────────────────────────────────────────
const studentColumns: CrmColDef[] = [
  {
    field: 'std_name',
    headerName: 'STUDENT / PROGRAM',
    width: 220,
    minWidth: 180,
    sortable: true,
    pinnable: true,
    groupId: 'student',
    priority: 1,
    renderCell: (p: GridRenderCellParams<GridRow>) => <NameCell {...p} />,
  },
  // {
  //   field: 'std_crm_number',
  //   headerName: 'CRM #',
  //   width: 132,
  //   sortable: true,
  //   pinnable: true,
  //   groupId: 'student',
  //   priority: 1,
  //   renderCell: (p: GridRenderCellParams<GridRow>) => <CrmCell {...p} />,
  // },
  {
    field: 'std_nationality',
    headerName: 'NAT.',
    width: 75,
    sortable: true,
    groupId: 'student',
    priority: 3,
    renderCell: (p: GridRenderCellParams<GridRow>) => <NatCell {...p} />,
  },
  {
    field: 'std_gender',
    headerName: 'G',
    width: 36,
    sortable: false,
    groupId: 'student',
    priority: 4,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <GenderCell {...p} />,
  },
  {
    field: 'std_dob',
    headerName: 'DOB',
    width: 92,
    sortable: false,
    groupId: 'student',
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => <DateCell {...p} field="std_dob" />,
  },
  {
    field: 'std_phone_mobile',
    headerName: 'Phone',
    width: 92,
    sortable: false,
    groupId: 'student',
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => <PhoneCell {...p} field="std_phone_mobile" />,
  },
  {
    field: 'std_email',
    headerName: 'Email',
    width: 92,
    sortable: false,
    groupId: 'student',
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => <EmailCell {...p} field="std_email" />,
  },
  {
    field: 'roles_avatars',
    headerName: 'Std.Info',
    width: 160,
    sortable: false,
    groupId: 'student',
    priority: 2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <RoleAvatarsCell {...p} />,
  },
  {
    field: 'std_date_entered',
    headerName: 'ENROLLED',
    width: 90,
    sortable: true,
    groupId: 'student',
    priority: 3,
    renderCell: (p: GridRenderCellParams<GridRow>) => {
      const row = p.row as GridRow;
      if (row.kind !== 'student') return null;
      return <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">{row.std_date_entered}</span>;
    },
  },
  {
    field: 'std_stage',
    headerName: 'STUDENT STAGE',
    width: 148,
    sortable: false,
    groupId: 'student',
    priority: 2,
    renderCell: (p: GridRenderCellParams<GridRow>) => <StudentStageCell {...p} />,
  },
  {
    field: 'opp_count',
    headerName: 'OPPS',
    width: 52,
    sortable: true,
    groupId: 'student',
    priority: 2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <OppCountCell {...p} />,
  },
];

// ── OPPORTUNITY GROUP ─────────────────────────────────────
const opportunityColumns: CrmColDef[] = [
  {
    field: 'opp_name',
    headerName: 'PROGRAM',
    width: 210,
    minWidth: 140,
    sortable: false,
    groupId: 'opportunity',
    priority: 1,
    renderCell: (p: GridRenderCellParams<GridRow>) => <ProgramCell {...p} />,
  },
  {
    field: 'opp_institute_name',
    headerName: 'INSTITUTE',
    width: 172,
    sortable: false,
    groupId: 'opportunity',
    priority: 1,
    renderCell: (p: GridRenderCellParams<GridRow>) => <InstituteCell {...p} />,
  },
  {
    field: 'opp_course_level',
    headerName: 'LEVEL',
    width: 64,
    sortable: false,
    groupId: 'opportunity',
    priority: 2,
    renderCell: (p: GridRenderCellParams<GridRow>) => <LevelCell {...p} />,
  },
  {
    field: 'opp_salaes_stage',
    headerName: 'OPP STAGE',
    width: 128,
    sortable: false,
    groupId: 'opportunity',
    priority: 1,
    renderCell: (p: GridRenderCellParams<GridRow>) => <OppStageCell {...p} />,
  },
  {
    field: 'opp_commence_date',
    headerName: 'COMMENCE',
    width: 96,
    sortable: false,
    groupId: 'opportunity',
    priority: 2,
    renderCell: (p: GridRenderCellParams<GridRow>) => {
      const row = p.row as GridRow;
      if (row.kind !== 'opportunity') return null;
      return <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">{row.opp_commence_date ?? '—'}</span>;
    },
  },
  {
    field: 'opp_last_stage_change_date',
    headerName: 'LAST CHANGE',
    width: 96,
    sortable: false,
    groupId: 'opportunity',
    priority: 3,
    renderCell: (p: GridRenderCellParams<GridRow>) => {
      const row = p.row as GridRow;
      if (row.kind !== 'opportunity') return null;
      return <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">{row.opp_last_stage_change_date ?? '—'}</span>;
    },
  },
  {
    field: 'opp_date_entered',
    headerName: 'OPP ENTERED',
    width: 96,
    sortable: false,
    groupId: 'opportunity',
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => {
      const row = p.row as GridRow;
      if (row.kind !== 'opportunity') return null;
      return <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">{row.opp_date_entered ?? '—'}</span>;
    },
  },
];

export const ALL_COLUMNS: CrmColDef[] = [...studentColumns, ...opportunityColumns];

// Column group definitions for MUI DataGrid Pro column grouping
export const COLUMN_GROUPS = [
  {
    groupId: 'student',
    headerName: '◈ Student Record',
    children: studentColumns.map(c => ({ field: c.field })),
  },
  {
    groupId: 'opportunity',
    headerName: '◈ Opportunity Detail',
    children: opportunityColumns.map(c => ({ field: c.field })),
  },
];
