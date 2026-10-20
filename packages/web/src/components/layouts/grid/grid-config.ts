/**
 * Grid component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Grid layout
 * primitive: column counts per breakpoint, gap and alignment. It registers the
 * default configuration with the component registry and provides fallback
 * values for the cascade resolution system.
 */

import {
  type GridAlign,
  type GridColumns,
  registerComponentDefaults,
  type Space,
} from "@asheeui/core";

/**
 * The shared grid vocabulary, re-exported so code that already reaches for it
 * here keeps working. The types themselves are declared in `@asheeui/core`, so a
 * grid and a feature grid name one type on both platforms.
 */
export type { GridAlign, GridColumns };

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
  columns?: GridColumns | undefined;

  /**
   * Column count from the `md` breakpoint upwards.
   */
  columnsMd?: GridColumns | undefined;

  /**
   * Column count from the `lg` breakpoint upwards.
   */
  columnsLg?: GridColumns | undefined;

  /**
   * Space between cells.
   *
   * @default "md"
   */
  gap?: Space | undefined;

  /**
   * Cross-axis alignment of the cells.
   *
   * @default "stretch"
   */
  align?: GridAlign | undefined;
}

/**
 * Default config values registered for the Grid component.
 */
export const defaultGridConfig: GridConfig = {
  columns: 1,
  gap: "md",
  align: "stretch",
};

declare module "@asheeui/core" {
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
export const FALLBACK_GRID_CONFIG = {
  columns: 1,
  gap: "md",
  align: "stretch",
} satisfies Pick<GridConfig, "columns" | "gap" | "align">;
