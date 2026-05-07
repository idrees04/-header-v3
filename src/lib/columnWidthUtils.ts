import type { GridColDef } from '@mui/x-data-grid-pro';

export interface ColumnWidthOptions {
    charWidth?: number;
    padding?: number;
    minWidth?: number;
    maxWidth?: number;
    includeHeader?: boolean;
    factor?: number;
    useFlex?: boolean;
    flexBase?: number;
    fixedColumnWidths?: Record<string, number>;
}

export function calculateColumnWidths<T extends Record<string, unknown>>(
    columns: GridColDef[],
    rows: T[],
    options: ColumnWidthOptions = {}
): GridColDef[] {
    const {
        charWidth = 8,
        padding = 16,
        minWidth: globalMin = 40,
        maxWidth: globalMax = 400,
        includeHeader = true,
        factor = 1.2,
        useFlex = true,
        flexBase = 1,
        fixedColumnWidths = {},
    } = options;

    const columnMap = new Map<string, GridColDef>();
    columns.forEach(col => columnMap.set(col.field, col));

    const columnFields = columns.map(col => col.field);

    const contentLengths: Record<string, number> = {};
    const headerLengths: Record<string, number> = {};

    columnFields.forEach(field => {
        const colDef = columnMap.get(field);
        const headerText = colDef?.headerName || field;
        headerLengths[field] = headerText.length;

        const lengths = rows.map(row => {
            const value = row[field];
            return value == null ? 0 : String(value).length;
        });

        const maxLength = lengths.length ? Math.max(...lengths) : 0;
        const avgLength =
            lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;

        const typicalLength = Math.ceil(
            Math.max(avgLength * factor, maxLength * 0.7)
        );

        contentLengths[field] = typicalLength;
    });

    const columnWidths: Record<string, number> = {};

    columnFields.forEach(field => {
        if (fixedColumnWidths[field] !== undefined) {
            columnWidths[field] = fixedColumnWidths[field];
        } else {
            const contentLen = contentLengths[field];
            const headerLen = headerLengths[field];
            const length = includeHeader
                ? Math.max(contentLen, headerLen)
                : contentLen;

            const calculated = length * charWidth + padding;
            const clamped = Math.max(globalMin, Math.min(globalMax, calculated));

            columnWidths[field] = clamped;
        }
    });

    return columns.map(col => {
        const field = col.field;
        const width = columnWidths[field];
        const isFixed = fixedColumnWidths[field] !== undefined;

        const updated: GridColDef = { ...col };

        if (isFixed) {
            /**
             * ✅ DEFAULT-SIZED (NOT LOCKED)
             */
            updated.width = width;
            updated.minWidth = Math.max(globalMin, Math.floor(width * 0.6));
            updated.maxWidth = globalMax;
            updated.resizable = true;

            // Prevent flex fighting with manual resize
            delete updated.flex;
        } else if (useFlex) {
            /**
             * ✅ FLEX COLUMNS (AUTO FILL)
             * Proportional scaling for laptop/desktop screens.
             */
            delete updated.width;
            
            // Prioritize flex from column definition, fallback to flexBase
            updated.flex = col.flex ?? flexBase;
            
            // Content-driven minWidth prevents collapse
            updated.minWidth = width;
            
            // Remove maxWidth so columns can utilize full horizontal space on large LCDs
            delete updated.maxWidth;
            updated.resizable = true;
        } else {
            /**
             * ✅ STATIC WIDTH (NON-FLEX)
             */
            updated.width = width;
            updated.minWidth = globalMin;
            updated.maxWidth = globalMax;
            updated.resizable = true;
        }

        return updated;
    });
}