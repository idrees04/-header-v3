import React from 'react';
import { Tooltip, Avatar, AvatarGroup } from '@mui/material';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { GridRow } from '@/lib/gridRows';
import { useScaling } from '@/hooks/useScaling';

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

export const ProgramAvatarsCell = React.memo((params: GridRenderCellParams<GridRow>) => {
    const { sc, font } = useScaling();
    const row = params.row as GridRow;
    const opps = row._student.opportunities;

    // Aggregate unique team members across all opportunities
    const roles: { name: string; type: AvatarType; tooltip: string }[] = [];
    const seen = new Set<string>();

    opps.forEach(opp => {
        const checkAndPush = (val: string | null | undefined, type: AvatarType, label: string) => {
            if (isValidVal(val)) {
                const key = `${type}:${val.trim()}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    roles.push({
                        name: val.trim(),
                        type,
                        tooltip: `${label}: ${val.trim()}`
                    });
                }
            }
        };

        checkAndPush(opp.opp_adm_officer, 'adm_officer', 'Admission Officer');
        checkAndPush(opp.opp_counselor, 'counselor', 'Counsellor');
        checkAndPush(opp.opp_office, 'office', 'Office');
    });

    if (!roles.length) return <span className="text-[#D0CEC7]" style={{ fontSize: font(0.625) }}>—</span>;

    return (
        <div className="flex justify-center">
            <AvatarGroup max={3} spacing={sc(2)} sx={{
                '& .MuiAvatarGroup-avatar': { border: 'none !important' },
                '& .MuiAvatar-root': { transition: 'transform 0.15s ease' },
                '& .MuiAvatar-root:hover': { transform: 'scale(1.12)', zIndex: 10 }
            }}>
                {roles.map((role, idx) => (
                    <Tooltip key={idx} title={role.tooltip} arrow slotProps={{
                        tooltip: { sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: font(0.75) } }
                    }}>
                        <Avatar
                            sx={{
                                width: sc(22),
                                height: sc(22),
                                fontSize: font(0.65),
                                fontWeight: 600,
                                bgcolor: OPP_AVATAR_COLORS[role.type],
                                boxShadow: `0 ${sc(2)}px ${sc(4)}px rgba(0,0,0,0.1)`,
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
});

ProgramAvatarsCell.displayName = 'ProgramAvatarsCell';
