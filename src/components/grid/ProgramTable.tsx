import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { RoleAvatarsCell } from './RoleAvatarsCell';
import type { Opportunity } from '@/types';
import type { GridRow } from '@/lib/gridRows';

interface ProgramTableProps {
    programs: Opportunity[];
}

const programColumns: GridColDef[] = [
    {
        field: 'opp_name',
        headerName: 'PROGRAM',
        width: 210,
        minWidth: 140,
        sortable: false,
    },
    {
        field: 'opp_institute_name',
        headerName: 'INSTITUTE',
        width: 172,
        sortable: false,
    },
    {
        field: 'opp_course_level',
        headerName: 'LEVEL',
        width: 64,
        sortable: false,
    },
    {
        field: 'opp_salaes_stage',
        headerName: 'OPP STAGE',
        width: 128,
        sortable: false,
    },
    {
        field: 'roles_avatars',
        headerName: 'ROLES',
        width: 160,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams<Opportunity>) => {
            // Create a dummy student object to satisfy GridRow type
            const dummyStudent = {
                std_id: '',
                std_name: '',
                std_nationality: '',
                std_crm_number: '',
                std_phone_mobile: '',
                std_gender: '',
                std_passport: '',
                std_dob: '',
                std_stage: '',
                std_counselor: params.row.opp_counselor || '',
                std_adm_officer: params.row.opp_adm_officer || '',
                std_office: params.row.opp_office || '',
                std_subagent: params.row.opp_subagent || '',
                std_date_entered: '',
                std_email: '',
                std_created_by: null,
                std_lead_source: null,
                opportunities: []
            };

            const row: GridRow = {
                id: params.row.opp_id || '',
                kind: 'student',
                path: [],
                std_id: '',
                std_name: '',
                std_nationality: '',
                std_crm_number: '',
                std_phone_mobile: '',
                std_gender: '',
                std_passport: '',
                std_dob: '',
                std_stage: '',
                std_counselor: params.row.opp_counselor || '',
                std_adm_officer: params.row.opp_adm_officer || '',
                std_office: params.row.opp_office || '',
                std_subagent: params.row.opp_subagent || '',
                std_date_entered: '',
                std_email: '',
                opp_count: 0,
                _student: dummyStudent as any, // cast to satisfy type
            };
            return <RoleAvatarsCell {...params} row={row} />;
        }
    },
];

export const ProgramTable: React.FC<ProgramTableProps> = ({ programs }) => {
    return (
        <div className="ml-8 my-2 border-l-2 border-gray-200 pl-4">
            <DataGrid
                rows={programs}
                columns={programColumns}
                density="compact"
                hideFooter
                autoHeight
                rowHeight={28}
                sx={{
                    '& .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: 'none',
                        backgroundColor: 'var(--crm-header-bg)',
                    },
                    '& .MuiDataGrid-row': {
                        backgroundColor: 'var(--crm-row-opp-bg)',
                    },
                    fontFamily: 'var(--font-body)',
                    fontSize: '11.5px'
                }}
            />
        </div>
    );
};
