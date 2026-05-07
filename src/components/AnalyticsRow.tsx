import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MiniBarChart } from './MiniBarChart';
import { useDashboardStore } from '../stores/dashboardStore';
import { computeOfficeBreakdown, computeNationalityBreakdown, computeStageBreakdown } from '../utils/transform';

const STAGE_COLORS: Record<string, string> = {
  'Commenced': '#179E6F', 'Offer Approved Conditional': '#D97706', 'Offer Approved Unconditional': '#2B7FD4',
  'Pipeline First Commencement': '#6D4FC2', 'Need More Information': '#EF9F27', 'Void': '#9B9992',
  'Duplicate Dropped': '#C2507A', 'Application Rejected': '#DC3545',
};
const OFF_COLORS = ['#2B7FD4', '#6D4FC2', '#179E6F', '#D97706', '#EF9F27', '#DC3545', '#C2507A'];
const NAT_COLORS = ['#6D4FC2', '#179E6F', '#2B7FD4', '#EF9F27', '#DC3545', '#C2507A', '#D97706'];

const row = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};
const chartAnim = {
  hidden: { opacity: 0, y: 4 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const AnalyticsRow: React.FC = () => {
  const allStudents = useDashboardStore(s => s.allStudents);
  const officeData = useMemo(() => computeOfficeBreakdown(allStudents), [allStudents]);
  const natData = useMemo(() => computeNationalityBreakdown(allStudents), [allStudents]);
  const stageData = useMemo(() => computeStageBreakdown(allStudents), [allStudents]);
  const stageColors = useMemo(() => Object.keys(stageData).map(k => STAGE_COLORS[k] ?? '#9B9992'), [stageData]);

  return (
    <motion.div className="grid grid-cols-3 gap-1.5 px-3" variants={row} initial="hidden" animate="show">
      {[
        { title: 'Pipeline Stage', data: stageData, colors: stageColors },
        { title: 'Students by Office', data: officeData, colors: OFF_COLORS },
        { title: 'Nationality Mix', data: natData, colors: NAT_COLORS },
      ].map(c => (
        <motion.div key={c.title} variants={chartAnim}>
          <MiniBarChart title={c.title} data={c.data} colors={c.colors} />
        </motion.div>
      ))}
    </motion.div>
  );
};
