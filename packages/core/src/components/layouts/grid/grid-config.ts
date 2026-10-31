/**
 * The Grid's configuration section, shared by both platforms.
 *
 * A column count per breakpoint, a gap and an alignment mean the same thing on both platforms —
 * `resolveGridColumns` is the shared rule that turns a count stated at one breakpoint into the count
 * the next one inherits — so `components.grid` is declared here and each renderer keeps only the
 * values it lands on.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `grid` here is what makes `components.grid` a known configuration section on every
 * platform, without each renderer restating it.
 */

import type { GridAlign, GridColumns } from "../../../shared/grid";
import type { Space } from "../../../shared/spacing";

/**
 * The shared grid vocabulary, re-exported so a consumer that already reaches for it from a grid
 * section keeps working. The types themselves are declared in `shared/grid`, so a grid and a feature
 * grid name one type on both platforms.
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

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    grid: GridConfig;
  }
}
