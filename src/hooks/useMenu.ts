import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { buildMenuForRoles } from '@/utils/menuUtils';
import type { RoleMenuGroup } from '@/types';

export function useMenu(): RoleMenuGroup[] {
  const roles = useAuthStore((s) => s.roles);
  const fullname = useAuthStore((s) => s.fullname);
  const branchId = useAuthStore((s) => s.branchId);

  return useMemo(
    () => buildMenuForRoles(roles, { fullname, branchId }),
    [roles, fullname, branchId]
  );
}
