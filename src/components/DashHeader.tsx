import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/dashboardStore';

const LiveDot: React.FC = () => (
  <span className="relative inline-flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#179E6F] opacity-60" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#179E6F]" />
  </span>
);

export const DashHeader: React.FC = () => {
  const total   = useDashboardStore(s => s.totalStudentsFromAPI);
  const programs = useDashboardStore(s => s.totalProgramsFromAPI);

  const now = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <motion.header
      className="flex items-center justify-between px-3 py-2 border-b border-[rgba(0,0,0,0.07)] bg-white flex-shrink-0"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#18181A]">
          <span className="text-white text-[13px] leading-none">◈</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-[#18181A] leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            EduCRM
          </span>
          <span className="text-[9px] font-semibold text-[#9B9992] uppercase tracking-[0.6px] leading-tight">
            Student Pipeline
          </span>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[rgba(0,0,0,0.09)] mx-1" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-[#9B9992]">
          <span className="text-[#C4C2BB]">Dashboard</span>
          <span>›</span>
          <span className="text-[#5C5B57] font-medium">Pipeline Overview</span>
        </nav>
      </div>

      {/* Right: live badge + meta */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-[#9B9992]">
          <span className="text-[#5C5B57] font-semibold font-mono">{total.toLocaleString()}</span> students
          <span className="text-[#D0CEC7]">·</span>
          <span className="text-[#5C5B57] font-semibold font-mono">{programs.toLocaleString()}</span> programs
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-[rgba(0,0,0,0.09)]" />

        <div className="flex items-center gap-1.5">
          <LiveDot />
          <span className="text-[9.5px] font-semibold text-[#179E6F] uppercase tracking-[0.5px]">Live</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-[rgba(0,0,0,0.09)]" />

        <span className="text-[10px] text-[#9B9992] font-mono">{now}</span>
      </div>
    </motion.header>
  );
};
