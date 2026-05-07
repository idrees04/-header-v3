import React from 'react';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { GridRow } from '@/lib/gridRows';
import { getLevelConfig, getStudentStageConfig } from '@/lib/stageConfig';
import { Badge } from '../ui/Badgecopy';
import { Tooltip } from '@mui/material';
import { useScaling } from '@/hooks/useScaling';

// ── Shared helpers ─────────────────────────────────────────

/** Tooltip wrapper for any truncated text cell */
const TooltipCell: React.FC<{
  value?: string | null;
  className?: string;
  baseSize?: number;
}> = ({ value, className = '', baseSize = 0.875 }) => {
  const { font } = useScaling();
  const text = value || '—';
  
  if (text === '—') {
    return <span className="text-black" style={{ fontSize: font(0.625) }}>—</span>;
  }

  return (
    <Tooltip
      title={text}
      arrow
      slotProps={{
        tooltip: {
          sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: font(0.75) },
        },
      }}
    >
      <span
        className={`block overflow-hidden text-ellipsis whitespace-nowrap max-w-full ${className}`}
        style={{ fontSize: font(baseSize) }}
        title={text}
      >
        {text}
      </span>
    </Tooltip>
  );
};

// ── Name cell ──────────────────────────────────────────────
export const NameCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const { font } = useScaling();
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
          sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: font(0.75) },
        },
      }}
    >
      <span 
        className="block overflow-hidden text-ellipsis whitespace-nowrap max-w-full font-medium text-[#008000]"
        style={{ fontSize: font(0.875) }}
      >
        {displayName || '—'}
      </span>
    </Tooltip>
  );
});
NameCell.displayName = 'NameCell';

// ── Enrolled cell ──────────────────────────────────────────
export const EnrolledCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const { font } = useScaling();
  const row = params.row as GridRow;
  return (
    <span className="text-black whitespace-nowrap" style={{ fontSize: font(0.875) }}>
      {row.std_date_entered || '—'}
    </span>
  );
});
EnrolledCell.displayName = 'EnrolledCell';

// ── CRM # cell ─────────────────────────────────────────────
export const CrmCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const row = params.row as GridRow;
  return (
    <TooltipCell
      value={row.std_crm_number}
      className="font-mono text-black"
    />
  );
});
CrmCell.displayName = 'CrmCell';

// ── Gender cell ────────────────────────────────────────────
export const GenderCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const { font } = useScaling();
  const row = params.row as GridRow;
  const g = row.std_gender;
  return (
    <Tooltip
      title={g || '—'}
      arrow
      slotProps={{
        tooltip: {
          sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: font(0.75) },
        },
      }}
    >
      <span
        className={`${g === 'female' ? 'text-[#C2507A]' : g === 'male' ? 'text-[#2B7FD4]' : 'text-black'}`}
        style={{ fontSize: font(0.875) }}
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
      className="font-mono text-black"
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
      className="text-black"
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
      className="text-black"
    />
  );
});
PassportCell.displayName = 'PassportCell';

// ── Nationality cell ───────────────────────────────────────
export const NatCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const { font } = useScaling();
  const row = params.row as GridRow;
  const nat = row.std_nationality;
  if (!nat || nat === '—' || nat === '---')
    return <span className="text-black" style={{ fontSize: font(0.875) }}>—</span>;
  return (
    <TooltipCell
      value={nat}
      className="text-black"
    />
  );
});
NatCell.displayName = 'NatCell';

// ── Student Stage badge ────────────────────────────────────
export const StudentStageCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const { font } = useScaling();
  const row = params.row as GridRow;
  if (!row.std_stage) return <span className="text-black" style={{ fontSize: font(0.875) }}>—</span>;
  const cfg = getStudentStageConfig(row.std_stage);
  return (
    <Badge variant={cfg.variant} size="sm" dot dotColor={cfg.dot} className="max-w-full">
      <span className="truncate" style={{ fontSize: font(0.875) }}>{cfg.label}</span>
    </Badge>
  );
});
StudentStageCell.displayName = 'StudentStageCell';

export const StudentSubAgent = React.memo((params: GridRenderCellParams<GridRow>) => {
  const { font } = useScaling();
  const row = params.row as GridRow;
  if (!row.std_subagent) return <span className="text-black" style={{ fontSize: font(0.875) }}>—</span>;
  const cfg = getStudentStageConfig(row.std_subagent);
  return (
    <TooltipCell
      value={cfg.label}
      className="font-mono text-black"
    />
  );
});
StudentSubAgent.displayName = 'StudentSubAgent';

// ── Opportunity count badge ────────────────────────────────
export const OppCountCell = React.memo((params: GridRenderCellParams<GridRow>) => {
  const { sc, font } = useScaling();
  const row = params.row as GridRow;
  const n = row.opp_count;

  const color =
    n === 0 ? '#C4C2BB' : n >= 7 ? '#DC3545' : n >= 4 ? '#D97706' : '#2B7FD4';
  return (
    <span
      className="inline-flex items-center justify-center font-bold font-mono rounded border"
      style={{
        fontSize: font(0.875),
        color,
        borderColor: color + '44',
        minWidth: sc(22),
        height: sc(18),
        padding: `0 ${sc(4)}px`,
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
    const { font } = useScaling();
    const row = params.row as GridRow;
    const val = row[params.field] as string | undefined;
    if (!val || val === '—')
      return <span className="text-black" style={{ fontSize: font(0.875) }}>—</span>;
    return (
      <span className="font-mono text-black whitespace-nowrap" style={{ fontSize: font(0.875) }}>{val}</span>
    );
  }
);
DateCell.displayName = 'DateCell';
