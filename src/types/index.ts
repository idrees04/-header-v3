import type { LucideIcon } from 'lucide-react';

export interface MenuItemChild {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  requiredParams?: Record<string, string>;
}

export interface MenuItemParent {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  requiredParams?: Record<string, string>;
  children?: MenuItemChild[];
}

export type MenuItem = MenuItemParent;

export interface RoleMenuConfig {
  roleName: string;
  roleIdValue: string;
  menuItems: MenuItem[];
}

export interface UserContext {
  roleId: string;
  fullname: string;
  branchId: string;
}

export interface ApiLoginResponse {
  user_full_name: string;
  roles_top_to_bottom: string[];
  branch_manager_secgroup_ids: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  fullname: string;
  roles: string[];
  branchId: string;
  login: (username: string, role: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export interface SidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export interface ResolvedMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
  resolvedUrl?: string;
  children?: ResolvedMenuItem[];
}

export interface RoleMenuGroup {
  roleName: string;
  items: ResolvedMenuItem[];
}


export interface Opportunity {
  opp_id: string | null;
  opp_name: string;
  opp_institute_name: string;
  opp_course_level: string | null;
  opp_counselor: string | null;
  opp_counselor_uname: string | null;
  opp_adm_officer: string | null;
  opp_adm_officer_uname: string | null;
  opp_office: string | null;
  opp_subagent: string | null;
  opp_salaes_stage: string | null;
  opp_commence_date: string | null;
  opp_commence_date_year: string | null;
  opp_commence_date_month: string | null;
  opp_last_stage_change_date: string | null;
  opp_date_entered: string | null;
  opp_date_entered_year: string | null;
  opp_date_entered_month: string | null;
}

export interface RawRecord {
  id: number;
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
  std_counselor_uname: string;
  std_adm_officer: string;
  std_adm_officer_uname: string;
  std_office: string;
  std_subagent: string;
  std_date_entered: string;
  std_date_entered_year: string;
  std_date_entered_month: string;
  std_email: string;
  opp_id: string | null;
  opp_name: string;
  opp_institute_name: string;
  opp_course_level: string | null;
  opp_counselor: string | null;
  opp_counselor_uname: string | null;
  opp_adm_officer: string | null;
  opp_adm_officer_uname: string | null;
  opp_office: string | null;
  opp_subagent: string | null;
  opp_salaes_stage: string | null;
  opp_commence_date: string | null;
  opp_commence_date_year: string | null;
  opp_commence_date_month: string | null;
  opp_last_stage_change_date: string | null;
  opp_date_entered: string | null;
  opp_date_entered_year: string | null;
  opp_date_entered_month: string | null;
  std_created_by: string | null;
  std_lead_source: string | null;
  std_date_entered_iso: string | null;
  opp_commence_date_iso: string | null;
  opp_last_stage_change_date_iso: string | null;
  opp_date_entered_iso: string | null;
}

export interface Student {
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
  std_counselor_uname: string;
  std_adm_officer: string;
  std_adm_officer_uname: string;
  std_office: string;
  std_subagent: string;
  std_date_entered: string;
  std_date_entered_year: string;
  std_date_entered_month: string;
  std_email: string;
  std_created_by: string | null;
  std_lead_source: string | null;
  opportunities: Opportunity[];
}

export interface DashboardPayload {
  TotalStudents: number;
  TotalPrograms: number;
  data: RawRecord[];
}

export type OppStage =
  | 'Commenced'
  | 'Pipeline First Commencement'
  | 'Offer Approved Unconditional'
  | 'Offer Approved Conditional'
  | 'Need More Information'
  | 'Void'
  | 'Duplicate Dropped'
  | 'Application Rejected'
  | 'unknown';

export type FilterMode = 'all' | 'commenced' | 'pipeline' | 'approved' | 'void' | 'rejected' | 'nmi' | 'no_program';

export interface KPI {
  value: number;
  label: string;
  variant: 'positive' | 'negative' | 'neutral' | 'info';
}
