import { memo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Menu, Sun, Moon, Clock, ChevronRight, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useThemeStore } from '@/stores/themeStore';
import { useScaling } from '@/hooks/useScaling';

function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function getBreadcrumbs(pathname: string): string[] {
  return pathname
    .split('/')
    .filter(Boolean)
    .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
}

export const AppHeader = memo(function AppHeader() {
  const { sc, font, rem } = useScaling();
  const fullname = useAuthStore((s) => s.fullname);
  const roles = useAuthStore((s) => s.roles);
  const logout = useAuthStore((s) => s.logout);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const navigate = useNavigate();
  const location = useLocation();
  const now = useClock();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const isSpecialUser = fullname === 'Mohammad Nimrawi';
  const initials = fullname
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <header 
      className="flex items-center justify-between border-b border-header-border bg-header-bg"
      style={{ height: rem(4), paddingLeft: rem(1.5), paddingRight: rem(1.5) }}
    >
      <div className="flex items-center" style={{ gap: rem(0.75) }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleCollapsed}
          className="rounded-xl transition-colors hover:bg-accent lg:hidden"
          style={{ padding: sc(8) }}
          aria-label="Toggle menu"
        >
          <Menu style={{ width: sc(20), height: sc(20) }} className="text-header-fg" />
        </motion.button>

        {/* Breadcrumb */}
        <nav className="hidden items-center sm:flex" style={{ gap: rem(0.25) }} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center"
              style={{ gap: rem(0.25) }}
            >
              {i > 0 && <ChevronRight style={{ width: sc(14), height: sc(14) }} className="text-muted-foreground" />}
              <span
                style={{ fontSize: font(0.875) }}
                className={
                  i === breadcrumbs.length - 1
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground'
                }
              >
                {crumb}
              </span>
            </motion.span>
          ))}
        </nav>
      </div>

      <div className="flex items-center" style={{ gap: rem(0.375) }}>
        {/* Clock */}
        <div 
          className="hidden items-center rounded-xl bg-muted font-medium text-muted-foreground md:flex"
          style={{ gap: rem(0.375), paddingLeft: rem(0.75), paddingRight: rem(0.75), paddingTop: rem(0.375), paddingBottom: rem(0.375) }}
        >
          <Clock style={{ width: sc(14), height: sc(14) }} />
          <span style={{ fontSize: font(0.75) }}>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative rounded-xl transition-colors hover:bg-accent"
          style={{ padding: sc(10) }}
          aria-label="Notifications"
        >
          <Bell style={{ width: sc(18), height: sc(18) }} className="text-header-fg" />
          <span className="absolute flex" style={{ right: sc(6), top: sc(6), width: sc(8), height: sc(8) }}>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-full w-full rounded-full bg-primary" />
          </span>
        </motion.button>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 15 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          className="rounded-xl transition-colors hover:bg-accent"
          style={{ padding: sc(10) }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {theme === 'light' ? <Moon style={{ width: sc(18), height: sc(18) }} /> : <Sun style={{ width: sc(18), height: sc(18) }} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* User dropdown */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center rounded-xl transition-colors hover:bg-accent"
            style={{ gap: rem(0.75), paddingLeft: rem(0.75), paddingRight: rem(0.75), paddingTop: rem(0.5), paddingBottom: rem(0.5) }}
            aria-label="User menu"
            aria-haspopup="true"
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              className={`flex items-center justify-center rounded-full font-bold
                ${isSpecialUser
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 shadow-md shadow-primary/20'
                  : 'bg-accent text-accent-foreground'
                }`}
              style={{ width: sc(36), height: sc(36), fontSize: font(0.875) }}
            >
              {initials}
            </motion.div>
            <div className="hidden text-left sm:block">
              <p className="font-semibold text-header-fg" style={{ fontSize: font(0.875) }}>{fullname}</p>
              <p className="text-muted-foreground" style={{ fontSize: font(0.7) }}>{greeting}</p>
            </div>
          </motion.button>

          {/* Dropdown */}
          <div 
            className="absolute right-0 top-full z-50 mt-1 hidden rounded-xl border bg-popover shadow-xl group-hover:block"
            style={{ minWidth: rem(13), padding: sc(6) }}
          >
            <div className="flex items-center rounded-xl" style={{ gap: rem(0.75), padding: sc(10) }}>
              <User style={{ width: sc(16), height: sc(16) }} className="text-muted-foreground" />
              <div>
                <p className="font-semibold text-popover-foreground" style={{ fontSize: font(0.875) }}>{fullname}</p>
                <p className="text-muted-foreground" style={{ fontSize: font(0.75) }}>{roles[0]}</p>
              </div>
            </div>
            <div className="my-1 h-px bg-border" />
            <motion.button
              whileHover={{ x: 2 }}
              onClick={handleLogout}
              className="flex w-full items-center rounded-xl text-destructive transition-colors hover:bg-destructive/10"
              style={{ gap: rem(0.75), padding: sc(10), fontSize: font(0.875) }}
            >
              <LogOut style={{ width: sc(16), height: sc(16) }} />
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
});
