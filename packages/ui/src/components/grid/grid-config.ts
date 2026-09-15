/**
 * Grid component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Grid layout
 * primitive: column counts per breakpoint, gap and alignment. It registers the
 * default configuration with the component registry and provides fallback
 * values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";

/**
 * Column counts a grid can declare.
 * Only the counts the framework's own layouts use are offered, so the class
 * map stays small and every entry is a complete literal.
 */
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

/**
 * Cross-axis alignment of the grid's items.
 * `stretch` makes every cell fill the row height, which is what a row of cards
 * wants.
 */
export type GridAlign = "start" | "center" | "end" | "stretch";

/**
 * Theme configuration options for the Grid component.
 *
 * Set under `components.grid` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface GridConfig {
  /**
   * Column count from the smallest viewport upwards.
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
   * Space between cells.
   *
   * @default "md"
   */
  gap?: Space;

  /**
   * Cross-axis alignment of the cells.
   *
   * @default "stretch"
   */
  align?: GridAlign;
}

/**
 * Default config values registered for the Grid component.
 */
export const defaultGridConfig: GridConfig = {
  columns: 1,
  gap: "md",
  align: "stretch",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    grid: GridConfig;
  }
}

registerComponentDefaults("grid", defaultGridConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * `columnsMd` and `columnsLg` have no fallback on purpose: an unstated
 * breakpoint inherits the value below it rather than forcing a column count.
 */
export const FALLBACK_GRID_CONFIG: Required<
  Pick<GridConfig, "columns" | "gap" | "align">
> = {
  columns: 1,
  gap: "md",
  align: "stretch",
};
