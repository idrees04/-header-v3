import React from 'react';
import { Tooltip, Avatar, AvatarGroup } from '@mui/material';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { GridRow } from '@/lib/gridRows';
import { useScaling } from '@/hooks/useScaling';

interface RoleInfo {
    name: string;
    tooltip: string;
    type: 'adm_officer' | 'counselor' | 'office' | 'subagent';
}

// ✅ Handles null | undefined | empty | "—" | "n/a"
const isValidValue = (value?: string | null): value is string => {
    if (!value) return false;

    const normalized = value.trim();

    return (
        normalized !== '' &&
        normalized !== '—' &&
        normalized.toLowerCase() !== 'n/a'
    );
};

// ✅ Avatar styling
const getAvatarStyle = (type: RoleInfo['type']) => {
    switch (type) {
        case 'adm_officer':
            return { bgcolor: '#3b82f6', color: 'white' };
        case 'counselor':
            return { bgcolor: '#10b981', color: 'white' };
        case 'office':
            return { bgcolor: '#8b5cf6', color: 'white' };
        case 'subagent':
            return { bgcolor: '#f97316', color: 'white' };
        default:
            return { bgcolor: '#9ca3af', color: 'white' };
    }
};

export const RoleAvatarsCell = React.memo(
    (params: GridRenderCellParams<GridRow>) => {
        const { sc, font } = useScaling();
        const row = params.row as GridRow;

        const roles: RoleInfo[] = [];

        // ✅ Centralized role push logic (type-safe)
        const pushRole = (
            value: string | null | undefined,
            tooltip: string,
            type: RoleInfo['type']
        ) => {
            if (isValidValue(value)) {
                roles.push({
                    name: value.trim(), // safe due to type guard
                    tooltip,
                    type
                });
            }
        };

        // Student-level team roles
        pushRole(
            row.std_adm_officer,
            `Admission Officer: ${row.std_adm_officer}`,
            'adm_officer'
        );

        pushRole(
            row.std_counselor,
            `Counsellor: ${row.std_counselor}`,
            'counselor'
        );

        pushRole(
            row.std_office,
            `Office: ${row.std_office}`,
            'office'
        );

        // ✅ Empty state
        if (roles.length === 0) {
            return (
                <div className="flex justify-center">
                    <span className="text-[#D0CEC7]" style={{ fontSize: font(0.625) }}>—</span>
                </div>
            );
        }

        return (
            <div className="flex justify-center">
                <AvatarGroup
                    max={3}
                    spacing={sc(2)}
                    sx={{
                        '& .MuiAvatarGroup-avatar': {
                            border: 'none !important',
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
                    {roles.map((role, index) => (
                        <Tooltip
                            key={`${role.type}-${index}`}
                            title={<span>{role.tooltip}</span>}
                            arrow
                            slotProps={{
                                tooltip: {
                                    sx: { bgcolor: '#1f2937', color: '#f9fafb', fontSize: font(0.75) },
                                },
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: sc(24),
                                    height: sc(24),
                                    // ✅ FIX: scale font size but prevent overflow
                                    fontSize: font(0.65), 
                                    boxShadow: `0 ${sc(2)}px ${sc(4)}px rgba(0,0,0,0.1)`,
                                    ...getAvatarStyle(role.type),
                                    border: 'none !important',
                                }}
                            >
                                {/* ✅ Initials (max 2 chars) */}
                                {role.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    ))}
                </AvatarGroup>
            </div>
        );
    }
);

RoleAvatarsCell.displayName = 'RoleAvatarsCell';