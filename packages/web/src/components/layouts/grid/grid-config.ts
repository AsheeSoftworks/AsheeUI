/**
 * Grid component configuration for AsheeUI.
 *
 * The *shape* of `components.grid` is `@asheeui/core`'s — the column counts per breakpoint, the gap
 * and the alignment are declared once, for both platforms, in
 * `packages/core/src/components/layouts/grid/grid-config.ts`. This module keeps what is the web's:
 * the defaults it registers and the hard fallbacks it states.
 */

import type { GridConfig } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

/**
 * The shared grid vocabulary, re-exported so code that already reaches for it here keeps working.
 * The types themselves are declared in `@asheeui/core`, so a grid and a feature grid name one type on
 * both platforms.
 */
export type { GridAlign, GridColumns, GridConfig } from "@asheeui/core";

/**
 * Default config values registered for the Grid component.
 */
export const defaultGridConfig: GridConfig = {
  columns: 1,
  gap: "md",
  align: "stretch",
};

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
