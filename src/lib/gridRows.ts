import type { Student } from "../types";

// ── Row kind ──────────────────────────────────────────────
// Only 'student' rows are now injected into the DataGrid.
// Opportunity data is rendered via OppDetailPanel (detail panel).
export type RowKind = "student";

/** Flat row consumed by MUI DataGrid */
export type GridRow = {
  id: string;
  kind: "student";
  path: (string | number)[];

  // ── Student fields ──────────────────────────────────────
  std_id: string | number;
  std_name: string;
  std_nationality?: string;
  std_crm_number: string;
  std_phone_mobile?: string;
  std_gender?: string;
  std_passport?: string;
  std_dob?: string;
  std_stage?: string;
  std_counselor?: string;
  std_adm_officer?: string;
  std_office?: string;
  std_subagent?: string;
  std_date_entered?: string;
  std_email?: string;
  opp_count: number;

  // ── Back-reference to the full Student object ───────────
  // Used by the detail panel to access opportunities without
  // duplicating all opp fields into every grid row.
  _student: Student;
};

/** Build a flat array of student-only rows for the DataGrid */
export function buildGridRows(students: Student[]): GridRow[] {
  return students.map((s) => ({
    id: `std::${s.std_id}`,
    kind: "student",
    path: [s.std_id],

    _student: s,

    std_id: s.std_id,
    std_name: s.std_name.trim(),
    std_nationality: s.std_nationality || "—",
    std_crm_number: s.std_crm_number,
    std_phone_mobile: s.std_phone_mobile,
    std_gender: s.std_gender,
    std_passport: s.std_passport,
    std_dob: s.std_dob && s.std_dob !== "---" ? s.std_dob : "—",
    std_stage: s.std_stage,
    std_counselor: s.std_counselor,
    std_adm_officer: s.std_adm_officer,
    std_office: s.std_office,
    std_subagent: s.std_subagent || "—",
    std_date_entered: s.std_date_entered,
    std_email: s.std_email,
    opp_count: s.opportunities.length,
  }));
}
