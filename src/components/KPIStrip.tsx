import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/dashboardStore';
import { computeKPIs } from '../utils/transform';

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};
const cardAnim = {
  hidden: { opacity: 0, y: 5 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

interface KPIItem { value: number; label: string; sub: string; color: string; }

const KPICard: React.FC<{ item: KPIItem }> = React.memo(({ item: k }) => (
  <motion.div
    variants={cardAnim}
    className="flex flex-col gap-0.5 rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 min-w-0 transition-shadow duration-150 hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-default"
  >
    <div className="text-[20px] font-bold leading-none tracking-tight" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>
      {k.value.toLocaleString()}
    </div>
    <div className="text-[9px] font-bold uppercase tracking-[0.6px] text-[#9B9992] truncate mt-0.5">{k.label}</div>
    <div className="text-[10px] text-[#C4C2BB] truncate">{k.sub}</div>
  </motion.div>
));
KPICard.displayName = 'KPICard';

export const KPIStrip: React.FC = () => {
  const allStudents   = useDashboardStore(s => s.allStudents);
  const totalStudents = useDashboardStore(s => s.totalStudentsFromAPI);
  const totalPrograms = useDashboardStore(s => s.totalProgramsFromAPI);
  const kpis = useMemo(() => computeKPIs(allStudents), [allStudents]);

  const cards: KPIItem[] = [
    { value: totalStudents,                          label: 'Total Students',  sub: `${allStudents.length} in view`,       color: '#18181A' },
    { value: totalPrograms,                          label: 'Programs',        sub: `${kpis.totalOpps} opp records`,       color: '#18181A' },
    { value: kpis.commenced + kpis.pipeline,         label: 'Active/Pipeline', sub: `${kpis.commenced} commenced`,         color: '#179E6F' },
    { value: kpis.approvedU + kpis.approvedC,        label: 'Approved Offers', sub: `${kpis.approvedU} unconditional`,     color: '#2B7FD4' },
    { value: kpis.nmi,                               label: 'Need Info',       sub: 'awaiting response',                   color: '#D97706' },
    { value: kpis.voidCount + kpis.duplicateDropped, label: 'Void/Duplicate',  sub: `${kpis.duplicateDropped} dup-drop`,   color: '#9B9992' },
    { value: kpis.rejected,                          label: 'Rejected',        sub: 'application rejected',                color: '#DC3545' },
    { value: kpis.noProgram,                         label: 'No Program',      sub: 'unassigned students',                 color: '#9B9992' },
  ];

  return (
    <motion.div
      className="grid gap-1.5 px-3"
      style={{ gridTemplateColumns: 'repeat(8,minmax(0,1fr))' }}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map(k => <KPICard key={k.label} item={k} />)}
    </motion.div>
  );
};
