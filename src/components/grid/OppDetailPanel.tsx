import React from 'react';
import { Tooltip, Avatar, AvatarGroup } from '@mui/material';
import type { Student, Opportunity } from '@/types';
import { Badge } from '@/components/ui/Badgecopy';
import { getLevelConfig, getOppStageConfig } from '@/lib/stageConfig';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const dash = (v?: string | null) =>
  !v || v.trim() === '' || v === '—' || v.toLowerCase() === 'n/a' ? '—' : v;

// ✅ FIX: added className support
const TooltipText: React.FC<{
  value?: string | null;
  className?: string;
}> = ({ value, className = '' }) => {
  const text = dash(value);

  if (text === '—') {
    return <span className="text-black text-[0.75rem]">—</span>;
  }

  return (
    <Tooltip
      title={text}
      arrow
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: '#1f2937',
            color: '#f9fafb',
            fontSize: '0.7rem',
          },
        },
      }}
    >
      <span
        className={`block overflow-hidden text-ellipsis whitespace-nowrap max-w-full text-[0.875rem] text-black ${className}`}
      >
        {text}
      </span>
    </Tooltip>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Avatars
// ─────────────────────────────────────────────────────────────────────────────

const OPP_AVATAR_COLORS = {
  adm_officer: '#3b82f6',
  counselor: '#10b981',
  office: '#8b5cf6',
  subagent: '#f97316',
} as const;

type AvatarType = keyof typeof OPP_AVATAR_COLORS;

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
  const roles: any[] = [];

  if (isValidVal(opp.opp_adm_officer)) {
    roles.push({
      name: opp.opp_adm_officer!,
      tooltip: `Admission Officer: ${opp.opp_adm_officer}`,
      type: 'adm_officer',
    });
  }

  if (isValidVal(opp.opp_counselor)) {
    roles.push({
      name: opp.opp_counselor!,
      tooltip: `Counsellor: ${opp.opp_counselor}`,
      type: 'counselor',
    });
  }

  if (isValidVal(opp.opp_office)) {
    roles.push({
      name: opp.opp_office!,
      tooltip: `Office: ${opp.opp_office}`,
      type: 'office',
    });
  }

  if (!roles.length) return <span className="text-[0.75rem]">—</span>;

  return (
    <div className="flex items-center justify-center">
      <AvatarGroup max={3} spacing={2}>
        {roles.map((role, idx) => (
          <Tooltip key={idx} title={role.tooltip} arrow>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: '0.68rem',
                fontWeight: 600,
                bgcolor: OPP_AVATAR_COLORS[role.type as AvatarType],
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
// Badges
// ─────────────────────────────────────────────────────────────────────────────

const LevelBadge = ({ level }: { level?: string | null }) => {
  const cfg = getLevelConfig(level ?? null);

  if (!cfg) return <span className="text-[0.875rem]">—</span>;

  return (
    <div className="text-left">
      <Badge variant={cfg.variant} size="sm">
        <span className="text-[0.875rem]">{cfg.label}</span>
      </Badge>
    </div>
  );
};

const StageBadge = ({ stage }: { stage?: string | null }) => {
  const cfg = getOppStageConfig(stage ?? null);

  return (
    <div className="text-left">
      <Badge variant={cfg.variant} size="sm">
        <span className="text-[0.875rem]">{cfg.label}</span>
      </Badge>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Column Definition
// ─────────────────────────────────────────────────────────────────────────────

const OPP_COLUMNS = [
  { key: 'index', label: '#', align: 'center' },
  { key: 'opp_name', label: 'Program', align: 'left' },
  { key: 'opp_institute_name', label: 'Institute', align: 'left' },
  { key: 'opp_course_level', label: 'Level', align: 'left' },
  { key: 'opp_salaes_stage', label: 'Stage', align: 'left' },
  { key: 'opp_commence_date', label: 'Commence', align: 'left' },
  { key: 'opp_last_stage_change_date', label: 'Last Change', align: 'left' },
  { key: 'opp_date_entered', label: 'Entered', align: 'left' },
  { key: 'opp_team', label: 'Program Info.', align: 'center' },
  { key: 'opp_subagent', label: 'Sub-Agent', align: 'left' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Cell Renderer
// ─────────────────────────────────────────────────────────────────────────────

const renderCell = (key: string, opp: Opportunity, index: number) => {
  switch (key) {
    case 'index':
      return (
        <span className="inline-flex items-center justify-center font-mono font-bold bg-[#ECEAE5] px-1 min-w-[20px] h-[18px] rounded">
          {index + 1}
        </span>
      );

    case 'opp_name':
      return <TooltipText value={opp.opp_name} className="font-medium" />;

    case 'opp_institute_name':
      return <TooltipText value={opp.opp_institute_name} />;

    case 'opp_course_level':
      return <LevelBadge level={opp.opp_course_level} />;

    case 'opp_salaes_stage':
      return <StageBadge stage={opp.opp_salaes_stage} />;

    case 'opp_commence_date':
      return <span className="text-[0.875rem]">{dash(opp.opp_commence_date)}</span>;

    case 'opp_last_stage_change_date':
      return <span className="text-[0.875rem]">{dash(opp.opp_last_stage_change_date)}</span>;

    case 'opp_date_entered':
      return <span className="text-[0.875rem]">{dash(opp.opp_date_entered)}</span>;

    case 'opp_team':
      return <OppTeamAvatars opp={opp} />;

    case 'opp_subagent':
      return <TooltipText value={opp.opp_subagent} />;

    default:
      return <span>—</span>;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Row
// ─────────────────────────────────────────────────────────────────────────────

const OppRow: React.FC<{ opp: Opportunity; index: number }> = ({ opp, index }) => {
  const isEven = index % 2 === 0;

  return (
    <tr
      style={{
        backgroundColor: isEven ? '#FFFFFF' : '#F5F4F1',
        height: 28,
      }}
    >
      {OPP_COLUMNS.map((col) => (
        <td
          key={col.key}
          className={`px-2 py-0 align-middle text-[0.875rem] ${col.align === 'center' ? 'text-center' : 'text-left'
            }`}
        >
          {renderCell(col.key, opp, index)}
        </td>
      ))}
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const OppDetailPanel: React.FC<{ student: Student }> = ({ student }) => {
  const opps = student.opportunities.filter((o) => o.opp_id);

  if (!opps.length) {
    return (
      <div className="py-3 text-center bg-[#F5F4F1] border-t">
        <span className="text-[0.75rem] italic">No application records found.</span>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] border-t overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F0EFEB] border-b h-[26px]">
            {OPP_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-2 text-[0.875rem] font-semibold uppercase text-black whitespace-nowrap ${col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {opps.map((opp, i) => (
            <OppRow key={opp.opp_id ?? i} opp={opp} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

OppDetailPanel.displayName = 'OppDetailPanel';