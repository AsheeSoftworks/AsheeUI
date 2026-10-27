/**
 * Responsive breakpoints for the native package.
 *
 * The breakpoints and the rule that reads a width are the shared ones (`@asheeui/core`), so
 * a device and a browser that say `md` mean the same width and resolve it the same way.
 * React Native reports the window rather than matching a media query, so responsiveness
 * here is a value a component reads and acts on, which is why the hook returns state rather
 * than a set of class names.
 */

import {
  BREAKPOINT,
  type Breakpoint,
  type BreakpointName,
  type BreakpointState,
  resolveBreakpoint,
} from "@asheeui/core";
import { useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";

export { resolveBreakpoint };

/**
 * The breakpoint a width has reached, or `base` when it has not reached the smallest one.
 *
 * The web renderer exports the same union as `WebBreakpoint`; both are the shared
 * {@link BreakpointName}, which is the name a shared component should use.
 */
export type NativeBreakpoint = BreakpointName;

/**
 * The responsive state a component reads.
 *
 * Structurally the shared {@link BreakpointState}: a component written against that
 * interface works on either renderer.
 */
export type NativeBreakpointState = BreakpointState;

/**
 * Read the window's breakpoint.
 *
 * The hook follows the platform: it reads the window's own dimensions and re-renders when
 * they change, which is what happens in a rotation, in a split view and when a foldable
 * changes posture. It replaces a media query rather than imitating one, because the
 * platform has no media query to imitate.
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
 * @see useBreakpoint - The web renderer's hook, under the same name and shape.
 */
export function useBreakpoint(): BreakpointState {
  const { width } = useWindowDimensions();

  const breakpoint = useMemo(() => resolveBreakpoint(width), [width]);
  const isAtLeast = useCallback(
    (target: Breakpoint) => width >= BREAKPOINT[target],
    [width],
  );

  return { width, breakpoint, isAtLeast };
}
