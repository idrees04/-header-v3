import React from 'react';
import { Tooltip, Avatar, AvatarGroup } from '@mui/material';
import type { Student, Opportunity } from '@/types';
import { Badge } from '@/components/ui/Badgecopy';
import { getLevelConfig, getOppStageConfig } from '@/lib/stageConfig';

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

const dash = (v?: string | null) =>
  !v || v.trim() === '' || v === '—' || v.toLowerCase() === 'n/a' ? '—' : v;

const TooltipText: React.FC<{ value?: string | null; className?: string }> = ({
  value,
  className = '',
}) => {
  const text = dash(value);
  if (text === '—') return <span className="text-[#C4C2BB] text-[10px]">—</span>;
  return (
    <Tooltip
      title={text}
      arrow
      slotProps={{ tooltip: { sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: '0.7rem' } } }}
    >
      <span
        className={`block overflow-hidden text-ellipsis whitespace-nowrap max-w-full text-[10.5px] text-[#18181A] ${className}`}
      >
        {text}
      </span>
    </Tooltip>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Opp-level team avatars  (stacked AvatarGroup — same style as main TEAM col)
// ─────────────────────────────────────────────────────────────────────────────

const OPP_AVATAR_COLORS = {
  adm_officer: '#3b82f6',
  counselor: '#10b981',
  office: '#8b5cf6',
  subagent: '#f97316',
} as const;

type AvatarType = keyof typeof OPP_AVATAR_COLORS;

interface OppRole {
  name: string;
  tooltip: string;
  type: AvatarType;
}

const isValidVal = (v?: string | null): v is string =>
  !!v && v.trim() !== '' && v !== '—' && v.toLowerCase() !== 'n/a';

const makeInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

const OppTeamAvatars: React.FC<{ opp: Opportunity }> = ({ opp }) => {
  const roles: OppRole[] = [];

  if (isValidVal(opp.opp_adm_officer))
    roles.push({
      name: opp.opp_adm_officer!.trim(),
      tooltip: `Program - Admission Officer: ${opp.opp_adm_officer}`,
      type: 'adm_officer',
    });

  if (isValidVal(opp.opp_counselor))
    roles.push({
      name: opp.opp_counselor!.trim(),
      tooltip: `Program - Counsellor: ${opp.opp_counselor}`,
      type: 'counselor',
    });

  if (isValidVal(opp.opp_office))
    roles.push({
      name: opp.opp_office!.trim(),
      tooltip: `Program is under Office: ${opp.opp_office}`,
      type: 'office',
    });

  if (roles.length === 0)
    return <span className="text-[#C4C2BB] text-[10px]">—</span>;

  return (
    <div className="flex items-center justify-center">
      <AvatarGroup
        max={3}
        spacing={2}
        sx={{
          '& .MuiAvatarGroup-avatar': {
            border: 'none',
          },
          '& .MuiAvatar-root': {
            transition: 'transform 0.15s ease',
          },
          '& .MuiAvatar-root:hover': {
            transform: 'scale(1.12)',
            zIndex: 10,
          },
        }}
      >
        {roles.map((role, idx) => (
          <Tooltip
            key={`${role.type}-${idx}`}
            title={role.tooltip}
            arrow
            slotProps={{
              tooltip: {
                sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: '0.7rem' },
              },
            }}
          >
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: '0.68rem',
                fontWeight: 600,
                bgcolor: OPP_AVATAR_COLORS[role.type],
                color: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
              }}
            >
              {makeInitials(role.name)}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage badge
// ─────────────────────────────────────────────────────────────────────────────

const StageBadge: React.FC<{ stage?: string | null }> = ({ stage }) => {
  const cfg = getOppStageConfig(stage ?? null);
  return (
    <Badge variant={cfg.variant} size="sm" dot dotColor={cfg.dot}>
      <span className="truncate">{cfg.label}</span>
    </Badge>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Level badge
// ─────────────────────────────────────────────────────────────────────────────

const LevelBadge: React.FC<{ level?: string | null }> = ({ level }) => {
  const cfg = getLevelConfig(level ?? null);
  if (!cfg) return <span className="text-[#C4C2BB] text-[10px]">—</span>;
  return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Date display (monospace)
// ─────────────────────────────────────────────────────────────────────────────

const DateVal: React.FC<{ value?: string | null }> = ({ value }) => {
  const text = dash(value);
  if (text === '—') return <span className="text-[#C4C2BB] text-[10px]">—</span>;
  return <span className="font-mono text-[10px] text-[#18181A] whitespace-nowrap">{text}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Single opportunity row
// ─────────────────────────────────────────────────────────────────────────────

const OppRow: React.FC<{ opp: Opportunity; index: number }> = ({ opp, index }) => {
  const isEven = index % 2 === 0;

  return (
    <tr
      style={{
        backgroundColor: isEven ? '#FFFFFF' : '#F5F4F1',
        height: 30,
      }}
    >
      {/* # */}
      <td className="px-2 text-center">
        <span
          className="inline-flex items-center justify-center font-mono font-bold text-[10px] rounded"
          style={{
            minWidth: 20,
            height: 18,
            color: '#5C5B57',
            background: '#ECEAE5',
            padding: '0 4px',
          }}
        >
          {index + 1}
        </span>
      </td>

      {/* Program */}
      <td className="px-3" style={{ maxWidth: 200, minWidth: 140 }}>
        <TooltipText value={opp.opp_name} className="font-medium" />
      </td>

      {/* Institute */}
      <td className="px-3" style={{ maxWidth: 180, minWidth: 120 }}>
        <TooltipText value={opp.opp_institute_name} />
      </td>

      {/* Level */}
      <td className="px-2 text-center" style={{ minWidth: 64 }}>
        <LevelBadge level={opp.opp_course_level} />
      </td>

      {/* Stage */}
      <td className="px-2" style={{ minWidth: 110 }}>
        <StageBadge stage={opp.opp_salaes_stage} />
      </td>

      {/* Commence */}
      <td className="px-2" style={{ minWidth: 88 }}>
        <DateVal value={opp.opp_commence_date} />
      </td>

      {/* Last Change */}
      <td className="px-2" style={{ minWidth: 88 }}>
        <DateVal value={opp.opp_last_stage_change_date} />
      </td>

      {/* Entered */}
      <td className="px-2" style={{ minWidth: 88 }}>
        <DateVal value={opp.opp_date_entered} />
      </td>

      {/* Team — stacked avatars (Adm. Officer, Counsellor, Office) */}
      <td className="px-2 text-center" style={{ minWidth: 90 }}>
        <OppTeamAvatars opp={opp} />
      </td>
      {/* Sub-agent */}
      <td className="px-3" style={{ minWidth: 100 }}>
        <TooltipText value={opp.opp_subagent} />
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions for the sub-table header
// ─────────────────────────────────────────────────────────────────────────────

const OPP_COLUMNS: Array<{ label: string; align?: 'center' | 'left'; minWidth?: number }> = [
  { label: '#', align: 'center', minWidth: 32 },
  { label: 'Program', align: 'left', minWidth: 140 },
  { label: 'Institute', align: 'left', minWidth: 120 },
  { label: 'Level', align: 'center', minWidth: 64 },
  { label: 'Stage', align: 'left', minWidth: 110 },
  { label: 'Commence', align: 'left', minWidth: 88 },
  { label: 'Last Change', align: 'left', minWidth: 88 },
  { label: 'Entered', align: 'left', minWidth: 88 },
  { label: 'Team', align: 'center', minWidth: 90 },
  { label: 'Sub-Agent', align: 'left', minWidth: 100 },

];

// ─────────────────────────────────────────────────────────────────────────────
// Panel header strip
// ─────────────────────────────────────────────────────────────────────────────

const PanelHeader: React.FC<{ oppCount: number }> = ({ oppCount }) => (
  <div
    className="flex items-center gap-2 px-4 py-1.5"
    style={{
      background: '#E8E6E0',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
    }}
  >
    <span
      className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#5C5B57]"
    >
      ◈ Application Records
    </span>
    <span
      className="inline-flex items-center justify-center font-mono font-bold text-[9px] rounded-full"
      style={{
        minWidth: 18,
        height: 18,
        color: '#2B7FD4',
        background: 'rgba(43,127,212,0.1)',
        border: '1px solid rgba(43,127,212,0.25)',
        padding: '0 5px',
      }}
    >
      {oppCount}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────────────────────────────────────

interface OppDetailPanelProps {
  student: Student;
}

export const OppDetailPanel: React.FC<OppDetailPanelProps> = ({ student }) => {
  const opps = student.opportunities.filter((o) => o.opp_id);

  if (opps.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-3"
        style={{
          background: '#F5F4F1',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          borderBottom: '2px solid rgba(0,0,0,0.09)',
        }}
      >
        <span className="text-[10px] text-[#9B9992] italic">No application records found.</span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#FAFAF8',
        borderTop: '1px solid rgba(43,127,212,0.18)',
        borderBottom: '2px solid rgba(0,0,0,0.09)',
        overflowX: 'auto',
      }}
    >
      {/* Section label */}
      <PanelHeader oppCount={opps.length} />

      {/* Sub-table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'auto',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
        }}
      >
        {/* Column headers */}
        <thead>
          <tr
            style={{
              background: '#F0EFEB',
              borderBottom: '1px solid rgba(0,0,0,0.10)',
              height: 26,
            }}
          >
            {OPP_COLUMNS.map((col) => (
              <th
                key={col.label}
                style={{
                  textAlign: col.align ?? 'left',
                  minWidth: col.minWidth,
                  padding: '0 8px',
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#5C5B57',
                  whiteSpace: 'nowrap',
                  borderRight: '1px solid rgba(0,0,0,0.06)',
                  position: 'sticky',
                  top: 0,
                  background: '#F0EFEB',
                  zIndex: 1,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Opportunity rows */}
        <tbody>
          {opps.map((opp, i) => (
            <OppRow key={opp.opp_id ?? `opp-${i}`} opp={opp} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

OppDetailPanel.displayName = 'OppDetailPanel';
