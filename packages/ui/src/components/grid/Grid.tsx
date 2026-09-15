/**
 * Grid component for AsheeUI.
 *
 * This file provides the `Grid` layout primitive: a two-dimensional layout
 * whose column count can change at the framework's two layout breakpoints. It is
 * the element card decks, feature lists, pricing tables and dashboards are built
 * on.
 */

"use client";

import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import { SPACE_GAP_CLASS, type Space } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import {
  FALLBACK_GRID_CONFIG,
  type GridAlign,
  type GridColumns,
  type GridConfig,
} from "./grid-config";
import {
  GRID_ALIGN_CLASS,
  GRID_BASE_CLASS,
  GRID_COLUMNS_CLASS,
  GRID_COLUMNS_LG_CLASS,
  GRID_COLUMNS_MD_CLASS,
} from "./grid-styles";

type BaseGridProps = GridConfig & Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the Grid component.
 */
export interface GridProps extends BaseGridProps {
  /**
   * Element to render.
   * Defaults to a `div`. A grid whose cells are list items should render `ul`
   * and receive `li` children.
   *
   * @default "div"
   */
  as?: ElementType;

  /**
   * Column count from the smallest viewport upwards.
   * Resolved through the standard cascade: prop, then
   * `components.grid.columns`, then the framework fallback of a single column.
   *
   * @default 1
   */
  columns?: GridColumns;

  /**
   * Column count from the `md` breakpoint upwards.
   */
  columnsMd?: GridColumns;

  /**
   * Column count from the `lg` breakpoint upwards.
   */
  columnsLg?: GridColumns;

  /**
   * Space between cells, from the shared spacing scale.
   *
   * @default "md"
   */
  gap?: Space;
}

/**
 * A responsive column grid.
 *
 * Grid states its column count per breakpoint rather than as a single number, so
 * a deck of cards is one column on a phone, two on a tablet and three on a
 * desktop without writing media queries by hand. A column count left undefined
 * inherits the value of the next smaller breakpoint through the cascade, so a
 * grid that never changes shape only has to state `columns`.
 *
 * @param props - Grid configuration options and element attributes.
 * @param props.columns - Columns from the smallest viewport. Defaults to 1.
 * @param props.columnsMd - Columns from `md` upwards.
 * @param props.columnsLg - Columns from `lg` upwards.
 * @param props.gap - Space between cells. Defaults to "md".
 * @param props.align - Cross-axis alignment. Defaults to "stretch".
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered grid.
 *
 * @example
 * ```tsx
 * <Grid columns={1} columnsMd={2} columnsLg={3} gap="lg">
 *   <Card title="Inbox" description="12 unread" />
 *   <Card title="Sent" description="348 this month" />
 *   <Card title="Drafts" description="3 unfinished" />
 * </Grid>
 * ```
 *
 * @see Stack - The one-axis equivalent.
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      as,
      columns,
      columnsMd,
      columnsLg,
      gap,
      align,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.grid;

    const resolvedColumns = resolveCascade<GridColumns>(
      columns,
      sectionConfig?.columns,
      undefined,
      FALLBACK_GRID_CONFIG.columns,
    );

    const resolvedColumnsMd = columnsMd ?? sectionConfig?.columnsMd;
    const resolvedColumnsLg = columnsLg ?? sectionConfig?.columnsLg;

    const resolvedGap = resolveCascade<Space>(
      gap,
      sectionConfig?.gap,
      undefined,
      FALLBACK_GRID_CONFIG.gap,
    );

    const resolvedAlign = resolveCascade<GridAlign>(
      align,
      sectionConfig?.align,
      undefined,
      FALLBACK_GRID_CONFIG.align,
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        className={cn(
          GRID_BASE_CLASS,
          GRID_COLUMNS_CLASS[resolvedColumns],
          resolvedColumnsMd !== undefined &&
            GRID_COLUMNS_MD_CLASS[resolvedColumnsMd],
          resolvedColumnsLg !== undefined &&
            GRID_COLUMNS_LG_CLASS[resolvedColumnsLg],
          GRID_ALIGN_CLASS[resolvedAlign],
          SPACE_GAP_CLASS[resolvedGap],
          className,
        )}
        {...rest}>
        {children}
      </Component>
    );
  },
);

Grid.displayName = "Grid";
