/**
 * Grid component styles for AsheeUI.
 * This file provides the static class mappings for the Grid layout primitive:
 * columns per breakpoint and cross-axis alignment.
 */

import type { GridAlign, GridColumns } from "./grid-config";

/** Column classes from the smallest viewport upwards. */
export const GRID_COLUMNS_CLASS: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

/** Column classes from the `md` breakpoint upwards. */
export const GRID_COLUMNS_MD_CLASS: Record<GridColumns, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};

/** Column classes from the `lg` breakpoint upwards. */
export const GRID_COLUMNS_LG_CLASS: Record<GridColumns, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

/** Cross-axis alignment classes. */
export const GRID_ALIGN_CLASS: Record<GridAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

/** Shared base classes for every grid. */
export const GRID_BASE_CLASS = "grid w-full min-w-0";
