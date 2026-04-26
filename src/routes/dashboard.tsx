import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/AppLayout';
import Box from '@mui/material/Box';
import { DataGridPro, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { dashboardPayload } from '@/data/dashboardPayload';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useGridApiContext, GRID_DETAIL_PANEL_TOGGLE_COL_DEF } from '@mui/x-data-grid-pro';
import { useGridApiRef, GridRowId } from '@mui/x-data-grid-pro';
import Tooltip from '@mui/material/Tooltip';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

const renderDash = (value: any) =>
  value === null || value === undefined || value === '' ? '-' : String(value);

const getUniqueStudents = (data: any[]) => {
  const grouped = new Map<string, any[]>();

  data.forEach((item) => {
    if (!grouped.has(item.std_id)) {
      grouped.set(item.std_id, []);
    }
    grouped.get(item.std_id)!.push(item);
  });

  const uniqueStudents: any[] = [];

  grouped.forEach((records) => {
    uniqueStudents.push({
      ...records[0],
      id: records[0].std_id,
      _duplicates: records.slice(1),
    });
  });

  return uniqueStudents;
};

const genderColors: Record<string, { bg: string; color: string }> = {
  'male': { bg: '#E6F1FB', color: '#185FA5' },
  'female': { bg: '#FDE8F5', color: '#7A2260' },
};
const courseLevelColors: Record<string, { bg: string; color: string }> = {
  'Foundation': { bg: '#FFF4CC', color: '#854F0B' },
  'Undergraduate': { bg: '#E6F1FB', color: '#185FA5' },
  'Language Course': { bg: '#E1F5EE', color: '#0F6E56' },
  'Postgraduate': { bg: '#EEEDFE', color: '#534AB7' },
};

