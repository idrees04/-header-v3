import React from 'react';
import { motion } from 'framer-motion';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { GridRow } from '@/lib/gridRows';
import { getLevelConfig, getOppStageConfig, getStudentStageConfig } from '@/lib/stageConfig';
import { Badge } from '../ui/Badge';
// import { Badge } from './ui/Badge';
// import type { GridRow } from '../lib/gridRows';
// import { getOppStageConfig, getLevelConfig, getStudentStageConfig } from '../lib/stageConfig';

// ── Shared ────────────────────────────────────────────────
const Truncated: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <span
    className={`block overflow-hidden text-ellipsis whitespace-nowrap max-w-full ${className ?? ''}`}
    title={text}
  >
    {text || '—'}
  </span>
);

// ── Name cell (student bold, opp indent) ──────────────────
export const NameCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind === 'student') {
    return (
      <span
        className="font-semibold text-[11.5px] text-[#18181A] block overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
        title={row.std_name}
      >
        {row.std_name}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-[#18181A] min-w-0">
      <span className="text-[#9B9992] text-[10px] flex-shrink-0">↳</span>
      <Truncated text={row.opp_name} className="text-[10.5px] text-[#18181A]" />
    </span>
  );
});
NameCell.displayName = 'NameCell';

// ── CRM cell ──────────────────────────────────────────────
export const CrmCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'student') {
    return <span className="text-[10px] text-[#C4C2BB]">—</span>;
  }
  return (
    <span
      className="font-mono text-[10.5px] text-[#18181A] tracking-tight"
      title={row.std_crm_number}
    >
      {row.std_crm_number}
    </span>
  );
});
CrmCell.displayName = 'CrmCell';

// ── Gender cell ───────────────────────────────────────────
export const GenderCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'student') return null;
  const g = row.std_gender;
  if (g === 'male') return <span className="text-[#2B7FD4] text-[11px]" title="Male">♂</span>;
  if (g === 'female') return <span className="text-[#C2507A] text-[11px]" title="Female">♀</span>;
  return <span className="text-[#D0CEC7] text-[10px]">?</span>;
});
GenderCell.displayName = 'GenderCell';

// ── Nationality ───────────────────────────────────────────
export const NatCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'student') return <span className="text-[#D0CEC7]">—</span>;
  const nat = row.std_nationality;
  if (!nat || nat === '—' || nat === '---') return <span className="text-[#D0CEC7]">—</span>;
  return (
    <span className="text-[10.5px] text-[#18181A] capitalize truncate block max-w-full" title={nat}>
      {nat}
    </span>
  );
});
NatCell.displayName = 'NatCell';

// ── Student Stage chip ────────────────────────────────────
export const StudentStageCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'student') return null;
  const cfg = getStudentStageConfig(row.std_stage);
  return (
    <Badge variant={cfg.variant} size="sm" dot dotColor={cfg.dot} className="max-w-full">
      <span className="truncate">{cfg.label}</span>
    </Badge>
  );
});
StudentStageCell.displayName = 'StudentStageCell';

// ── Opp stage chip ────────────────────────────────────────
export const OppStageCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'opportunity') return null;
  const cfg = getOppStageConfig(row.opp_salaes_stage);
  return (
    <Badge variant={cfg.variant} size="sm" dot dotColor={cfg.dot} className="max-w-full">
      <span className="truncate">{cfg.label}</span>
    </Badge>
  );
});
OppStageCell.displayName = 'OppStageCell';

// ── Level badge ───────────────────────────────────────────
export const LevelCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'opportunity') return null;
  const cfg = getLevelConfig(row.opp_course_level);
  if (!cfg) return <span className="text-[#D0CEC7] text-[10px]">—</span>;
  return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
});
LevelCell.displayName = 'LevelCell';

// ── Opp count badge ───────────────────────────────────────
export const OppCountCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'student') return null;
  const n = row.opp_count;
  const color = n === 0 ? '#C4C2BB' : n >= 7 ? '#DC3545' : n >= 4 ? '#D97706' : '#2B7FD4';
  return (
    <span
      className="inline-flex items-center justify-center font-bold font-mono rounded-[4px] border"
      style={{
        fontSize: '11px',
        color,
        borderColor: color + '44',
        minWidth: 22,
        height: 18,
        padding: '0 4px',
      }}
    >
      {n}
    </span>
  );
});
OppCountCell.displayName = 'OppCountCell';

// ── Generic text cell (muted on opp rows for student cols) ─
export const TextCell = React.memo((
  params: GridRenderCellParams<GridRow> & { field: keyof GridRow; oppField?: keyof GridRow }
) => {
  const row = params.row as GridRow;
  const val = row.kind === 'student'
    ? (row[params.field] as string)
    : params.oppField
      ? (row[params.oppField] as string | null)
      : null;

  if (!val || val === '—' || val === '---') {
    return <span className="text-[#D0CEC7] text-[10px]">—</span>;
  }
  return (
    <span
      className={`block overflow-hidden text-ellipsis whitespace-nowrap max-w-full text-[10.5px] ${row.kind === 'opportunity' ? 'text-[#18181A]' : 'text-[#18181A]'
        }`}
      title={val}
    >
      {val}
    </span>
  );
});
TextCell.displayName = 'TextCell';

// ── Date cell ─────────────────────────────────────────────
export const DateCell = React.memo((
  params: GridRenderCellParams<GridRow> & { field: keyof GridRow; oppField?: keyof GridRow }
) => {
  const row = params.row as GridRow;
  const val = row.kind === 'student'
    ? (row[params.field] as string)
    : params.oppField ? (row[params.oppField] as string | null) : null;
  if (!val) return <span className="text-[#D0CEC7] text-[10px]">—</span>;
  return (
    <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">{val}</span>
  );
});
DateCell.displayName = 'DateCell';

// ── Program name (opp only) ───────────────────────────────
export const ProgramCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'opportunity') return null;
  return (
    <span
      className="text-[10.5px] text-[#18181A] block overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
      title={row.opp_name}
    >
      {row.opp_name || '—'}
    </span>
  );
});
ProgramCell.displayName = 'ProgramCell';

// ── Institute (opp only) ──────────────────────────────────
export const InstituteCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (row.kind !== 'opportunity') return null;
  return (
    <span
      className="text-[10.5px] text-[#18181A] block overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
      title={row.opp_institute_name}
    >
      {row.opp_institute_name || '—'}
    </span>
  );
});
InstituteCell.displayName = 'InstituteCell';

// ── Animated row wrapper (used via getRowClassName + sx) ──
export const RowMotionWrapper: React.FC<{
  children: React.ReactNode;
  isStudent: boolean;
}> = ({ children, isStudent }) => (
  <motion.div
    className="w-full h-full"
    whileHover={{
      scale: isStudent ? 1.007 : 1.003,
      boxShadow: isStudent
        ? '0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)'
        : '0 1px 4px rgba(0,0,0,0.04)',
    }}
    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);
