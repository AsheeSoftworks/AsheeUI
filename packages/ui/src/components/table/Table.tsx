/**
 * Table component for AsheeUI.
 * This file provides the main Table component implementation, which renders
 * a data table with configurable columns, row selection, interactive states,
 * and variant styling. It supports grid, striped, bordered, and ghost variants,
 * with configurable size, color, and radius tokens through the standard
 * AsheeUI cascade system.
 */
"use client";

import { type HTMLAttributes, type ReactNode, useCallback } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Size } from "../../shared";
import { RADIUS_CLASS, type Radius } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type ColumnDef,
  FALLBACK_TABLE_CONFIG,
  type TableConfig,
  type TableVariant,
} from "./table-config";
import {
  TABLE_CELL_PADDING_X_CLASS,
  TABLE_CELL_PADDING_Y_CLASS,
  TABLE_COLOR_STYLES,
  TABLE_FONT_CLASS,
  TABLE_HEADER_FONT_CLASS,
} from "./table-styles";

type BaseTableProps = TableConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "onClick">;

/**
 * Configuration options for the Table component.
 */
export interface TableProps<TData> extends BaseTableProps {
  /**
   * Array of row data objects.
   * Each object represents a row in the table.
   */
  data: TData[];

  /**
   * Column definition array.
   * Defines the headers and cell renderers for each column.
   */
  columns: ColumnDef<TData>[];

  /**
   * Optional Tailwind grid or layout utility classes.
   * Used for custom grid layouts in the table.
   */
  gridClasses?: string;

  /**
   * Accessor callback to return a unique key per row.
   * Used as the React key for each row element.
   */
  rowKeyAccessor?: (row: TData) => string | number;

  /**
   * Primary row click handler.
   * Called when a row is clicked.
   */
  handleClick?: (data: TData, rowId?: string | number) => void;

  /**
   * Primary row double-click handler.
   * Called when a row is double-clicked.
   */
  handleDoubleClick?: (data: TData, rowId?: string | number) => void;

  /**
   * Key of currently selected row.
   * Highlights the row with the matching key.
   */
  selectedRowKey?: string | number;

  /**
   * Display text or React element when data array is empty.
   * Shown in the table body when there are no rows.
   */
  emptyMessage?: ReactNode;

  /**
   * Enables interactive hover, active press animations, and click styling on rows.
   * When true, rows become clickable with visual feedback.
   */
  isClickable?: boolean;
}

