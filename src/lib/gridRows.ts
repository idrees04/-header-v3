import type { Student, Opportunity } from '../types';

export type RowKind = 'student' | 'opportunity';

/** Flat row consumed by MUI DataGrid */
export interface GridRow {
  // identity
  id: string;
  kind: RowKind;
  path: string[];   // tree-data path: ['std_id'] or ['std_id','opp_id']

  // student fields (populated on both student & opp rows for context)
  std_id: string;
  std_name: string;
  std_nationality: string;
  std_crm_number: string;
  std_phone_mobile: string;
  std_gender: string;
  std_passport: string;
  std_dob: string;
  std_stage: string;
  std_counselor: string;
  std_adm_officer: string;
  std_office: string;
  std_subagent: string;
  std_date_entered: string;
  std_email: string;
  opp_count: number;

  // opp fields (only populated on opportunity rows)
  opp_id: string | null;
  opp_name: string;
  opp_institute_name: string;
  opp_course_level: string | null;
  opp_counselor: string | null;
  opp_adm_officer: string | null;
  opp_office: string | null;
  opp_subagent: string | null;
  opp_salaes_stage: string | null;
  opp_commence_date: string | null;
  opp_last_stage_change_date: string | null;
  opp_date_entered: string | null;
  isLastOpp: boolean;
}

export function buildGridRows(students: Student[]): GridRow[] {
  const rows: GridRow[] = [];

  for (const s of students) {
    // Student (group) row
    const studentRow: GridRow = {
      id: `std::${s.std_id}`,
      kind: 'student',
      path: [s.std_id],

      std_id: s.std_id,
      std_name: s.std_name.trim(),
      std_nationality: s.std_nationality || '—',
      std_crm_number: s.std_crm_number,
      std_phone_mobile: s.std_phone_mobile,
      std_gender: s.std_gender,
      std_passport: s.std_passport,
      std_dob: s.std_dob && s.std_dob !== '---' ? s.std_dob : '—',
      std_stage: s.std_stage,
      std_counselor: s.std_counselor,
      std_adm_officer: s.std_adm_officer,
      std_office: s.std_office,
      std_subagent: s.std_subagent || '—',
      std_date_entered: s.std_date_entered,
      std_email: s.std_email,
      opp_count: s.opportunities.length,

      // empty opp fields
      opp_id: null,
      opp_name: '',
      opp_institute_name: '',
      opp_course_level: null,
      opp_counselor: null,
      opp_adm_officer: null,
      opp_office: null,
      opp_subagent: null,
      opp_salaes_stage: null,
      opp_commence_date: null,
      opp_last_stage_change_date: null,
      opp_date_entered: null,
      isLastOpp: false,
    };

    rows.push(studentRow);

    // Opportunity child rows
    const opps = s.opportunities.filter(o => o.opp_id);

    if (opps.length > 0) {
      opps.forEach((o: Opportunity, i: number) => {
        const oppRow: GridRow = {
          id: `opp::${o.opp_id}`,
          kind: 'opportunity',
          path: [s.std_id, o.opp_id!],

          // inherit student data
          std_id: s.std_id,
          std_name: s.std_name.trim(),
          std_nationality: s.std_nationality || '—',
          std_crm_number: s.std_crm_number,
          std_phone_mobile: s.std_phone_mobile,
          std_gender: s.std_gender,
          std_passport: s.std_passport,
          std_dob: s.std_dob && s.std_dob !== '---' ? s.std_dob : '—',
          std_stage: s.std_stage,
          std_counselor: s.std_counselor,
          std_adm_officer: s.std_adm_officer,
          std_office: s.std_office,
          std_subagent: s.std_subagent || '—',
          std_date_entered: s.std_date_entered,
          std_email: s.std_email,
          opp_count: s.opportunities.length,

          // opp-specific
          opp_id: o.opp_id,
          opp_name: o.opp_name.trim(),
          opp_institute_name: o.opp_institute_name,
          opp_course_level: o.opp_course_level,
          opp_counselor: o.opp_counselor,
          opp_adm_officer: o.opp_adm_officer,
          opp_office: o.opp_office,
          opp_subagent: o.opp_subagent,
          opp_salaes_stage: o.opp_salaes_stage,
          opp_commence_date: o.opp_commence_date,
          opp_last_stage_change_date: o.opp_last_stage_change_date,
          opp_date_entered: o.opp_date_entered,
          isLastOpp: i === opps.length - 1,
        };

        rows.push(oppRow);
      });
    }
  }

  return rows;
}