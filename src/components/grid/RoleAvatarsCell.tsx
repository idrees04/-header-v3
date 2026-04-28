import React from 'react';
import { Tooltip, Avatar, AvatarGroup } from '@mui/material';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { GridRow } from '@/lib/gridRows';

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

        // ✅ Role mapping
        if (row.kind === 'student') {
            pushRole(
                row.std_adm_officer,
                `Student - Admission Officer: ${row.std_adm_officer}`,
                'adm_officer'
            );

            pushRole(
                row.std_counselor,
                `Student - Counsellor: ${row.std_counselor}`,
                'counselor'
            );

            pushRole(
                row.std_office,
                `Student is under Office: ${row.std_office}`,
                'office'
            );

            // 🔥 Sub-agent now correctly ignored if "—" or empty/null
            // pushRole(
            //     row.std_subagent,
            //     `Sub-Agent: ${row.std_subagent}`,
            //     'subagent'
            // );
        } else {
            pushRole(
                row.opp_adm_officer,
                `Program-Admission Officer: ${row.opp_adm_officer}`,
                'adm_officer'
            );

            pushRole(
                row.opp_counselor,
                `Program - Counsellor: ${row.opp_counselor}`,
                'counselor'
            );

            pushRole(
                row.opp_office,
                `Program is under Office: ${row.opp_office}`,
                'office'
            );

            // pushRole(
            //     row.opp_subagent,
            //     `Sub-Agent: ${row.opp_subagent}`,
            //     'subagent'
            // );
        }

        // ✅ Empty state
        if (roles.length === 0) {
            return (
                <div className="flex justify-center">
                    <span className="text-[#D0CEC7] text-[10px]">—</span>
                </div>
            );
        }

        return (
            <div className="flex justify-center">
                <AvatarGroup
                    max={4}
                    spacing={10}
                    sx={{
                        '& .MuiAvatar-root': {
                            transition: 'transform 0.2s ease',
                        },
                        '& .MuiAvatar-root:hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    {roles.map((role, index) => (
                        <Tooltip
                            key={`${role.type}-${index}`}
                            title={<span>{role.tooltip}</span>}
                            arrow
                        >
                            <Avatar
                                sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: '0.7rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    ...getAvatarStyle(role.type),
                                }}
                            >
                                {/* ✅ Better initials (max 2 chars) */}
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