import React, { useRef } from 'react';
import { Tooltip, Avatar, AvatarGroup } from '@mui/material';
import type { Student, Opportunity } from '@/types';
import { Badge } from '@/components/ui/Badgecopy';
import { getLevelConfig, getOppStageConfig } from '@/lib/stageConfig';
import { useScaling } from '@/hooks/useScaling';
import { useGridWidthSync, type ColumnWidthInfo, mapColumnWidths } from '@/hooks/useGridWidthSync';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const dash = (v?: string | null) =>
  !v || v.trim() === '' || v === '—' || v.toLowerCase() === 'n/a' ? '—' : v;

// ✅ FIX: added className support and scaling
const TooltipText: React.FC<{
  value?: string | null;
  className?: string;
}> = ({ value, className = '' }) => {
  const { font } = useScaling();
  const text = dash(value);

  if (text === '—') {
    return <span className="text-black" style={{ fontSize: font(0.75) }}>—</span>;
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
            fontSize: font(0.7),
          },
        },
      }}
    >
      <span
        className={`block overflow-hidden text-ellipsis whitespace-nowrap max-w-full text-black ${className}`}
        style={{ fontSize: font(0.875) }}
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
  const { sc, font } = useScaling();
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

  if (!roles.length) return <span style={{ fontSize: font(0.75) }}>—</span>;

  return (
    <div className="flex items-center justify-center">
      <AvatarGroup max={3} spacing={sc(2)}>
        {roles.map((role, idx) => (
          <Tooltip key={idx} title={role.tooltip} arrow>
            <Avatar
              sx={{
                width: sc(24),
                height: sc(24),
                // ✅ FIX: Ensure font size scales but doesn't cause overflow
                fontSize: font(0.65),
                fontWeight: 600,
                bgcolor: OPP_AVATAR_COLORS[role.type as AvatarType],
                border: 'none !important',
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
  const { font } = useScaling();
  const cfg = getLevelConfig(level ?? null);

  if (!cfg) return <span style={{ fontSize: font(0.875) }}>—</span>;

  const tooltipTitle =
    level === 'UG'
      ? 'Undergraduate'
      : level === 'PG'
        ? 'Postgraduate'
        : level === 'LNG'
          ? 'Language Course'
          : level || '';

  return (
    <div className="text-left">
      <Tooltip
        title={tooltipTitle}
        arrow
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: '#1f2937',
              color: '#f9fafb',
              fontSize: font(0.7),
            },
          },
        }}
      >
        <div className="inline-block">
          <Badge variant={cfg.variant} size="sm">
            <span style={{ fontSize: font(0.875) }}>{cfg.label}</span>
          </Badge>
        </div>
      </Tooltip>
    </div>
  );
};

const StageBadge = ({ stage }: { stage?: string | null }) => {
  const { font } = useScaling();
  const cfg = getOppStageConfig(stage ?? null);

  return (
    <div className="text-left">
      <Badge variant={cfg.variant} size="sm">
        <span style={{ fontSize: font(0.875) }}>{cfg.label}</span>
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

const RenderCell: React.FC<{
  columnKey: string;
  opp: Opportunity;
  index: number;
}> = ({ columnKey, opp, index }) => {
  const { sc, font } = useScaling();

  switch (columnKey) {
    case 'index':
      return (
        <span
          className="inline-flex items-center justify-center font-mono font-bold bg-[#ECEAE5] px-1 rounded"
          style={{ minWidth: sc(20), height: sc(18), fontSize: font(0.75) }}
        >
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
      return <span style={{ fontSize: font(0.875) }}>{dash(opp.opp_commence_date)}</span>;

    case 'opp_last_stage_change_date':
      return <span style={{ fontSize: font(0.875) }}>{dash(opp.opp_last_stage_change_date)}</span>;

    case 'opp_date_entered':
      return <span style={{ fontSize: font(0.875) }}>{dash(opp.opp_date_entered)}</span>;

    case 'opp_team':
      return <OppTeamAvatars opp={opp} />;

    case 'opp_subagent':
      return <TooltipText value={opp.opp_subagent} />;

    default:
      return <span style={{ fontSize: font(0.875) }}>—</span>;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Row
// ─────────────────────────────────────────────────────────────────────────────

interface OppRowProps {
  opp: Opportunity;
  index: number;
  columnWidths?: Record<string, number>;
}

const OppRow: React.FC<OppRowProps> = ({ opp, index, columnWidths = {} }) => {
  const { sc, font } = useScaling();
  const isEven = index % 2 === 0;

  return (
    <tr
      style={{
        backgroundColor: isEven ? '#FFFFFF' : '#F5F4F1',
        height: sc(28),
      }}
    >
      {OPP_COLUMNS.map((col) => {
        const width = columnWidths[col.key] || 120;
        return (
          <td
            key={col.key}
            className={`px-2 py-0 align-middle ${col.align === 'center' ? 'text-center' : 'text-left'}`}
            style={{
              fontSize: font(0.875),
              width: `${width}px`,
              minWidth: `${Math.max(width * 0.8, 80)}px`,
              maxWidth: `${width * 1.5}px`,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <RenderCell columnKey={col.key} opp={opp} index={index} />
          </td>
        );
      })}
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Column Mapping Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps parent grid columns to child table columns for width synchronization
 * This ensures the child table columns align with the parent grid's visual structure
 */
const COLUMN_MAPPING: Record<string, string[]> = {
  'index': ['__detail_panel_toggle__'], // Toggle column width
  'opp_name': ['std_name'], // Student name column width
  'opp_institute_name': ['std_institute'], // Institute column width
  'opp_course_level': ['std_course_level'], // Course level column width
  'opp_salaes_stage': ['std_stage'], // Stage column width
  'opp_commence_date': ['std_commence_date'], // Commence date column width
  'opp_last_stage_change_date': ['std_last_stage_change_date'], // Last change column width
  'opp_date_entered': ['std_date_entered'], // Date entered column width
  'opp_team': ['std_team'], // Team column width
  'opp_subagent': ['std_subagent'], // Sub-agent column width
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export interface OppDetailPanelProps {
  student: Student;
  parentColumnWidths?: ColumnWidthInfo[];
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const OppDetailPanel: React.FC<OppDetailPanelProps> = ({
  student,
  parentColumnWidths = [],
  containerRef
}) => {
  const { sc, font } = useScaling();
  const opps = student.opportunities.filter((o) => o.opp_id);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Use width synchronization hook
  const { columnWidths: synchronizedWidths, totalWidth } = useGridWidthSync({
    containerRef: containerRef || tableContainerRef,
    columns: parentColumnWidths.length > 0
      ? mapColumnWidths(parentColumnWidths, COLUMN_MAPPING)
      : OPP_COLUMNS.map(col => ({
        field: col.key,
        width: 120, // Default width if no parent widths provided
        minWidth: 80,
      })),
    debounceMs: 50, // Faster response for smoother UX
  });

  // Create a map of column widths for easy lookup
  const columnWidthMap = synchronizedWidths.reduce((acc, col) => {
    acc[col.field] = col.width;
    return acc;
  }, {} as Record<string, number>);

  if (!opps.length) {
    return (
      <div className="py-3 text-center bg-[#F5F4F1] border-t">
        <span className="italic" style={{ fontSize: font(0.75) }}>No application records found.</span>
      </div>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className="bg-[#FAFAF8] border-t overflow-auto scrollbar-thin scrollbar-thumb-gray-300"
      style={{ maxHeight: sc(500) }}
    >
      <table
        className="border-collapse"
        style={{
          width: totalWidth > 0 ? `${totalWidth}px` : '100%',
          minWidth: '100%',
          tableLayout: 'fixed' // Ensures consistent column widths
        }}
      >
        <thead>
          <tr className="bg-[#F0EFEB] border-b sticky top-0 z-10" style={{ height: sc(26) }}>
            {OPP_COLUMNS.map((col) => {
              const width = columnWidthMap[col.key] || 120;
              return (
                <th
                  key={col.key}
                  className={`px-2 font-bold uppercase text-black whitespace-nowrap ${col.align === 'center' ? 'text-center' : 'text-left'}`}
                  style={{
                    fontSize: font(0.875),
                    width: `${width}px`,
                    minWidth: `${Math.max(width * 0.8, 80)}px`,
                    maxWidth: `${width * 1.5}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {col.label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {opps.map((opp, i) => (
            <OppRow
              key={opp.opp_id ?? i}
              opp={opp}
              index={i}
              columnWidths={columnWidthMap}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

OppDetailPanel.displayName = 'OppDetailPanel';