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
  {
    field: 'std_id',
    headerName: 'Student Id',
    width: 100,
    renderCell: (params: GridRenderCellParams) => {
      const fullId = params.value ?? '';
      const shortId = String(fullId).split('-')[0];
      return (
        <Tooltip title={fullId} placement="top" arrow>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shortId}
          </span>
        </Tooltip>
      );
    },
  },
  {
    field: 'std_name',
    headerName: 'Student Name',
    width: 150,
    renderCell: (params: GridRenderCellParams) => {
      const name = params.value ?? '-';
      const firstLetter = name !== '-' ? String(name).charAt(0).toUpperCase() : '-';
      const colors = [
        { bg: '#E6F1FB', color: '#185FA5' },
        { bg: '#E1F5EE', color: '#0F6E56' },
        { bg: '#FAECE7', color: '#993C1D' },
        { bg: '#EEEDFE', color: '#534AB7' },
        { bg: '#FDE8F5', color: '#7A2260' },
        { bg: '#FFF4CC', color: '#854F0B' },
      ];
      const colorIndex = firstLetter.charCodeAt(0) % colors.length;
      const { bg, color } = colors[colorIndex];
      return (
        <Tooltip title={name} placement="top" arrow>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span
              style={{
                minWidth: '30px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: bg,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {firstLetter}
            </span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </span>
          </span>
        </Tooltip>
      );
    },
  },
  { field: 'std_nationality', headerName: 'Student Nationality', width: 100 },
  { field: 'std_crm_number', headerName: 'Student Crm Number', width: 100 },
  { field: 'std_phone_mobile', headerName: 'Student Phone Number', width: 100 },
  {
    field: 'std_gender',
    headerName: 'Student Gender',
    width: 100,
    renderCell: (params: GridRenderCellParams) => {
      const value = params.value;
      if (!value) return '-';
      const style = genderColors[value] ?? { bg: '#F1EFE8', color: '#5F5E5A' };
      return (
        <Tooltip title={value} placement="top" arrow>
          <span
            style={{
              backgroundColor: style.bg,
              color: style.color,
              padding: '2px 2px',
              width: '60px',
              textAlign: "center",
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            {value}
          </span>
        </Tooltip>
      );
    },
  },
  { field: 'std_passport', headerName: 'Student Passport', width: 100 },
  { field: 'std_dob', headerName: 'Student DOB', width: 100 },
  { field: 'std_stage', headerName: 'Student Stage', width: 100 },
  { field: 'std_counselor', headerName: 'Student Counselor', width: 100 },
  { field: 'std_counselor_uname', headerName: 'Student Counselor Username', width: 100 },
  { field: 'std_adm_officer', headerName: 'Student Admin Officer', width: 100 },
  { field: 'std_adm_officer_uname', headerName: 'Student Admin Officer Name', width: 100 },
  { field: 'std_office', headerName: 'Student Office', width: 100 },
  { field: 'std_subagent', headerName: 'Student Subagent', width: 100 },
  { field: 'std_date_entered', headerName: 'Student Data Entered', width: 100 },
  { field: 'std_date_entered_year', headerName: 'Student Date Entered Year', width: 100 },
  { field: 'std_date_entered_month', headerName: 'Student Date Entered Month', width: 100 },
  { field: 'std_email', headerName: 'Student Email', width: 100 },
  { field: 'opp_id', headerName: 'Opp Id', width: 100 },
  { field: 'opp_name', headerName: 'Opp Name', width: 100 },
  { field: 'opp_institute_name', headerName: 'Opp Institute Name', width: 100 },
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
              backgroundColor: style.bg,
              color: style.color,
              padding: '2px 10px',
              fontSize: '12px',
              width:'150px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            {value}
          </span>
        </Tooltip>
      );
    },
  },
  { field: 'opp_counselor', headerName: 'Opp Counselor', width: 100 },
  { field: 'opp_counselor_uname', headerName: 'Opp Counselor Username', width: 100 },
  { field: 'opp_adm_officer', headerName: 'Opp Admin Officer', width: 100 },
  { field: 'opp_adm_officer_uname', headerName: 'Opp Admin Officer Name', width: 100 },
  { field: 'opp_office', headerName: 'Opp Office', width: 100 },
  { field: 'opp_subagent', headerName: 'Opp Subagent', width: 100 },
  { field: 'opp_salaes_stage', headerName: 'Opp Sales Stage', width: 100 },
  { field: 'opp_commence_date', headerName: 'Opp Commence Date', width: 100 },
  { field: 'opp_commence_date_year', headerName: 'Opp Commence Date Year', width: 100 },
  { field: 'opp_commence_date_month', headerName: 'Opp Commence Date Month', width: 100 },
  { field: 'opp_last_stage_change_date', headerName: 'Opp Last Stage Change Date', width: 100 },
  { field: 'opp_date_entered', headerName: 'Opp Date Entered', width: 100 },
  { field: 'opp_date_entered_year', headerName: 'Opp Date Entered Year', width: 100 },
  { field: 'opp_date_entered_month', headerName: 'Opp Date Entered Month', width: 100 },
  { field: 'std_created_by', headerName: 'STD Created By', width: 100 },
  { field: 'std_lead_source', headerName: 'STD Lead Source', width: 100 },
  { field: 'std_date_entered_iso', headerName: 'STD Date Entered', width: 100 },
  { field: 'opp_commence_date_iso', headerName: 'Opp Commence Date ISO', width: 100 },
  { field: 'opp_last_stage_change_date_iso', headerName: 'Opp Last Stage Change Date Iso', width: 100 },
  { field: 'opp_date_entered_iso', headerName: 'Opp Date Entered Iso', width: 100 },
].map((col) =>
  col.field === 'std_id' ||
    col.field === 'opp_salaes_stage' ||
    col.field === 'std_name' ||
    col.field === 'std_gender' ||
    col.field === 'opp_course_level'  // ← add this
    ? col
    : {
      ...col,
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value ?? '-';
        return (
          <Tooltip title={value} placement="top" arrow>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
            '& .MuiDataGrid-detailPanel .MuiDataGrid-row::before': {
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




