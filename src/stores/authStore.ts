import { create } from 'zustand';
import type { AuthState } from '@/types';
import { ROLE_MENU_CONFIG } from '@/config/menuConfig';

const STORAGE_KEY_FULLNAME = 'app_fullname';
const STORAGE_KEY_ROLES = 'app_roles';
const STORAGE_KEY_BRANCH = 'app_branch';

function mockLoginApi(username: string, role: string) {
  return new Promise<{
    user_full_name: string;
    roles_top_to_bottom: string[];
    branch_manager_secgroup_ids: string;
  }>((resolve) => {
    setTimeout(() => {
      const roleConfig = ROLE_MENU_CONFIG.find((c) => c.roleName === role);
      resolve({
        user_full_name: username === 'admin' ? 'Mohammad Nimrawi' : username,
        roles_top_to_bottom: roleConfig ? [roleConfig.roleName] : [role],
        branch_manager_secgroup_ids: 'branch-001',
      });
    }, 600);
  });
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  fullname: '',
  roles: [],
  branchId: '',

  login: async (username: string, role: string) => {
    const response = await mockLoginApi(username, role);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_FULLNAME, response.user_full_name);
      localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(response.roles_top_to_bottom));
      localStorage.setItem(STORAGE_KEY_BRANCH, response.branch_manager_secgroup_ids);
    }

    set({
      isAuthenticated: true,
      fullname: response.user_full_name,
      roles: response.roles_top_to_bottom,
      branchId: response.branch_manager_secgroup_ids,
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_FULLNAME);
      localStorage.removeItem(STORAGE_KEY_ROLES);
      localStorage.removeItem(STORAGE_KEY_BRANCH);
    }
    set({
      isAuthenticated: false,
      fullname: '',
      roles: [],
      branchId: '',
    });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const fullname = localStorage.getItem(STORAGE_KEY_FULLNAME);
    const rolesStr = localStorage.getItem(STORAGE_KEY_ROLES);
    const branchId = localStorage.getItem(STORAGE_KEY_BRANCH);

    if (fullname && rolesStr) {
      try {
        const roles = JSON.parse(rolesStr) as string[];
        set({
          isAuthenticated: true,
          fullname,
          roles,
          branchId: branchId ?? '',
        });
      } catch {
        // Invalid data, stay logged out
      }
    }
  },
}));
