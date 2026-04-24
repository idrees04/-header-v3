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
