import { memo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Menu, Sun, Moon, Clock, ChevronRight, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useThemeStore } from '@/stores/themeStore';

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
    navigate({ to: '/' });
  };

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <header className="flex h-16 items-center justify-between border-b border-header-border bg-header-bg px-6">
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleCollapsed}
          className="rounded-xl p-2 text-header-fg transition-colors hover:bg-accent lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        {/* Breadcrumb */}
        <nav className="hidden items-center gap-1 text-sm sm:flex" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-1"
            >
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              <span
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

      <div className="flex items-center gap-1.5">
        {/* Clock */}
        <div className="hidden items-center gap-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground md:flex">
          <Clock className="h-3.5 w-3.5" />
          <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative rounded-xl p-2.5 text-header-fg transition-colors hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        </motion.button>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 15 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-header-fg transition-colors hover:bg-accent"
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
              {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* User dropdown */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-accent"
            aria-label="User menu"
            aria-haspopup="true"
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold
                ${isSpecialUser
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 shadow-md shadow-primary/20'
                  : 'bg-accent text-accent-foreground'
                }`}
            >
              {initials}
            </motion.div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-header-fg">{fullname}</p>
              <p className="text-[11px] text-muted-foreground">{greeting}</p>
            </div>
          </motion.button>

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-1 hidden min-w-52 rounded-xl border bg-popover p-1.5 shadow-xl group-hover:block">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-popover-foreground">{fullname}</p>
                <p className="text-xs text-muted-foreground">{roles[0]}</p>
              </div>
            </div>
            <div className="my-1 h-px bg-border" />
            <motion.button
              whileHover={{ x: 2 }}
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
});
