"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { defaultTableSizeScale } from "./default-table-config";
import { flattenTableSizeScale } from "./flatten-table-size-scale";
import type {
  ColumnDef,
  TableConfig,
  TableSizeKey,
  TableSizeScale,
  TableVariant,
} from "./table-config";

// ─── Props Interface ──────────────────────────────────────────────────────────

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

  /** Density/size scale key. */
  size?: TableSizeKey;

  /** Border radius token key. */
  radius?: keyof Radius;

  /** Animation preset for row presence. */
  animation?: AnimationProp;

  /** Custom class for header container. */
  headerClassName?: string;

  /** Custom class for individual row elements. */
  rowClassName?: string;

  /** Custom class for individual cells. */
  cellClassName?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

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
  size,
  radius,
  animation,
  headerClassName,
  rowClassName,
  cellClassName,
  className,
  style,
  ...props
}: TableProps<TData>) {
  const config = useAsheeConfig();
  const { settings } = useSettings();
  const sectionConfig = config.components?.table as TableConfig | undefined;

  // Design Token Resolvers
  const sizeScale = (sectionConfig?.size ??
    defaultTableSizeScale) as TableSizeScale;
  const resolvedSizeKey = size ?? sizeScale.default;
  const responsiveVars = useMemo(
    () => flattenTableSizeScale(sizeScale),
    [sizeScale],
  );
  useResponsiveVars(
    "ashee-table-tokens",
    responsiveVars,
    config.theme.breakpoints,
  );

  const variant = resolveValue(variantProp, sectionConfig?.variant, "default");

  const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
  const resolvedSectionRadiusKey =
    typeof sectionConfig?.radius === "string"
      ? sectionConfig.radius
      : undefined;
  const resolvedRadius = resolveScale(
    resolvedRadiusKey,
    resolvedSectionRadiusKey,
    config.theme.radius.default,
    config.theme.radius.values,
  );

  const motionProps = resolveAnimation(
    animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    settings.enableAnimations,
  );

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
        "w-full h-full overflow-auto scrollable border border-border bg-background",
        variant === "flush" && "border-none",
        sectionConfig?.className,
        className,
      )}
      style={{ borderRadius: resolvedRadius, ...style }}
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
                    sectionConfig?.cellClassName,
                    cellClassName,
                  )}
                  style={{
                    paddingBlock: `var(--ashee-table-${resolvedSizeKey}-py)`,
                    paddingInline: `var(--ashee-table-${resolvedSizeKey}-px)`,
                    fontSize: `var(--ashee-table-${resolvedSizeKey}-header-font-s)`,
                  }}>
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
            <AnimatePresence initial={false}>
              {data.map((row, rowIndex) => {
                const rowKey = getRowKey(row, rowIndex);
                const isSelected = rowKey === selectedRowKey;
                const isStriped = variant === "striped" && rowIndex % 2 === 1;

                return (
                  <motion.tr
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
                      if (
                        isInteractive &&
                        (e.key === "Enter" || e.key === " ")
                      ) {
                        e.preventDefault();
                        handleClick?.(row, rowKey);
                      }
                    }}
                    className={cn(
                      "border-b border-border/60 transition-colors outline-none align-middle",
                      isStriped && "bg-muted/20",
                      isInteractive &&
                        "cursor-pointer hover:bg-primary/10 hover:text-foreground focus-visible:bg-primary/15 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset",
                      isSelected &&
                        "bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:text-primary-foreground",
                      sectionConfig?.rowClassName,
                      rowClassName,
                    )}
                    style={{
                      fontSize: `var(--ashee-table-${resolvedSizeKey}-font-s)`,
                    }}
                    {...(motionProps as HTMLMotionProps<"tr">)}>
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
                            variant === "bordered" &&
                              colIdx < columns.length - 1 &&
                              "border-r border-border",
                            sectionConfig?.cellClassName,
                            cellClassName,
                          )}
                          style={{
                            paddingBlock: `var(--ashee-table-${resolvedSizeKey}-py)`,
                            paddingInline: `var(--ashee-table-${resolvedSizeKey}-px)`,
                          }}>
                          {column.cell(row)}
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = "Table";
