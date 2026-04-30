import { motion } from 'framer-motion';
import { DashHeader } from '../components/DashHeader';
import { KPIStrip } from '../components/KPIStrip';
import { AnalyticsRow } from '../components/AnalyticsRow';
import { CrmDataGrid } from '../components/grid/CrmDataGrid';
import { AppLayout } from '@/components/AppLayout';
import {  useMediaQuery, useTheme } from '@mui/material';

export default function DashboardPage() {
    const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('xl'));
  return (
    <AppLayout>
      {/* <Box sx={{ display: 'grid', gap: 1, minWidth: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
    </Box> */}
      <div className="flex flex-col h-screen overflow-hidden bg-[#F9F8F6] gap-2 pb-2">
        {/* <DashHeader />
        <KPIStrip />
        <AnalyticsRow /> */}
        <div className="flex-1 min-h-0 px-3 flex flex-col">
          <CrmDataGrid />
        </div>
        <motion.footer
          className="px-3 flex items-center justify-between flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-[9.5px] text-[#C4C2BB]">
            133 total students · 500 programs · MUI X DataGrid Pro v7 · React 19.2 · Framer Motion
          </span>
          <span className="text-[9.5px] text-[#C4C2BB] font-mono">
            Composite Pattern · Zustand · Tailwind v4 · shadcn/ui primitives
          </span>
        </motion.footer>
      </div>
    </AppLayout>
  );
}