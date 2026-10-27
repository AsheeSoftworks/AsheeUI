/**
 * The breakpoints as a value a component can branch on.
 *
 * `BREAKPOINT` states the widths; this module states what a *width* means, so both
 * renderers answer the question the same way. The web asks the window, the platform asks
 * its own dimensions, and a component that has to choose an arrangement — a table or cards,
 * a row or a column — reads one name rather than re-deriving thresholds.
 *
 * The resolver is here rather than in a renderer for the reason the tokens are here: it is
 * the same rule on both platforms, and two copies of a boundary are two boundaries.
 */

import { BREAKPOINT, type Breakpoint } from "../tokens";

/**
 * The largest breakpoint a width has reached, or `base` below the smallest.
 *
 * `base` is not a token: it is the absence of one, and every layout is written for it
 * first.
 */
export type BreakpointName = Breakpoint | "base";

/**
 * The responsive state a component reads.
 *
 * It is a value rather than a set of class names because the platform reports a width
 * instead of matching a media query, and a shared component has to ask a question both
 * renderers can answer.
 */
export interface BreakpointState {
  /** The current width in density-independent pixels. */
  width: number;

  /** The largest breakpoint the width has reached, or `base` below the smallest. */
  breakpoint: BreakpointName;

  /**
   * Whether the width has reached a breakpoint.
   *
   * @param breakpoint - The breakpoint to compare against.
   * @returns True when the width is at least that wide.
   */
  isAtLeast: (breakpoint: Breakpoint) => boolean;
}

/**
 * Resolve the breakpoint a width has reached.
 *
 * It is a pure function so the boundaries can be tested without a browser or a device, and
 * so a component that measures its own container can reuse the rule.
 *
 * @param width - A width in density-independent pixels.
 * @returns The largest breakpoint the width reached, or `base`.
 *
 * @example
 * ```ts
 * resolveBreakpoint(750); // "sm", because 750 is past 640 and before 768
 * resolveBreakpoint(1024); // "lg"
 * resolveBreakpoint(320); // "base"
 * ```
 */
export function resolveBreakpoint(width: number): BreakpointName {
  const reached = (Object.keys(BREAKPOINT) as Breakpoint[])
    .filter((name) => width >= BREAKPOINT[name])
    .pop();

  return reached ?? "base";
}
