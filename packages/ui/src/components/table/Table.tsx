"use client";

import { cn } from "@asheeui/utils";
import { type HTMLAttributes, type ReactNode, useCallback } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type ColumnDef,
  FALLBACK_TABLE_CONFIG,
  type TableConfig,
  type TableSizeKey,
  type TableVariant,
} from "./table-config";
import {
  TABLE_CELL_PADDING_X_CLASS,
  TABLE_CELL_PADDING_Y_CLASS,
  TABLE_COLOR_STYLES,
  TABLE_FONT_CLASS,
  TABLE_HEADER_FONT_CLASS,
  TABLE_RADIUS_CLASS,
} from "./table-styles";

export interface TableProps<TData>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Array of row data objects. */
  data: TData[];

  /** Column definition array. */
  columns: ColumnDef<TData>[];

  /** Optional Tailwind grid or layout utility classes. */
  gridClasses?: string;

  /** Accessor callback to return a unique key per row. */
  rowKeyAccessor?: (row: TData) => string | number;

  /** Primary row click handler. */
  handleClick?: (data: TData, rowId?: string | number) => void;

  /** Primary row double-click handler. */
  handleDoubleClick?: (data: TData, rowId?: string | number) => void;

  /** Key of currently selected row. */
  selectedRowKey?: string | number;

  /** Display text or React element when data array is empty. */
  emptyMessage?: ReactNode;

  /** Disables interactive hover/click styling on rows. */
  isNotClickable?: boolean;

  /** Visual table style variant. */
  variant?: TableVariant;

  /** Color token for row selections, hover states, and keyboard focus rings. */
  color?: Color;

  /** Density/size scale key. */
  size?: TableSizeKey;

  /** Border radius token key. */
  radius?: keyof Radius;

  /** Custom class for header container. */
  headerClassName?: string;

  /** Custom class for individual row elements. */
  rowClassName?: string;

  /** Custom class for individual cells. */
  cellClassName?: string;
}

export function Table<TData>({
  data = [],
  columns = [],
  gridClasses,
  rowKeyAccessor,
  handleClick,
  handleDoubleClick,
  selectedRowKey,
  emptyMessage = "No items available",
  isNotClickable = false,
  variant: variantProp,
  color: colorProp,
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
  const sectionConfig = config.components?.table as TableConfig | undefined;

  // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

  const resolvedSizeKey = resolveCascade<TableSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_TABLE_CONFIG.size,
  );

  const resolvedVariant = resolveCascade<TableVariant>(
    variantProp,
    sectionConfig?.variant,
    undefined,
    FALLBACK_TABLE_CONFIG.variant,
  );

  const resolvedColor = resolveCascade<Color>(
    colorProp,
    sectionConfig?.color,
    config.theme.defaultColor as Color | undefined,
    FALLBACK_TABLE_CONFIG.color,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    radius,
    sectionConfig,
    config.theme.radius?.default,
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
    TABLE_RADIUS_CLASS,
    FALLBACK_TABLE_CONFIG.radius,
  );

  const activeColorStyles =
    TABLE_COLOR_STYLES[resolvedColor] ?? TABLE_COLOR_STYLES.primary;

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
    !isNotClickable && Boolean(handleClick || handleDoubleClick);

  return (
    <div
      className={cn(
        "w-full h-full overflow-auto scrollable bg-background",
        resolvedVariant === "flush"
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
            "sticky top-0 z-10 border-b border-border bg-muted/90 backdrop-blur-xs font-semibold text-muted-foreground select-none",
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
                    resolvedVariant === "bordered" &&
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
                className="h-48 text-center align-middle p-6 text-sm text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex);
              const isSelected = rowKey === selectedRowKey;
              const isStriped =
                resolvedVariant === "striped" && rowIndex % 2 === 1;

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
                    "border-b border-border/60 transition-colors outline-none align-middle",
                    fontClass,
                    resolvedVariant === "flush" && "last:border-b-0",
                    isStriped && "bg-secondary",
                    isInteractive &&
                      cn(
                        "cursor-pointer",
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
                          resolvedVariant === "bordered" &&
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
