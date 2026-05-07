import { memo, useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';
import { useScaling } from '@/hooks/useScaling';
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
  const { sc, font, rem } = useScaling();
  const active = isPathActive(currentPath, item.href);
  const Icon = item.icon;

  return (
    <motion.div initial="rest" whileHover="hover" animate="rest">
      <Link
        to={item.resolvedUrl ?? '#'}
        title={collapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={`group relative flex items-center transition-all duration-200 rounded-xl
          ${active
            ? 'bg-sidebar-active text-sidebar-active-fg shadow-md shadow-sidebar-active/20'
            : 'text-sidebar-fg hover:bg-sidebar-hover'
          }
          ${collapsed ? 'justify-center px-2' : ''}
        `}
        style={{ gap: rem(0.75), paddingLeft: rem(0.75), paddingRight: rem(0.75), paddingTop: rem(0.625), paddingBottom: rem(0.625) }}
      >
        {/* Active indicator bar */}
        {active && !collapsed && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1/2 rounded-r-full bg-sidebar-active-fg/80"
            style={{ width: sc(4), height: sc(24), transform: 'translateY(-50%)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}
        {Icon && (
          <motion.span variants={iconPulse} className="shrink-0">
            <Icon style={{ width: sc(18), height: sc(18) }} />
          </motion.span>
        )}
        {!collapsed && (
          <motion.span variants={linkVariants} className="truncate" style={{ fontSize: font(0.875) }}>
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
  const { sc, font, rem } = useScaling();
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
          className={`flex w-full items-center justify-center rounded-xl transition-all duration-200
            ${childActive ? 'bg-sidebar-hover text-sidebar-active-fg' : 'text-sidebar-fg hover:bg-sidebar-hover'}`}
          title={item.label}
          aria-label={item.label}
          style={{ paddingLeft: rem(0.5), paddingRight: rem(0.5), paddingTop: rem(0.625), paddingBottom: rem(0.625) }}
        >
          {Icon && <Icon style={{ width: sc(18), height: sc(18) }} />}
        </motion.button>
        <div
          className="absolute left-full top-0 z-50 hidden rounded-xl border border-sidebar-border bg-sidebar-bg shadow-xl backdrop-blur-sm group-hover:block"
          style={{ marginLeft: rem(0.5), minWidth: rem(12), padding: rem(0.5) }}
        >
          <p
            className="font-bold uppercase tracking-wider text-sidebar-section"
            style={{ marginBottom: rem(0.25), paddingLeft: rem(0.5), paddingRight: rem(0.5), fontSize: font(0.7) }}
          >
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
        className={`flex w-full items-center rounded-xl transition-all duration-200
          ${childActive ? 'text-sidebar-active-fg' : 'text-sidebar-fg hover:bg-sidebar-hover'}`}
        style={{ gap: rem(0.75), paddingLeft: rem(0.75), paddingRight: rem(0.75), paddingTop: rem(0.625), paddingBottom: rem(0.625) }}
      >
        {Icon && (
          <motion.span variants={iconPulse} className="shrink-0">
            <Icon style={{ width: sc(18), height: sc(18) }} />
          </motion.span>
        )}
        <motion.span variants={linkVariants} className="flex-1 truncate text-left" style={{ fontSize: font(0.875) }}>
          {item.label}
        </motion.span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown style={{ width: sc(16), height: sc(16) }} className="opacity-60" />
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
            <div
              className="mt-1 space-y-0.5 border-l-2 border-sidebar-active/30"
              style={{ marginLeft: rem(1), paddingLeft: rem(0.75) }}
            >
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
  const { rem, font } = useScaling();
  return (
    <div style={{ marginBottom: rem(1.25) }}>
      {!collapsed && (
        <p
          className="font-bold uppercase tracking-widest text-sidebar-section"
          style={{ marginBottom: rem(0.5), paddingLeft: rem(0.75), paddingRight: rem(0.75), fontSize: font(0.7) }}
        >
          {group.roleName}
        </p>
      )}
      {collapsed && <div className="mx-auto bg-sidebar-border" style={{ marginBottom: rem(0.5), height: '1px', width: rem(1.5) }} />}
      <SidebarMenuList items={group.items} currentPath={currentPath} collapsed={collapsed} />
    </div>
  );
});

export function AppSidebar() {
  const { sc, font, rem } = useScaling();
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
  const navigate = useNavigate()

  return (
    <motion.aside
      animate={{ width: collapsed ? rem(4.25) : rem(16.5) }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar-bg"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center justify-between border-b border-sidebar-border"
        style={{ height: rem(4), paddingLeft: rem(1), paddingRight: rem(1) }}
      >
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center cusor-pointer"
            style={{ gap: rem(0.625) }}
            onClick={() => navigate('/dashboard')}
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              className="cursor-pointer flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
              style={{ width: sc(36), height: sc(36) }}
              onClick={() => navigate('/dashboard')}
            >
              <Sparkles style={{ width: sc(18), height: sc(18) }} className="text-primary-foreground" />
            </motion.div>
            <span
              className="font-bold tracking-tight text-sidebar-active-fg cursor-pointer"
              style={{ fontSize: font(1.125) }}
            >
              IGEC Portal
            </span>
          </motion.div>
        )}
        {collapsed && (
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            className="mx-auto flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
            style={{ width: sc(36), height: sc(36) }}
          >
            <Sparkles style={{ width: sc(18), height: sc(18) }} className="text-primary-foreground" />
          </motion.div>
        )}
        {!collapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapsed}
            className="rounded-lg text-sidebar-fg transition-colors hover:bg-sidebar-hover"
            style={{ padding: sc(6) }}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft style={{ width: sc(20), height: sc(20) }} />
          </motion.button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="flex justify-center cursor-pointer" style={{ paddingTop: rem(0.5), paddingBottom: rem(0.5) }}>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapsed}
            className="rounded-lg text-sidebar-fg transition-colors hover:bg-sidebar-hover"
            style={{ padding: sc(6) }}
            aria-label="Expand sidebar"
          >
            <ChevronRight style={{ width: sc(16), height: sc(16) }} />
          </motion.button>
        </div>
      )}

      {/* User mini-card */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-sidebar-hover/60 backdrop-blur-sm rounded-xl"
          style={{ marginLeft: rem(0.75), marginRight: rem(0.75), marginTop: rem(0.75), marginBottom: rem(0.75), gap: rem(0.75), paddingLeft: rem(0.75), paddingRight: rem(0.75), paddingTop: rem(0.625), paddingBottom: rem(0.625), display: 'flex', alignItems: 'center' }}
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-md shadow-primary/20"
            style={{ width: sc(36), height: sc(36), fontSize: font(0.75) }}
          >
            {initials}
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sidebar-active-fg" style={{ fontSize: font(0.875) }}>{fullname}</p>
            <p className="truncate text-sidebar-section" style={{ fontSize: font(0.7) }}>{roles.join(', ')}</p>
          </div>
        </motion.div>
      )}

      {/* Menu */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin"
        style={{ paddingLeft: rem(0.5), paddingRight: rem(0.5), paddingTop: rem(1), paddingBottom: rem(1) }}
      >
        {memoizedGroups.map((group) => (
          <RoleSection key={group.roleName} group={group} currentPath={currentPath} collapsed={collapsed} />
        ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-sidebar-border"
          style={{ paddingLeft: rem(1), paddingRight: rem(1), paddingTop: rem(0.75), paddingBottom: rem(0.75) }}
        >
          <p className="text-center text-sidebar-section" style={{ fontSize: font(0.625) }}>© 2026 IGEC Portal</p>
        </motion.div>
      )}
    </motion.aside>
  );
}
