import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { GridRow } from '../../lib/gridRows';
import {
  NameCell,
  CrmCell,
  GenderCell,
  NatCell,
  StudentStageCell,
  OppCountCell,
  DateCell,
  PhoneCell,
  EmailCell,
  PassportCell,
  StudentSubAgent,
  EnrolledCell,
} from './CellRenderers';
import { RoleAvatarsCell } from './RoleAvatarsCell';

/**
 * Column definitions for the Student CRM DataGrid.
 *
 * Only student-level columns are defined here.
 * Opportunity detail is rendered via OppDetailPanel (DataGrid detail panel).
 */

export type CrmColDef = GridColDef & {
  priority?: number; // 1 = always visible, 5 = hide first on small screens
};

// ── STUDENT COLUMNS ────────────────────────────────────────────────────────
export const ALL_COLUMNS: CrmColDef[] = [
  {
    field: 'std_name',
    headerName: 'Student',
    flex: 2.8,
    minWidth: 220,
    sortable: true,
    pinnable: true,
    priority: 1,
    renderCell: (p: GridRenderCellParams<GridRow>) => <NameCell {...p} />,
  },
  // {
  //   field: 'std_crm_number',
  //   headerName: 'CRM #',
  //   width: 120,
  //   sortable: true,
  //   pinnable: true,
  //   priority: 1,
  //   renderCell: (p: GridRenderCellParams<GridRow>) => <CrmCell {...p} />,
  // },
  {
    field: 'std_nationality',
    headerName: 'Nationality',
    flex: 0.9,
    minWidth: 85,
    sortable: true,
    priority: 3,
    renderCell: (p: GridRenderCellParams<GridRow>) => <NatCell {...p} />,
  },
  {
    field: 'std_gender',
    headerName: 'Gender',
    flex: 0.5,
    minWidth: 50,
    sortable: false,
    priority: 4,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <GenderCell {...p} />,
  },
  // {
  //   field: 'std_dob',
  //   headerName: 'DOB',
  //   width: 92,
  //   sortable: false,
  //   priority: 4,
  //   renderCell: (p: GridRenderCellParams<GridRow>) => <DateCell {...p} field="std_dob" />,
  // },
  {
    field: 'std_phone_mobile',
    headerName: 'Phone',
    flex: 1.5,
    minWidth: 140,
    sortable: false,
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => <PhoneCell {...p} />,
  },
  {
    field: 'std_email',
    headerName: 'Email',
    flex: 2.2,
    minWidth: 180,
    sortable: false,
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => <EmailCell {...p} />,
  },
  {
    field: 'std_passport',
    headerName: 'Passport',
    flex: 1.1,
    minWidth: 110,
    sortable: false,
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => <PassportCell {...p} />,
  },
  {
    field: 'roles_avatars',
    headerName: 'Student Info.',
    flex: 1.6,
    minWidth: 150,
    sortable: false,
    priority: 2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <RoleAvatarsCell {...p} />,
  },
  {
    field: 'std_date_entered',
    headerName: 'Enrolled',
    flex: 1.0,
    minWidth: 100,
    sortable: true,
    priority: 3,
    renderCell: (p: GridRenderCellParams<GridRow>) => <EnrolledCell {...p} />,
  },
  {
    field: 'std_stage',
    headerName: 'Stage',
    flex: 2.0,
    minWidth: 200,
    sortable: false,
    priority: 2,
    renderCell: (p: GridRenderCellParams<GridRow>) => <StudentStageCell {...p} />,
  },
  {
    field: 'opp_count',
    headerName: 'Program',
    flex: 0.7,
    minWidth: 60,
    sortable: true,
    priority: 2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <OppCountCell {...p} />,
  },
  {
    field: 'std_subagent',
    headerName: 'Sub-Agent',
    flex: 1.3,
    minWidth: 140,
    sortable: true,
    priority: 2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <StudentSubAgent {...p} />,
  },
];
