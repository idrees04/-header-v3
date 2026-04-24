import { memo, useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';
import { isPathActive, hasActiveChild } from '@/utils/menuUtils';
import type { ResolvedMenuItem, RoleMenuGroup } from '@/types';

const linkVariants = {
  rest: { x: 0 },
  hover: { x: 4, transition: { type: 'spring' as const, stiffness: 400, damping: 20 } },
};

const iconPulse = {
  rest: { scale: 1 },
  hover: { scale: 1.12, transition: { type: 'spring' as const, stiffness: 500, damping: 15 } },
};

const SidebarLink = memo(function SidebarLink({
  item,
  currentPath,
  collapsed,
}: {
  item: ResolvedMenuItem;
  currentPath: string;
  collapsed: boolean;
}) {
  const active = isPathActive(currentPath, item.href);
  const Icon = item.icon;

  return (
    <motion.div initial="rest" whileHover="hover" animate="rest">
      <Link
        to={item.resolvedUrl ?? '#'}
        title={collapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
          ${active
            ? 'bg-sidebar-active text-sidebar-active-fg shadow-md shadow-sidebar-active/20'
            : 'text-sidebar-fg hover:bg-sidebar-hover'
          }
          ${collapsed ? 'justify-center px-2' : ''}
        `}
      >
        {/* Active indicator bar */}
        {active && !collapsed && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-active-fg/80"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}
        {Icon && (
          <motion.span variants={iconPulse} className="shrink-0">
            <Icon className="h-[18px] w-[18px]" />
          </motion.span>
        )}
        {!collapsed && (
          <motion.span variants={linkVariants} className="truncate">
            {item.label}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
});

const SidebarAccordion = memo(function SidebarAccordion({
  item,
  currentPath,
  collapsed,
}: {
  item: ResolvedMenuItem;
  currentPath: string;
  collapsed: boolean;
}) {
  const childActive = hasActiveChild(currentPath, item);
  const [open, setOpen] = useState(childActive);
  const Icon = item.icon;

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  if (collapsed) {
    return (
      <div className="relative group" role="menuitem">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex w-full items-center justify-center rounded-xl px-2 py-2.5 text-sm font-medium transition-all duration-200
            ${childActive ? 'bg-sidebar-hover text-sidebar-active-fg' : 'text-sidebar-fg hover:bg-sidebar-hover'}`}
          title={item.label}
          aria-label={item.label}
        >
          {Icon && <Icon className="h-[18px] w-[18px]" />}
        </motion.button>
        <div className="absolute left-full top-0 z-50 ml-2 hidden min-w-48 rounded-xl border border-sidebar-border bg-sidebar-bg p-2 shadow-xl backdrop-blur-sm group-hover:block">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-section">
            {item.label}
          </p>
          {item.children?.map((child) => (
            <SidebarLink key={child.id} item={child} currentPath={currentPath} collapsed={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div role="menuitem">
      <motion.button
        onClick={toggle}
        aria-expanded={open}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
          ${childActive ? 'text-sidebar-active-fg' : 'text-sidebar-fg hover:bg-sidebar-hover'}`}
      >
        {Icon && (
          <motion.span variants={iconPulse} className="shrink-0">
            <Icon className="h-[18px] w-[18px]" />
          </motion.span>
        )}
        <motion.span variants={linkVariants} className="flex-1 truncate text-left">
          {item.label}
        </motion.span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className="h-4 w-4 opacity-60" />
        </motion.span>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
            role="menu"
          >
            <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-sidebar-active/30 pl-3">
              {item.children?.map((child, i) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <SidebarLink item={child} currentPath={currentPath} collapsed={false} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const SidebarMenuList = memo(function SidebarMenuList({
  items,
  currentPath,
  collapsed,
}: {
  items: ResolvedMenuItem[];
  currentPath: string;
  collapsed: boolean;
}) {
  return (
    <div className="space-y-0.5" role="menu">
      {items.map((item) =>
        item.children && item.children.length > 0 ? (
          <SidebarAccordion key={item.id} item={item} currentPath={currentPath} collapsed={collapsed} />
        ) : (
          <SidebarLink key={item.id} item={item} currentPath={currentPath} collapsed={collapsed} />
        )
      )}
    </div>
  );
});

const RoleSection = memo(function RoleSection({
  group,
  currentPath,
  collapsed,
}: {
  group: RoleMenuGroup;
  currentPath: string;
  collapsed: boolean;
}) {
  return (
    <div className="mb-5">
      {!collapsed && (
        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-sidebar-section">
          {group.roleName}
        </p>
      )}
      {collapsed && <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border" />}
      <SidebarMenuList items={group.items} currentPath={currentPath} collapsed={collapsed} />
    </div>
  );
});

export function AppSidebar() {
  const menuGroups = useMenu();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const fullname = useAuthStore((s) => s.fullname);
  const roles = useAuthStore((s) => s.roles);
  const location = useLocation();
  const currentPath = location.pathname;
  const memoizedGroups = useMemo(() => menuGroups, [menuGroups]);

  const initials = fullname
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 264 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar-bg"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
            >
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            </motion.div>
            <span className="text-lg font-bold tracking-tight text-sidebar-active-fg">
              IGEC Portal
            </span>
          </motion.div>
        )}
        {collapsed && (
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
          >
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </motion.div>
        )}
        {!collapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapsed}
            className="rounded-lg p-1.5 text-sidebar-fg transition-colors hover:bg-sidebar-hover"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="flex justify-center py-2">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapsed}
            className="rounded-lg p-1.5 text-sidebar-fg transition-colors hover:bg-sidebar-hover"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      )}

      {/* User mini-card */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-3 my-3 flex items-center gap-3 rounded-xl bg-sidebar-hover/60 px-3 py-2.5 backdrop-blur-sm"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20"
          >
            {initials}
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-active-fg">{fullname}</p>
            <p className="truncate text-[11px] text-sidebar-section">{roles.join(', ')}</p>
          </div>
        </motion.div>
      )}

      {/* Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin">
        {memoizedGroups.map((group) => (
          <RoleSection key={group.roleName} group={group} currentPath={currentPath} collapsed={collapsed} />
        ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-sidebar-border px-4 py-3"
        >
          <p className="text-center text-[10px] text-sidebar-section">© 2026 IGEC Portal</p>
        </motion.div>
      )}
    </motion.aside>
  );
}