const baseColumns: GridColDef[] = [
  // {
  //   field: 'std_id',
  //   headerName: 'Student Id',
  //   width: 100,
  //   renderCell: (params: GridRenderCellParams) => {
  //     const fullId = params.value ?? '';
  //     const shortId = String(fullId).split('-')[0];
  //     return (
  //       <Tooltip title={fullId} placement="top" arrow>
  //         <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
  //           {shortId}
  //         </span>
  //       </Tooltip>
  //     );
  //   },
  // },
  {
    field: 'std_name',
    headerName: 'Student Name',
    width: 180,
    renderCell: (params: GridRenderCellParams) => {
      const name = params.value ?? '-';
      return (
        <Tooltip title={name} placement="top" arrow>
          <span
            style={{
              display: 'flex',
              flexDirection:'row',
              alignItems: 'start',
              justifyContent: 'left',
              textAlign: 'start',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
        </Tooltip>
      );
    },
  },
  { field: 'std_nationality', headerName: 'Nationality', width: 100 },
  { field: 'std_crm_number', headerName: 'Crm Number', width: 110 },
  { field: 'std_phone_mobile', headerName: 'Phone Number', width: 124 },
  {
    field: 'std_gender',
    headerName: 'Gender',
    width: 90,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.value;
      if (!value) return '-';
      const style = genderColors[value] ?? { bg: '#F1EFE8', color: '#5F5E5A' };
      return (
        <Tooltip title={value} placement="top" arrow>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width:"80px",
              height: '25px',
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: style.bg,
              color: style.color,
              fontSize: '12px',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}


          >
            {value === 'female' ? "Female" : "Male"}
          </span>
        </Tooltip>
      );
    },
  },
  { field: 'std_passport', headerName: 'Passport', width: 100 },
  {
    field: 'std_dob',
    headerName: 'DOB',
    width: 85,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.value;
      if (!value) return '-';
      try {
        const date = new Date(value);
        const formatted = new Intl.DateTimeFormat('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(date);
        return (
          <Tooltip title={formatted} placement="top" arrow>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {formatted}
            </span>
          </Tooltip>
        );
      } catch (e) {
        return '-';
      }
    },
  },
  { field: 'std_stage', headerName: 'Student Stage', width: 120 },
  { field: 'std_counselor', headerName: 'Counselor', width: 90 },
  { field: 'std_counselor_uname', headerName: 'Counselor Name', width: 135 },
  { field: 'std_adm_officer', headerName: 'Admin Officer', width: 114 },
  { field: 'std_adm_officer_uname', headerName: 'Admin Officer Name', width:160 },
  { field: 'std_office', headerName: 'Office', width: 70 },
  { field: 'std_subagent', headerName: 'Subagent', width: 90 },
  { field: 'std_date_entered', headerName: 'Data Entered', width: 110 },
  // { field: 'std_date_entered_year', headerName: 'Date Entered Year', width: 140 },
  // { field: 'std_date_entered_month', headerName: 'Date Entered Month', width: 100 },
  { field: 'std_email', headerName: 'Email', width: 100 },
  // { field: 'opp_id', headerName: 'Opp Id', width: 100 },
  { field: 'opp_name', headerName: 'Opp Name', width: 100 },
  { field: 'opp_institute_name', headerName: 'Opp Institute Name', width: 160 },
  {
    field: 'opp_course_level',
    headerName: 'Opp Course Level',
    width: 150,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.value;
      if (!value) return '-';
      const style = courseLevelColors[value] ?? { bg: '#F1EFE8', color: '#5F5E5A' };
      return (
        <Tooltip title={value} placement="top" arrow>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '140px',
              height: '25px',
              padding: '2px 10px',
              borderRadius: '999px',
              backgroundColor: style.bg,
              color: style.color,
              fontSize: '12px',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </span>
        </Tooltip>
      );
    },
  },
  { field: 'opp_counselor', headerName: 'Opp Counselor', width: 128 },
  { field: 'opp_counselor_uname', headerName: 'Opp Counselor Name', width: 170 },
  { field: 'opp_adm_officer', headerName: 'Opp Admin Officer', width: 150 },
  { field: 'opp_adm_officer_uname', headerName: 'Opp Admin Officer Name', width: 190 },
  { field: 'opp_office', headerName: 'Opp Office', width: 100 },
  { field: 'opp_subagent', headerName: 'Opp Subagent', width: 120 },
  { field: 'opp_salaes_stage', headerName: 'Opp Sales Stage', width: 135 },
  { field: 'opp_commence_date', headerName: 'Opp Commence Date', width: 170 },
  // { field: 'opp_commence_date_year', headerName: 'Opp Commence Date Year', width: 200 },
  // { field: 'opp_commence_date_month', headerName: 'Opp Commence Date Month', width: 190 },
  { field: 'opp_last_stage_change_date', headerName: 'Opp Last Stage Change Date', width: 220 },
  { field: 'opp_date_entered', headerName: 'Opp Date Entered', width: 155 },
  // { field: 'opp_date_entered_year', headerName: 'Opp Date Entered Year', width: 100 },
  // { field: 'opp_date_entered_month', headerName: 'Opp Date Entered Month', width: 100 },
  // { field: 'std_created_by', headerName: 'STD Created By', width: 100 },
  // { field: 'std_lead_source', headerName: 'STD Lead Source', width: 100 },
  // { field: 'std_date_entered_iso', headerName: 'STD Date Entered', width: 100 },
  // { field: 'opp_commence_date_iso', headerName: 'Opp Commence Date ISO', width: 100 },
  // { field: 'opp_last_stage_change_date_iso', headerName: 'Opp Last Stage Change Date Iso', width: 100 },
  // { field: 'opp_date_entered_iso', headerName: 'Opp Date Entered Iso', width: 100 },
].map((col) =>
  col.field === 'std_id' ||
    col.field === 'opp_salaes_stage' ||
    col.field === 'std_name' ||
    col.field === 'std_gender' ||
    col.field === 'std_dob' ||
    col.field === 'opp_course_level'
    ? col
    : {
      ...col,
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value ?? '-';
        return (
          <Tooltip title={value} placement="top" arrow>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >
              {value === null || value === undefined || value === '' ? '-' : String(value)}
            </span>
          </Tooltip>
        );
      },
    }
);

