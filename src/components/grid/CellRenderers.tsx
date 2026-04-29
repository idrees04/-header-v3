import React from 'react';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { GridRow } from '@/lib/gridRows';
import { getLevelConfig, getStudentStageConfig } from '@/lib/stageConfig';
import { Badge } from '../ui/Badgecopy';
import { Tooltip } from '@mui/material';

// ── Shared helpers ─────────────────────────────────────────

/** Tooltip wrapper for any truncated text cell */
const TooltipCell: React.FC<{
  value?: string | null;
  className?: string;
}> = ({ value, className = '' }) => {
  const text = value || '—';
  if (text === '—') return <span className="text-[10px] text-[#C4C2BB]">—</span>;
  return (
    <Tooltip
      title={text}
      arrow
      slotProps={{
        tooltip: {
          sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: '0.75rem' },
        },
      }}
    >
      <span
        className={`block overflow-hidden text-ellipsis whitespace-nowrap max-w-full ${className}`}
        title={text}
      >
        {text}
      </span>
    </Tooltip>
  );
};

// ── Name cell ──────────────────────────────────────────────
// Student rows only — opp rows no longer exist in the grid.
export const NameCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  const displayName =
    row.std_name && row.std_name.length > 30
      ? `${row.std_name.slice(0, 30)}…`
      : row.std_name;

  return (
    <Tooltip
      title={row.std_name || '—'}
      arrow
      slotProps={{
        tooltip: {
          sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: '0.75rem' },
        },
      }}
    >
      <span className="block overflow-hidden text-ellipsis whitespace-nowrap max-w-full font-medium text-[11px] text-[#18181A]">
        {displayName || '—'}
      </span>
    </Tooltip>
  );
});
NameCell.displayName = 'NameCell';

// ── CRM # cell ─────────────────────────────────────────────
export const CrmCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  return (
    <TooltipCell
      value={row.std_crm_number}
      className="font-mono text-[10.5px] text-[#18181A]"
    />
  );
});
CrmCell.displayName = 'CrmCell';

// ── Gender cell ────────────────────────────────────────────
export const GenderCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  const g = row.std_gender;
  return (
    <Tooltip
      title={g || '—'}
      arrow
      slotProps={{
        tooltip: {
          sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: '0.75rem' },
        },
      }}
    >
      <span
        className={`${g === 'female' ? 'text-[#C2507A]' : g === 'male' ? 'text-[#2B7FD4]' : 'text-[#C4C2BB]'}`}
      >
        {g === 'male' ? '♂' : g === 'female' ? '♀' : '—'}
      </span>
    </Tooltip>
  );
});
GenderCell.displayName = 'GenderCell';

// ── Phone cell ─────────────────────────────────────────────
export const PhoneCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  return (
    <TooltipCell
      value={row.std_phone_mobile}
      className="font-mono text-[10.5px] text-[#18181A]"
    />
  );
});
PhoneCell.displayName = 'PhoneCell';

// ── Email cell ─────────────────────────────────────────────
export const EmailCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  return (
    <TooltipCell
      value={row.std_email}
      className="text-[10.5px] text-[#18181A]"
    />
  );
});
EmailCell.displayName = 'EmailCell';


// ── PASSPORT cell ─────────────────────────────────────────────
export const PassportCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  return (
    <TooltipCell
      value={row.std_passport}
      className="text-[10.5px] text-[#18181A]"
    />
  );
});
PassportCell.displayName = 'PassportCell';
// ── Nationality cell ───────────────────────────────────────
export const NatCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  const nat = row.std_nationality;
  if (!nat || nat === '—' || nat === '---')
    return <span className="text-[#D0CEC7]">—</span>;
  return (
    <TooltipCell
      value={nat}
      className="text-[10.5px] text-[#18181A]"
    />
  );
});
NatCell.displayName = 'NatCell';

// ── Student Stage badge ────────────────────────────────────
export const StudentStageCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (!row.std_stage) return <span className="text-[#D0CEC7] text-[10px]">—</span>;
  const cfg = getStudentStageConfig(row.std_stage);
  return (
    <Badge variant={cfg.variant} size="sm" dot dotColor={cfg.dot} className="max-w-full">
      <span className="truncate">{cfg.label}</span>
    </Badge>
  );
});
StudentStageCell.displayName = 'StudentStageCell';
export const StudentSubAgent = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  if (!row.std_subagent) return <span className="text-[#D0CEC7] text-[10px]">—</span>;
  const cfg = getStudentStageConfig(row.std_subagent);
  return (
    <Badge variant={cfg.variant} size="sm" dot dotColor={cfg.dot} className="max-w-full">
      <span className="truncate">{cfg.label}</span>
    </Badge>
  );
});
StudentSubAgent.displayName = 'StudentSubAgent';

// ── Opportunity count badge ────────────────────────────────
export const OppCountCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  const n = row.opp_count;
  const color =
    n === 0 ? '#C4C2BB' : n >= 7 ? '#DC3545' : n >= 4 ? '#D97706' : '#2B7FD4';
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

// ── Date cell ──────────────────────────────────────────────
export const DateCell = React.memo(
  (params: GridRenderCellParams<GridRow> & { field: keyof GridRow }) => {
    const row = params.row as GridRow;
    const val = row[params.field] as string | undefined;
    if (!val || val === '—')
      return <span className="text-[#D0CEC7] text-[10px]">—</span>;
    return (
      <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">{val}</span>
    );
  }
);
DateCell.displayName = 'DateCell';

// ── Level badge (student-level usage only, kept for reuse) ─
export const LevelCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  // opp_course_level no longer lives on GridRow — kept as a no-op stub
  // to avoid breaking any external imports until cleaned up.
  void row;
  return null;
});
LevelCell.displayName = 'LevelCell';
