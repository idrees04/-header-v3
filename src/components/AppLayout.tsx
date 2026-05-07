import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useThemeStore } from '@/stores/themeStore';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useScaling } from '@/hooks/useScaling';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { rem, sc } = useScaling();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const collapsed = useSidebarStore((s) => s.collapsed);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <AppSidebar />
      <motion.div
        animate={{ marginLeft: collapsed ? rem(4.25) : rem(16.5) }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-1 flex-col min-w-0 overflow-x-auto"
      >
        <AppHeader />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1"
          style={{ padding: sc(24) }}
        >
          {children}
        </motion.main>
      </motion.div>
    </div>
  );
}
