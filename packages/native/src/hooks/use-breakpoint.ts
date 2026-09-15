/**
 * Responsive breakpoints for the native package.
 *
 * The breakpoints are the shared ones (`@asheeui/shared`), read as
 * density-independent pixels, so a native layout and a web layout that say `md`
 * mean the same width. React Native reports the window rather than a media query,
 * so responsiveness here is a value a component reads and acts on, which is why
 * the hook returns state rather than a set of class names.
 */

import { BREAKPOINT, type Breakpoint } from "@asheeui/shared";
import { useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";

/**
 * The breakpoint a width has reached, or `base` when it has not reached the
 * smallest one.
 */
export type NativeBreakpoint = Breakpoint | "base";

/**
 * The responsive state a component reads.
 */
export interface NativeBreakpointState {
  /** The current window width in density-independent pixels. */
  width: number;

  /**
   * The largest breakpoint the width has reached, or `base` below the smallest.
   * A component switches on this value rather than on the width itself, so the
   * vocabulary is the framework's rather than a number each component remembers.
   */
  breakpoint: NativeBreakpoint;

  /**
   * Whether the width has reached a breakpoint.
   *
   * @param breakpoint - The breakpoint to compare against.
   * @returns True when the window is at least that wide.
   */
  isAtLeast: (breakpoint: Breakpoint) => boolean;
}

/**
 * Resolve the breakpoint a width has reached.
 * It is a pure function so the boundaries can be tested without a device, and so
 * a component that measures its own container (a split view, a tablet pane) can
 * reuse the rule.
 *
 * @param width - A width in density-independent pixels.
 * @returns The largest breakpoint the width reached, or `base`.
 *
 * @example
 * ```ts
 * resolveBreakpoint(750); // "sm", because 750 is past 640 and before 768
 * ```
 */
export function resolveBreakpoint(width: number): NativeBreakpoint {
  const reached = (Object.keys(BREAKPOINT) as Breakpoint[])
    .filter((name) => width >= BREAKPOINT[name])
    .pop();

  return reached ?? "base";
}

/**
 * Read the window's breakpoint.
 *
 * The hook follows the platform: it reads the window's own dimensions and
 * re-renders when they change, which is what happens in a rotation, in a split
 * view and when a foldable changes posture. It replaces a media query rather than
 * imitating one, because the platform has no media query to imitate.
 *
 * @returns The window width, the breakpoint it reached and a comparison helper.
 *
 * @example
 * ```tsx
 * const { isAtLeast } = useBreakpoint();
 *
 * return <Stack direction={isAtLeast("md") ? "row" : "column"} />;
 * ```
 *
 * @see Grid - Uses it to resolve its column count.
 */
export function useBreakpoint(): NativeBreakpointState {
  const { width } = useWindowDimensions();

  const breakpoint = useMemo(() => resolveBreakpoint(width), [width]);
  const isAtLeast = useCallback(
    (target: Breakpoint) => width >= BREAKPOINT[target],
    [width],
  );

  return { width, breakpoint, isAtLeast };
}
