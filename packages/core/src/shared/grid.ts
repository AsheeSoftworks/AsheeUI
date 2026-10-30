/**
 * The grid vocabulary the framework's layouts share.
 *
 * A column count is a design-language decision rather than a renderer's: a band that lays
 * its features out in three columns is asking the same question on the web and on a tablet.
 * The counts are declared here so a pattern can state them wherever it is written, and so
 * `Grid` on either platform reads one list rather than two.
 *
 * The list is deliberately short. It holds the counts the framework's own layouts use, so
 * every count has a complete class literal behind it rather than an assembled one
 * (Hard Rule 5).
 */

import type { BreakpointName } from "./breakpoints";

/**
 * Column counts a grid can declare.
 * Only the counts the framework's own layouts use are offered, so the class map stays
 * small and every entry is a complete literal.
 */
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

/**
 * Cross-axis alignment of a grid's items.
 * `stretch` makes every cell fill the row height, which is what a row of cards wants.
 */
export type GridAlign = "start" | "center" | "end" | "stretch";

/**
 * The column counts a grid may state per breakpoint.
 *
 * Structural rather than a named configuration type: the web's grid states `GridColumns`,
 * the platform's states a number, and the rule below reads three keys of either.
 */
export interface GridColumnOptions {
  /** Columns from the smallest width upwards. */
  columns?: number;

  /** Columns from the `md` breakpoint upwards. */
  columnsMd?: number;

  /** Columns from the `lg` breakpoint upwards. */
  columnsLg?: number;
}

/**
 * Resolve how many columns a grid shows at a breakpoint.
 *
 * A count stated at a smaller breakpoint is inherited by the larger ones, which is the same
 * rule the web grid states through the order of its class variants: a grid that never
 * changes shape states only `columns`. The rule lives here rather than in a renderer because
 * it is the same rule on both — a device and a browser that say `lg` mean the same width,
 * and a boundary written twice is two boundaries.
 *
 * The web's `Grid` is class-driven and needs no number; the platform's is value-driven and
 * needs this one. Both packages export it, so a component that measures its own container
 * can ask the same question.
 *
 * @param config - The grid's options.
 * @param breakpoint - The breakpoint the layout is being resolved at.
 * @returns The column count to use.
 *
 * @example
 * ```ts
 * resolveGridColumns({ columns: 1, columnsMd: 2 }, "lg"); // 2
 * ```
 */
export function resolveGridColumns(
  config: GridColumnOptions,
  breakpoint: BreakpointName,
): number {
  const base = config.columns ?? 1;

  if (breakpoint === "lg" || breakpoint === "xl") {
    return config.columnsLg ?? config.columnsMd ?? base;
  }

  if (breakpoint === "md") {
    return config.columnsMd ?? base;
  }

  return base;
}
