import type { RawRecord, Student, Opportunity, DashboardPayload } from '../types';

function isValidValue(v: string | null | undefined): boolean {
  if (!v) return false;
  const trimmed = v.trim();
  return trimmed !== '' && trimmed !== '---' && trimmed !== '--' && trimmed !== '-';
}

function normalizeStr(v: string | null | undefined): string {
  if (!isValidValue(v)) return '';
  return v!.trim();
}

export function transformPayload(payload: DashboardPayload): Student[] {
  const studentMap = new Map<string, Student>();
  const oppSeenMap = new Map<string, Set<string>>();

  for (const record of payload.data) {
    const stdId = record.std_id;

    if (!studentMap.has(stdId)) {
      studentMap.set(stdId, {
        std_id: stdId,
        std_name: record.std_name.trim(),
        std_nationality: normalizeStr(record.std_nationality),
        std_crm_number: record.std_crm_number.trim(),
        std_phone_mobile: record.std_phone_mobile.trim(),
        std_gender: normalizeStr(record.std_gender),
        std_passport: record.std_passport.trim(),
        std_dob: normalizeStr(record.std_dob),
        std_stage: record.std_stage.trim(),
        std_counselor: record.std_counselor.trim(),
        std_counselor_uname: record.std_counselor_uname.trim(),
        std_adm_officer: record.std_adm_officer.trim(),
        std_adm_officer_uname: record.std_adm_officer_uname.trim(),
        std_office: record.std_office.trim(),
        std_subagent: normalizeStr(record.std_subagent),
        std_date_entered: record.std_date_entered.trim(),
        std_date_entered_year: record.std_date_entered_year.trim(),
        std_date_entered_month: record.std_date_entered_month.trim(),
        std_email: record.std_email.trim(),
        std_created_by: record.std_created_by,
        std_lead_source: record.std_lead_source,
        opportunities: [],
      });
      oppSeenMap.set(stdId, new Set());
    }

    if (record.opp_id && !oppSeenMap.get(stdId)!.has(record.opp_id)) {
      oppSeenMap.get(stdId)!.add(record.opp_id);

      const opp: Opportunity = {
        opp_id: record.opp_id,
        opp_name: record.opp_name.trim(),
        opp_institute_name: record.opp_institute_name.trim(),
        opp_course_level: record.opp_course_level,
        opp_counselor: record.opp_counselor,
        opp_counselor_uname: record.opp_counselor_uname,
        opp_adm_officer: record.opp_adm_officer,
        opp_adm_officer_uname: record.opp_adm_officer_uname,
        opp_office: record.opp_office,
        opp_subagent: record.opp_subagent,
        opp_salaes_stage: record.opp_salaes_stage,
        opp_commence_date: record.opp_commence_date,
        opp_commence_date_year: record.opp_commence_date_year,
        opp_commence_date_month: record.opp_commence_date_month,
        opp_last_stage_change_date: record.opp_last_stage_change_date,
        opp_date_entered: record.opp_date_entered,
        opp_date_entered_year: record.opp_date_entered_year,
        opp_date_entered_month: record.opp_date_entered_month,
      };

      studentMap.get(stdId)!.opportunities.push(opp);
    }
  }

  return Array.from(studentMap.values());
}

export function computeKPIs(students: Student[]) {
  const allOpps = students.flatMap(s => s.opportunities);

  return {
    totalStudents: students.length,
    totalOpps: allOpps.length,
    commenced: allOpps.filter(o => o.opp_salaes_stage === 'Commenced').length,
    pipeline: allOpps.filter(o => o.opp_salaes_stage === 'Pipeline First Commencement').length,
    approvedU: allOpps.filter(o => o.opp_salaes_stage === 'Offer Approved Unconditional').length,
    approvedC: allOpps.filter(o => o.opp_salaes_stage === 'Offer Approved Conditional').length,
    nmi: allOpps.filter(o => o.opp_salaes_stage === 'Need More Information').length,
    voidCount: allOpps.filter(o => o.opp_salaes_stage === 'Void').length,
    duplicateDropped: allOpps.filter(o => o.opp_salaes_stage === 'Duplicate Dropped').length,
    rejected: allOpps.filter(o => o.opp_salaes_stage === 'Application Rejected').length,
    noProgram: students.filter(s => s.opportunities.length === 0).length,
    newStudents: students.filter(s => s.std_stage.toLowerCase().includes('new')).length,
  };
}

export function computeOfficeBreakdown(students: Student[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of students) {
    map[s.std_office] = (map[s.std_office] || 0) + 1;
  }
  return map;
}

export function computeNationalityBreakdown(students: Student[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of students) {
    const nat = s.std_nationality || 'unknown';
    if (nat && nat !== 'unknown') {
      map[nat] = (map[nat] || 0) + 1;
    }
  }
  return map;
}

export function computeStageBreakdown(students: Student[]): Record<string, number> {
  const allOpps = students.flatMap(s => s.opportunities);
  const map: Record<string, number> = {};
  for (const o of allOpps) {
    const stage = o.opp_salaes_stage || 'Unknown';
    map[stage] = (map[stage] || 0) + 1;
  }
  return map;
}