function DashboardPage() {
  const [pageSize, setPageSize] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Set<GridRowId>>(new Set());
  const rows = useMemo(() => getUniqueStudents(dashboardPayload.data), []);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);

  const detailColumns: GridColDef[] = useMemo(
    () =>
      baseColumns.map((col) => ({
        ...col,
        valueFormatter: (value) => renderDash(value),
      })),
    []
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        renderCell: (params: GridRenderCellParams) => {
          if (!params.row._duplicates?.length) return null;
          const isExpanded = expandedRows.has(params.id);
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                borderRadius: '999px',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: '#F2F2F2',
                },
              }}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Box>
          );
        },
      },
      ...baseColumns.map((col) => ({
        ...col,
        valueFormatter: (value: any) => {
          if (col.field === 'std_id' && value) {
            return String(value).split('-')[0];
          }
          return renderDash(value);
        },
      })),
    ],
    [expandedRows]
  );
  const getDetailPanelContent = ({ row }: { row: any }) => {
    if (!row._duplicates?.length) return null;

    const duplicateRows = row._duplicates.map((dup: any, index: number) => ({
      ...dup,
      id: `${row.id}-dup-${index}`,
    }));

    return (
      <Box sx={{ backgroundColor: '#fafafa', width: '100%', overflow: 'hidden' }}>
        <DataGridPro
          autoHeight
          hideFooter
          rows={duplicateRows}
          columns={detailColumns}
          columnHeaderHeight={0}
          detailPanelExpandedRowIds={expandedRows}                          // ← add
          onDetailPanelExpandedRowIdsChange={(ids) => setExpandedRows(ids)}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',              
            },
          }}
        />
      </Box>
    );
  };

  const salesStageColors: Record<string, { bg: string; color: string }> = {
    'Application Rejected': { bg: '#FFE5E5', color: '#A32D2D' },
    'Offer Approved Conditional': { bg: '#FFF4CC', color: '#854F0B' },
    'Offer Approved Unconditional': { bg: '#E6F4EA', color: '#1E6B3A' },
    'Commenced': { bg: '#E6F1FB', color: '#185FA5' },
    'Void': { bg: '#F1EFE8', color: '#5F5E5A' },
    'Need More Information': { bg: '#FDE8F5', color: '#7A2260' },
  };


  return (
    <AppLayout>
      <Box sx={{ height: 750, width: '100%', overflow: 'hidden' }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          detailPanelExpandedRowIds={expandedRows}
          onDetailPanelExpandedRowIdsChange={(ids) => setExpandedRows(new Set(ids))}
          onRowClick={(params) => {
            if (!params.row._duplicates?.length) return;
            setSelectedRowId((prev) => (prev === params.id ? null : params.id));
          }}
          pageSizeOptions={[10, 15, 20, 25, 30]}
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize, page: 0 } },
          }}
          onPaginationModelChange={(model) => setPageSize(model.pageSize)}
          disableRowSelectionOnClick
          rowHeight={40}
          getDetailPanelContent={getDetailPanelContent}
          getDetailPanelHeight={() => 'auto'}
          sx={{
            height: '100%',
            width: '100%',
            border:'1px solid #141E28',
            borderRadius:'10px',

            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-row': {
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, font-size 0.2s ease, font-weight 0.2s ease',
              cursor: 'default',
            },

            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: '#F7F6FF',
            },
            '& .MuiDataGrid-row--firstVisible': {
              backgroundColor: '#F7F6FF important',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-row:hover': {
              transform: 'scaleX(0.998) translateY(-1px)',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.07)',
              backgroundColor: '#ffffff !important',
              zIndex: 2,
              position: 'relative',
            },
            '& .MuiDataGrid-row:hover .MuiDataGrid-cell': {
              fontSize: '13px',
              fontWeight: 600,
            },
            '& .MuiDataGrid-row:nth-of-type(odd):hover': {
              backgroundColor: '#ffffff !important',
            },
            '& .MuiDataGrid-row:nth-of-type(even):hover': {
              backgroundColor: '#ffffff !important',
            },
            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.row--expanded': {
              transform: 'scaleX(0.995) translateY(-1px)',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.07)',
              backgroundColor: '#fff',
              zIndex: 2,
              position: 'relative',
              borderRadius: '8px',
            },
            '& .MuiDataGrid-row.Mui-selected:hover': {
              backgroundColor: '#fff !important',
            },
            //expended design
            '& .MuiDataGrid-row.row--expanded': {
              transform: 'scaleX(0.995) translateY(-2px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.13), 0 2px 6px 0 rgba(0,0,0,0.09)',
              backgroundColor: '#ffffff !important',
              zIndex: 3,
              position: 'relative',
              borderRadius: '8px',
              borderLeft: '3px solid #185FA5',
            },
            
            '& .MuiDataGrid-row.row--expanded .MuiDataGrid-cell': {
              fontSize: '13px',
              fontWeight: 700,
              color: '#185FA5',
            },
            '& .MuiDataGrid-cell': {
              padding: '0 8px',
              fontSize: '13px',
            },
            '& .MuiDataGrid-row.row--expanded:hover': {
              backgroundColor: '#ffffff !important',
              transform: 'scaleX(0.995) translateY(-2px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.13), 0 2px 6px 0 rgba(0,0,0,0.09)',
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: '#ffffff !important',
            },

            //expended row design 
            '& .MuiDataGrid-row.row--expanded::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: '#185FA5',
              borderRadius: '4px 0 0 4px',
              zIndex: 4,
            },

            '& .MuiDataGrid-detailPanel': {
              position: 'relative',
            },
            '& .MuiDataGrid-detailPanel::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: '#378ADD',
              borderRadius: '0',
              zIndex: 4,
            },
            '& .MuiDataGrid-detailPanel .MuiDataGrid-row': {
              marginLeft: '50px',
            },
            // '& .MuiDataGrid-detailPanel .MuiDataGrid-row::before': {
            //   content: '""',
            //   position: 'absolute',
            //   left: 0,
            //   top: 0,
            //   bottom: 0,
            //   width: '4px',
            //   backgroundColor: '#378ADD',
            //   borderRadius: '0',
            //   zIndex: 4,
            // },
          }}
          getRowClassName={(params) =>
            expandedRows.has(params.id) ? 'row--expanded' : ''
          }
        />
      </Box>
    </AppLayout>
  );
}

export default DashboardPage;




