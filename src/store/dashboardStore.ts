import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Student, FilterMode } from '../types';
import { transformPayload } from '@/utils/transform';
import { dashboardPayload } from '@/data/payload';

import type { GridSortModel, GridPaginationModel } from '@mui/x-data-grid-pro';

function serverFilter(students: Student[], query: string, mode: FilterMode): Student[] {
  let result = students;

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(s => {
      const blob = [
        s.std_name,
        s.std_crm_number,
        s.std_office,
        s.std_stage,
        s.std_counselor,
        s.std_adm_officer,
        s.std_nationality,
        s.std_subagent,
        s.std_email,
        s.std_phone_mobile,
        ...s.opportunities.map(o =>
          `${o.opp_name} ${o.opp_institute_name} ${o.opp_salaes_stage ?? ''}`
        ),
      ]
        .join(' ')
        .toLowerCase();

      return blob.includes(q);
    });
  }

  switch (mode) {
    case 'commenced':
      return result.filter(
        s =>
          s.opportunities.some(o => o.opp_salaes_stage === 'Commenced') ||
          s.std_stage.toLowerCase().includes('commenced')
      );
    case 'pipeline':
      return result.filter(s =>
        s.opportunities.some(o => o.opp_salaes_stage === 'Pipeline First Commencement')
      );
    case 'approved':
      return result.filter(s =>
        s.opportunities.some(
          o =>
            o.opp_salaes_stage === 'Offer Approved Unconditional' ||
            o.opp_salaes_stage === 'Offer Approved Conditional'
        )
      );
    case 'void':
      return result.filter(s =>
        s.opportunities.some(
          o => o.opp_salaes_stage === 'Void' || o.opp_salaes_stage === 'Duplicate Dropped'
        )
      );
    case 'rejected':
      return result.filter(s =>
        s.opportunities.some(o => o.opp_salaes_stage === 'Application Rejected')
      );
    case 'nmi':
      return result.filter(s =>
        s.opportunities.some(o => o.opp_salaes_stage === 'Need More Information')
      );
    case 'no_program':
      return result.filter(s => s.opportunities.length === 0);
    default:
      return result;
  }
}

function serverSort(students: Student[], sortModel: GridSortModel): Student[] {
  if (!sortModel.length) return students;

  const { field, sort } = sortModel[0];
  const dir = sort === 'asc' ? 1 : -1;

  return [...students].sort((a, b) => {
    switch (field) {
      case 'std_name':
        return dir * a.std_name.localeCompare(b.std_name);
      case 'std_crm_number':
        return dir * a.std_crm_number.localeCompare(b.std_crm_number);
      case 'std_office':
        return dir * a.std_office.localeCompare(b.std_office);
      case 'std_date_entered':
        return dir * a.std_date_entered.localeCompare(b.std_date_entered);
      case 'opp_count':
        return dir * (a.opportunities.length - b.opportunities.length);
      case 'std_nationality':
        return dir * a.std_nationality.localeCompare(b.std_nationality);
      default:
        return 0;
    }
  });
}

function derive(
  students: Student[],
  query: string,
  mode: FilterMode,
  sortModel: GridSortModel,
  page: GridPaginationModel
) {
  const filtered = serverSort(serverFilter(students, query, mode), sortModel);
  const start = page.page * page.pageSize;
  const paginated = filtered.slice(start, start + page.pageSize);

  return { filtered, paginated, total: filtered.length };
}

const INIT_PAGE: GridPaginationModel = { page: 0, pageSize: 50 };

const SOURCE = transformPayload(dashboardPayload);
const { filtered: iF, paginated: iP, total: iT } = derive(
  SOURCE,
  '',
  'all',
  [],
  INIT_PAGE
);

interface State {
  allStudents: Student[];
  totalStudentsFromAPI: number;
  totalProgramsFromAPI: number;

  searchQuery: string;
  filterMode: FilterMode;
  muiSortModel: GridSortModel;
  paginationModel: GridPaginationModel;

  filteredStudents: Student[];
  paginatedStudents: Student[];
  totalRows: number;

  expandedRowIds: Set<string>;

  isLoading: boolean;
  columnVisibility: Record<string, boolean>;

  setSearchQuery: (q: string) => void;
  setFilterMode: (m: FilterMode) => void;
  setMuiSortModel: (m: GridSortModel) => void;
  setPaginationModel: (m: GridPaginationModel) => void;

  toggleExpanded: (id: string) => void;
  toggleExpandAll: () => void;

  setColumnVisibility: (v: Record<string, boolean>) => void;
}

export const PAGE_SIZE_OPTIONS = [25, 50, 100];

export const useDashboardStore = create<State>()(
  subscribeWithSelector((set, get) => ({
    allStudents: SOURCE,
    totalStudentsFromAPI: dashboardPayload.TotalStudents,
    totalProgramsFromAPI: dashboardPayload.TotalPrograms,

    searchQuery: '',
    filterMode: 'all',
    muiSortModel: [],
    paginationModel: INIT_PAGE,

    filteredStudents: iF,
    paginatedStudents: iP,
    totalRows: iT,

    expandedRowIds: new Set(),

    isLoading: false,
    columnVisibility: {},

    setSearchQuery: searchQuery => {
      const { allStudents, filterMode, muiSortModel, paginationModel } = get();
      const page = { ...paginationModel, page: 0 };

      const { filtered, paginated, total } = derive(
        allStudents,
        searchQuery,
        filterMode,
        muiSortModel,
        page
      );

      set({
        searchQuery,
        paginationModel: page,
        filteredStudents: filtered,
        paginatedStudents: paginated,
        totalRows: total,
        expandedRowIds: new Set(), // reset
      });
    },

    setFilterMode: filterMode => {
      const { allStudents, searchQuery, muiSortModel, paginationModel } = get();
      const page = { ...paginationModel, page: 0 };

      const { filtered, paginated, total } = derive(
        allStudents,
        searchQuery,
        filterMode,
        muiSortModel,
        page
      );

      set({
        filterMode,
        paginationModel: page,
        filteredStudents: filtered,
        paginatedStudents: paginated,
        totalRows: total,
        expandedRowIds: new Set(),
      });
    },

    setMuiSortModel: muiSortModel => {
      const { allStudents, searchQuery, filterMode, paginationModel } = get();

      const { filtered, paginated, total } = derive(
        allStudents,
        searchQuery,
        filterMode,
        muiSortModel,
        paginationModel
      );

      set({
        muiSortModel,
        filteredStudents: filtered,
        paginatedStudents: paginated,
        totalRows: total,
      });
    },

    setPaginationModel: paginationModel => {
      const { allStudents, searchQuery, filterMode, muiSortModel } = get();

      const { filtered, paginated, total } = derive(
        allStudents,
        searchQuery,
        filterMode,
        muiSortModel,
        paginationModel
      );

      set({
        paginationModel,
        filteredStudents: filtered,
        paginatedStudents: paginated,
        totalRows: total,
        expandedRowIds: new Set(),
      });
    },

    toggleExpanded: id =>
      set(state => {
        const next = new Set(state.expandedRowIds);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return { expandedRowIds: next };
      }),

    toggleExpandAll: () =>
      set(state => {
        const visibleIds = state.paginatedStudents.map(s => `std::${s.std_id}`);
        const isAllExpanded = visibleIds.every(id => state.expandedRowIds.has(id));

        return {
          expandedRowIds: isAllExpanded ? new Set() : new Set(visibleIds),
        };
      }),

    setColumnVisibility: columnVisibility => set({ columnVisibility }),
  }))
);