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
    headerName: 'STUDENT',
    width: 220,
    minWidth: 180,
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
    headerName: 'NAT.',
    width: 75,
    sortable: true,
    priority: 3,
    renderCell: (p: GridRenderCellParams<GridRow>) => <NatCell {...p} />,
  },
  {
    field: 'std_gender',
    headerName: 'G',
    width: 36,
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
  // {
  //   field: 'std_phone_mobile',
  //   headerName: 'PHONE',
  //   width: 110,
  //   sortable: false,
  //   priority: 4,
  //   renderCell: (p: GridRenderCellParams<GridRow>) => <PhoneCell {...p} />,
  // },
  {
    field: 'std_email',
    headerName: 'EMAIL',
    width: 160,
    sortable: false,
    priority: 4,
    renderCell: (p: GridRenderCellParams<GridRow>) => <EmailCell {...p} />,
  },
  //   {
  //   field: 'std_passport',
  //   headerName: 'PASSPORT',
  //   width: 100,
  //   sortable: false,
  //   priority: 4,
  //   renderCell: (p: GridRenderCellParams<GridRow>) => <PassportCell {...p} />,
  // },
  {
    field: 'roles_avatars',
    headerName: 'Std. Office',
    width: 160,
    sortable: false,
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
    priority: 3,
    renderCell: (p: GridRenderCellParams<GridRow>) => {
      const row = p.row as GridRow;
      return (
        <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">
          {row.std_date_entered || '—'}
        </span>
      );
    },
  },
  {
    field: 'std_stage',
    headerName: 'STAGE',
    width: 148,
    sortable: false,
    priority: 2,
    renderCell: (p: GridRenderCellParams<GridRow>) => <StudentStageCell {...p} />,
  },
  {
    field: 'opp_count',
    headerName: 'APPS',
    width: 52,
    sortable: true,
    priority: 2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <OppCountCell {...p} />,
  },
  {
    field: 'std_subagent',
    headerName: 'Sub-Agent',
    width: 90,
    sortable: true,
    priority: 2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (p: GridRenderCellParams<GridRow>) => <StudentSubAgent {...p} />,
  },
];
