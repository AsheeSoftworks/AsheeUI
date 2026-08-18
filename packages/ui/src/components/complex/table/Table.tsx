"use client";
import { cn } from "@asheeui/utils";
import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import type { Color } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
import { useResponsiveVars } from "../../../theme/token/responsive/use-responsive-vars";
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

// ─── Color Token Utility Maps ─────────────────────────────────────────────────

const TABLE_COLOR_STYLES: Record<
  Color,
  { selected: string; hover: string; focus: string }
> = {
  primary: {
    selected:
      "bg-primary text-secondary font-medium hover:bg-primary/90 hover:text-secondary",
    hover: "hover:bg-primary/10 hover:text-foreground",
    focus:
      "focus-visible:bg-primary/15 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset",
  },
  secondary: {
    selected:
      "bg-secondary text-foreground font-medium hover:bg-secondary/90 hover:text-foreground",
    hover: "hover:bg-secondary/10 hover:text-foreground",
    focus:
      "focus-visible:bg-secondary/15 focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-inset",
  },
  danger: {
    selected:
      "bg-danger text-secondary font-medium hover:bg-danger/90 hover:text-secondary",
    hover: "hover:bg-danger/10 hover:text-foreground",
    focus:
      "focus-visible:bg-danger/15 focus-visible:ring-1 focus-visible:ring-danger focus-visible:ring-inset",
  },
  warning: {
    selected:
      "bg-warning text-secondary font-medium hover:bg-warning/90 hover:text-secondary",
    hover: "hover:bg-warning/10 hover:text-foreground",
    focus:
      "focus-visible:bg-warning/15 focus-visible:ring-1 focus-visible:ring-warning focus-visible:ring-inset",
  },
  success: {
    selected:
      "bg-success text-secondary font-medium hover:bg-success/90 hover:text-secondary",
    hover: "hover:bg-success/10 hover:text-foreground",
    focus:
      "focus-visible:bg-success/15 focus-visible:ring-1 focus-visible:ring-success focus-visible:ring-inset",
  },
  default: {
    selected: "bg-secondary text-foreground font-medium hover:bg-secondary/80",
    hover: "hover:bg-foreground/10 hover:text-foreground",
    focus:
      "focus-visible:bg-foreground/10 focus-visible:ring-1 focus-visible:ring-border focus-visible:ring-inset",
  },
  none: {
    selected: "bg-muted text-foreground font-medium hover:bg-muted/80",
    hover: "hover:bg-muted/40 hover:text-foreground",
    focus:
      "focus-visible:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  },
};

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

  const variant = resolveValue<TableVariant>(
    variantProp,
    sectionConfig?.variant,
    "default",
  );

  const resolvedColor = resolveValue<Color>(
    colorProp,
    sectionConfig?.color,
    config.theme.defaultColor ?? "primary",
  );

  const activeColorStyles =
    TABLE_COLOR_STYLES[resolvedColor] ?? TABLE_COLOR_STYLES.primary;

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
        variant === "flush" ? "border-0 shadow-none" : "border border-border",
        sectionConfig?.className,
        className,
      )}
      style={{
        borderRadius: variant === "flush" ? 0 : resolvedRadius,
        ...style,
      }}
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
                    variant === "bordered" &&
                      colIdx < columns.length - 1 &&
                      "border-r border-border",
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
            data.map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex);
              const isSelected = rowKey === selectedRowKey;
              const isStriped = variant === "striped" && rowIndex % 2 === 1;

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
                    variant === "flush" && "last:border-b-0",
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
                  )}
                  style={{
                    fontSize: `var(--ashee-table-${resolvedSizeKey}-font-s)`,
                  }}>
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
