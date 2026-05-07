import { useMemo } from 'react';
import { useMediaQuery } from '@mui/material';

/**
 * Enterprise-grade scaling hook that centralizes the fluid scaling logic 
 * across all specified screen sizes (1024px to 8K).
 * 
 * Uses the Composite Pattern principle to provide a single source of truth 
 * for scaling factors used in typography, spacing, and dimensions.
 */
export const useScaling = () => {
    // ── Resolution Breakpoints ─────────────────────────────────
    const is8K = useMediaQuery('(min-width: 7680px)');
    const is5K = useMediaQuery('(min-width: 5120px)');
    const is4K = useMediaQuery('(min-width: 3840px)');
    const isUltraWide = useMediaQuery('(min-width: 3440px)');
    const is2K = useMediaQuery('(min-width: 2560px)');
    const isDesktop = useMediaQuery('(min-width: 1920px)');
    const isHighResLaptop = useMediaQuery('(min-width: 1536px)');
    const isStandardLaptop = useMediaQuery('(min-width: 1280px)');

    // ── Unified Scale Factor ───────────────────────────────────
    const scale = useMemo(() => {
        if (is8K) return 4.0;
        if (is5K) return 2.625;
        if (is4K) return 2.0;
        if (isUltraWide) return 1.75;
        if (is2K) return 1.3125;
        if (isDesktop) return 1.0;
        if (isHighResLaptop) return 0.9375;
        if (isStandardLaptop) return 0.875;
        return 0.8125; // Small laptops (1024px)
    }, [is8K, is5K, is4K, isUltraWide, is2K, isDesktop, isHighResLaptop, isStandardLaptop]);

    // ── Utilities ──────────────────────────────────────────────
    
    /** Scales a pixel value to a scaled pixel value (for raw pixel props like DataGrid rowHeight) */
    const sc = (px: number) => px * scale;

    /** Returns a standard REM string. Scaling is handled by the root font-size in CSS. */
    const rem = (r: number) => `${r}rem`;

    /** Returns a standard fontSize string. Scaling is handled by the root font-size in CSS. */
    const font = (baseRem: number) => `${baseRem}rem`;

    return {
        scale,
        sc,
        rem,
        font,
        // Common enterprise spacing tokens (scaled)
        spacing: {
            xs: sc(4),
            sm: sc(8),
            md: sc(16),
            lg: sc(24),
            xl: sc(32),
        }
    };
};