/**
 * A data table with configurable columns, row selection, and interactive states.
 *
 * Table renders a structured data grid with support for multiple variants
 * (grid, striped, bordered, ghost), configurable size and color tokens,
 * row selection highlighting, and interactive click handlers. It automatically
 * handles accessibility attributes including aria-selected for selected rows,
 * and keyboard interaction for clickable rows.
 *
 * Visual tokens resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
 *
 * @param props - Table configuration options.
 * @param props.data - Array of row data objects.
 * @param props.columns - Column definition array.
 * @param props.rowKeyAccessor - Function to generate unique row keys.
 * @param props.handleClick - Row click handler.
 * @param props.handleDoubleClick - Row double-click handler.
 * @param props.selectedRowKey - Key of the currently selected row.
 * @param props.emptyMessage - Message shown when data is empty.
 * @param props.isClickable - Whether rows are interactive. Defaults to false.
 * @param props.size - Density scale. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "grid".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.radius - Corner rounding. Defaults to "md".
 *
 * @example
 * ```tsx
 * import { Table } from "asheeui";
 *
 * const columns = [
 *   { header: "Name", cell: (row) => row.name },
 *   { header: "Email", cell: (row) => row.email },
 * ];
 *
 * const data = [
 *   { name: "John Doe", email: "john@example.com" },
 *   { name: "Jane Smith", email: "jane@example.com" },
 * ];
 *
 * export function Example() {
 *   return (
 *     <Table
 *       data={data}
 *       columns={columns}
 *       variant="striped"
 *       isClickable
 *       handleClick={(row) => console.log(row)}
 *     />
 *   );
 * }
 * ```
 *
 * @see TableConfig - The configuration type for component defaults.
 * @see ColumnDef - The column definition type.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export function Table<TData>({
  data = [],
  columns = [],
  gridClasses,
  rowKeyAccessor,
  handleClick,
  handleDoubleClick,
  selectedRowKey,
  emptyMessage = "No items available",
  isClickable,
  variant,
  color,
  size,
  radius,
  headerClassName,
  rowClassName,
  cellClassName,
  className,
  style,
  ...props
}: TableProps<TData>) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.table;

  // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

  const resolvedSizeKey = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_TABLE_CONFIG.size,
  );

  const resolvedVariantKey = resolveCascade<TableVariant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_TABLE_CONFIG.variant,
  );

  const resolvedColorKey = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_TABLE_CONFIG.color,
  );

  // ─── NEW: Filter out 'full' radius ──────────────────────────────────────
  const filterRadius = (
    radiusValue: Radius | undefined,
  ): Radius | undefined => {
    if (radiusValue === "full") return "xl";
    return radiusValue;
  };

  const resolvedRadiusKey = resolveRadiusKey(
    filterRadius(radius),
    filterRadius(sectionConfig?.radius),
    config.defaultRadius,
    FALLBACK_TABLE_CONFIG.radius,
  );

  // ─── 2. Class Maps ────────────────────────────────────────────────────────

  const paddingYClass = resolveClassKey(
    resolvedSizeKey,
    TABLE_CELL_PADDING_Y_CLASS,
    FALLBACK_TABLE_CONFIG.size,
  );

  const paddingXClass = resolveClassKey(
    resolvedSizeKey,
    TABLE_CELL_PADDING_X_CLASS,
    FALLBACK_TABLE_CONFIG.size,
  );

  const fontClass = resolveClassKey(
    resolvedSizeKey,
    TABLE_FONT_CLASS,
    FALLBACK_TABLE_CONFIG.size,
  );

  const headerFontClass = resolveClassKey(
    resolvedSizeKey,
    TABLE_HEADER_FONT_CLASS,
    FALLBACK_TABLE_CONFIG.size,
  );

  const radiusClass = resolveClassKey(
    resolvedRadiusKey,
    RADIUS_CLASS,
    FALLBACK_TABLE_CONFIG.radius,
  );

  const activeColorStyles =
    TABLE_COLOR_STYLES[resolvedColorKey] ?? TABLE_COLOR_STYLES.primary;

  const getRowKey = useCallback(
    (row: TData, index: number): string | number => {
      if (rowKeyAccessor) {
        try {
          return rowKeyAccessor(row);
        } catch {
          return index;
        }
      }
      return index;
    },
    [rowKeyAccessor],
  );

  const hasData = Array.isArray(data) && data.length > 0;
  const isInteractive =
    isClickable ?? Boolean(handleClick || handleDoubleClick);

  return (
    <div
      className={cn(
        "w-full h-full scrollable",
        resolvedVariantKey === "ghost"
          ? "border-0 shadow-none rounded-none"
          : cn("border border-border", radiusClass),
        sectionConfig?.className,
        className,
      )}
      style={style}
      {...props}>
      <table className="w-full border-collapse text-left caption-bottom">
        {/* Table Header */}
        <thead
          className={cn(
            "sticky top-0 z-10 border-b border-border bg-secondary/90 backdrop-blur-xs font-semibold text-foreground/70 select-none",
            sectionConfig?.headerClassName,
            headerClassName,
          )}>
          <tr>
            {columns.map((column, colIdx) => {
              const colKey =
                column.id ??
                (typeof column.header === "string"
                  ? column.header
                  : String(colIdx));

              return (
                <th
                  key={colKey}
                  scope="col"
                  className={cn(
                    "font-medium uppercase tracking-wider text-left align-middle truncate min-w-0",
                    paddingYClass,
                    paddingXClass,
                    headerFontClass,
                    resolvedVariantKey === "grid" &&
                      colIdx < columns.length - 1 &&
                      "border-r border-border",
                    sectionConfig?.cellClassName,
                    cellClassName,
                  )}>
                  {column.header}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {!hasData ? (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="h-48 text-center align-middle p-6 text-sm text-foreground/70">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex);
              const isSelected = rowKey === selectedRowKey;
              const isStriped =
                resolvedVariantKey === "striped" && rowIndex % 2 === 1;

              return (
                <tr
                  key={String(rowKey)}
                  tabIndex={isInteractive ? 0 : -1}
                  aria-selected={isSelected}
                  onClick={
                    isInteractive && handleClick
                      ? () => handleClick(row, rowKey)
                      : undefined
                  }
                  onDoubleClick={
                    isInteractive && handleDoubleClick
                      ? () => handleDoubleClick(row, rowKey)
                      : undefined
                  }
                  onKeyDown={(e) => {
                    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleClick?.(row, rowKey);
                    }
                  }}
                  className={cn(
                    "border-b border-border/60 transition-all duration-150 outline-none align-middle",
                    fontClass,
                    resolvedVariantKey === "ghost" && "last:border-b-0",
                    isStriped && "bg-secondary",
                    isInteractive &&
                      cn(
                        "cursor-pointer select-none active:scale-[0.99] active:opacity-90",
                        activeColorStyles.hover,
                        activeColorStyles.focus,
                      ),
                    isSelected && activeColorStyles.selected,
                    sectionConfig?.rowClassName,
                    rowClassName,
                  )}>
                  {columns.map((column, colIdx) => {
                    const colKey =
                      column.id ??
                      (typeof column.header === "string"
                        ? column.header
                        : String(colIdx));

                    return (
                      <td
                        key={colKey}
                        className={cn(
                          "truncate min-w-0 align-middle",
                          paddingYClass,
                          paddingXClass,
                          resolvedVariantKey === "grid" &&
                            colIdx < columns.length - 1 &&
                            "border-r border-border",
                          sectionConfig?.cellClassName,
                          cellClassName,
                        )}>
                        {column.cell(row)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = "Table";
