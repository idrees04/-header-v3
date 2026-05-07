import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Enterprise-level hook for synchronizing child table width with parent DataGridPro
 * 
 * This hook provides:
 * 1. Real-time width synchronization using ResizeObserver
 * 2. Column width calculation based on parent grid configuration
 * 3. Debounced updates to prevent excessive re-renders
 * 4. Support for dynamic column visibility changes
 */

export interface ColumnWidthInfo {
    field: string;
    width: number;
    minWidth?: number;
    maxWidth?: number;
    flex?: number;
}

export interface UseGridWidthSyncOptions {
    /** Grid container element reference */
    containerRef: React.RefObject<HTMLElement | null>;
    /** Column definitions with width information */
    columns: ColumnWidthInfo[];
    /** Debounce delay in milliseconds for resize events */
    debounceMs?: number;
}

export interface UseGridWidthSyncResult {
    /** Total available width for the detail panel */
    totalWidth: number;
    /** Calculated column widths for synchronization */
    columnWidths: ColumnWidthInfo[];
    /** Whether the grid is currently being measured */
    isMeasuring: boolean;
    /** Force a recalculation of widths */
    recalculate: () => void;
}

export const useGridWidthSync = ({
    containerRef,
    columns,
    debounceMs = 100,
}: UseGridWidthSyncOptions): UseGridWidthSyncResult => {
    const [totalWidth, setTotalWidth] = useState<number>(0);
    const [columnWidths, setColumnWidths] = useState<ColumnWidthInfo[]>(columns);
    const [isMeasuring, setIsMeasuring] = useState(false);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const calculateWidths = useCallback(() => {
        if (!containerRef.current) {
            return;
        }

        setIsMeasuring(true);

        try {
            const container = containerRef.current;
            const computedStyle = window.getComputedStyle(container);
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
            const containerWidth = container.clientWidth - paddingLeft - paddingRight;

            // Calculate total width of all columns
            const totalColumnWidth = columns.reduce((sum, col) => sum + col.width, 0);
            const widthDifference = containerWidth - totalColumnWidth;

            let adjustedWidths = [...columns];

            // Adjust widths if there's a difference and we have flex columns
            if (widthDifference !== 0 && columns.some(col => col.flex && col.flex > 0)) {
                if (widthDifference > 0) {
                    // Distribute extra width proportionally to flex columns
                    const flexColumns = columns.filter(col => col.flex && col.flex > 0);
                    const totalFlex = flexColumns.reduce((sum, col) => sum + (col.flex || 0), 0);

                    if (totalFlex > 0) {
                        adjustedWidths = columns.map(col => {
                            if (col.flex && col.flex > 0) {
                                const flexProportion = (col.flex || 0) / totalFlex;
                                const additionalWidth = widthDifference * flexProportion;
                                const newWidth = Math.max(
                                    col.width + additionalWidth,
                                    col.minWidth || 0
                                );
                                return { ...col, width: newWidth };
                            }
                            return col;
                        });
                    }
                } else {
                    // If container is smaller, scale down proportionally
                    const scaleFactor = containerWidth / totalColumnWidth;
                    if (scaleFactor > 0 && scaleFactor < 1) {
                        adjustedWidths = columns.map(col => {
                            const newWidth = Math.max(
                                col.width * scaleFactor,
                                col.minWidth || 0
                            );
                            return { ...col, width: newWidth };
                        });
                    }
                }
            }

            setColumnWidths(adjustedWidths);
            setTotalWidth(containerWidth);
        } catch (error) {
            console.error('Error calculating grid widths:', error);
        } finally {
            setIsMeasuring(false);
        }
    }, [containerRef, columns]);

    // Debounced resize handler
    const handleResize = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            calculateWidths();
        }, debounceMs);
    }, [calculateWidths, debounceMs]);

    // Initialize ResizeObserver
    useEffect(() => {
        const targetElement = containerRef.current;

        if (!targetElement) {
            return;
        }

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(targetElement);

        // Initial calculation
        calculateWidths();

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [containerRef, calculateWidths, handleResize]);

    const recalculate = useCallback(() => {
        calculateWidths();
    }, [calculateWidths]);

    return {
        totalWidth,
        columnWidths,
        isMeasuring,
        recalculate,
    };
};

/**
 * Utility to extract column width information from DataGridPro columns
 */
export const extractColumnWidths = (columns: any[]): ColumnWidthInfo[] => {
    return columns
        .filter(col => col && col.field && !col.field.startsWith('__detail_panel_toggle__'))
        .map(col => ({
            field: col.field,
            width: col.computedWidth || col.width || 100,
            minWidth: col.minWidth,
            maxWidth: col.maxWidth,
            flex: col.flex,
        }));
};

/**
 * Utility function to map parent grid columns to child table columns
 */
export const mapColumnWidths = (
    parentColumns: ColumnWidthInfo[],
    columnMapping: Record<string, string[]>
): ColumnWidthInfo[] => {
    const result: ColumnWidthInfo[] = [];

    Object.entries(columnMapping).forEach(([childField, parentFields]) => {
        const totalWidth = parentFields.reduce((sum, parentField) => {
            const parentCol = parentColumns.find(col => col.field === parentField);
            return sum + (parentCol?.width || 0);
        }, 0);

        if (totalWidth > 0) {
            result.push({
                field: childField,
                width: totalWidth,
            });
        }
    });

    return result;
};