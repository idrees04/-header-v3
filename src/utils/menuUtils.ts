import type { MenuItem, UserContext, ResolvedMenuItem, RoleMenuGroup } from '@/types';
import { ROLE_MENU_CONFIG } from '@/config/menuConfig';

function resolveParamValue(
  template: string,
  context: UserContext
): string {
  switch (template) {
    case '{roleId}':
      return context.roleId;
    case '{fullname}':
      return context.fullname;
    case '{branchId}':
      return context.branchId;
    default:
      return template;
  }
}

export function buildMenuUrl(
  menuItem: { href?: string; requiredParams?: Record<string, string> },
  context: UserContext
): string {
  if (!menuItem.href) return '#';

  const params = menuItem.requiredParams;
  if (!params || Object.keys(params).length === 0) return menuItem.href;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, resolveParamValue(value, context));
  }

  return `${menuItem.href}?${searchParams.toString()}`;
}

export function resolveMenuItems(
  items: MenuItem[],
  context: UserContext
): ResolvedMenuItem[] {
  return items.map((item) => {
    const resolved: ResolvedMenuItem = {
      id: item.id,
      label: item.label,
      icon: item.icon,
    };

    if (item.children && item.children.length > 0) {
      resolved.children = item.children.map((child) => ({
        id: child.id,
        label: child.label,
        icon: child.icon,
        href: child.href,
        resolvedUrl: buildMenuUrl(child, context),
      }));
    } else if (item.href) {
      resolved.href = item.href;
      resolved.resolvedUrl = buildMenuUrl(item, context);
    }

    return resolved;
  });
}

export function buildMenuForRoles(
  userRoles: string[],
  context: Omit<UserContext, 'roleId'>
): RoleMenuGroup[] {
  const groups: RoleMenuGroup[] = [];

  for (const roleName of userRoles) {
    const config = ROLE_MENU_CONFIG.find((c) => c.roleName === roleName);
    if (!config) continue;

    const roleContext: UserContext = {
      roleId: config.roleIdValue,
      fullname: context.fullname,
      branchId: context.branchId,
    };

    groups.push({
      roleName: config.roleName,
      items: resolveMenuItems(config.menuItems, roleContext),
    });
  }

  return groups;
}

export function isPathActive(currentPath: string, itemHref: string | undefined): boolean {
  if (!itemHref) return false;
  return currentPath.startsWith(itemHref);
}

export function hasActiveChild(
  currentPath: string,
  item: ResolvedMenuItem
): boolean {
  if (item.children) {
    return item.children.some((child) => isPathActive(currentPath, child.href));
  }
  return false;
}
