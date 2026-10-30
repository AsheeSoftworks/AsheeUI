/**
 * The breakpoint the window has reached, for the web renderer.
 *
 * The web answers a layout question two ways, and they are not interchangeable. A *style*
 * is a media query inside a class, which is what the renderer uses everywhere it can. A
 * *branch* — render a table or cards, a row or a column — cannot be a class, because it
 * decides which elements exist. This hook is the second one, and it returns the same state
 * the platform's `useBreakpoint()` returns from `@asheeui/native`, so one component can ask
 * the question once and mean it on both renderers.
 *
 * The width is read after mount, so server rendering always produces the narrow arrangement
 * and hydration never mismatches: a page that renders cards on the server and a table in the
 * browser would warn, and a flash of the wide arrangement is worse than a frame at `base`.
 * The rule that turns a width into a name is `@asheeui/core`'s, the same one the platform
 * uses, so `md` means 768 on both.
 */

"use client";

import {
  BREAKPOINT,
  type Breakpoint,
  type BreakpointName,
  type BreakpointState,
  deprecateMany,
  resolveBreakpoint,
} from "@asheeui/core";
import { useCallback, useEffect, useMemo, useState } from "react";

export type { BreakpointName, BreakpointState };
export { resolveBreakpoint };

// ─── Deprecated: the platform-suffixed spellings, removed in the next major ───

deprecateMany("@asheeui/web/use-breakpoint", [
  { from: "WebBreakpoint", to: "BreakpointName", since: "2.8.0" },
  { from: "WebBreakpointState", to: "BreakpointState", since: "2.8.0" },
]);

/**
 * The breakpoint a width has reached, or `base` below the smallest one.
 *
 * The shared {@link BreakpointName}, which is the name a shared component writes; this is
 * the spelling the web renderer published first.
 */
export type WebBreakpoint = BreakpointName;

/**
 * The responsive state a component reads.
 *
 * The shared {@link BreakpointState}, under the spelling this renderer published first.
 */
export type WebBreakpointState = BreakpointState;

/**
 * Read the window's breakpoint.
 *
 * The hook follows the window: it measures on mount and re-renders on resize, which is what
 * a media query does for styles and what a component that branches needs as a value.
 *
 * @returns The window width in pixels, the breakpoint it reached and a comparison helper.
 *
 * @example
 * ```tsx
 * const { isAtLeast } = useBreakpoint();
 *
 * return isAtLeast("lg") ? <Table rows={rows} /> : <Cards rows={rows} />;
 * ```
 *
 * @see useBreakpoint - The platform's hook, under the same name and shape.
 * @see BREAKPOINT - The widths both renderers read.
 */
export function useBreakpoint(): BreakpointState {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const measure = () => setWidth(window.innerWidth);

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, []);

  const breakpoint = useMemo(() => resolveBreakpoint(width), [width]);
  const isAtLeast = useCallback(
    (target: Breakpoint) => width >= BREAKPOINT[target],
    [width],
  );

  return { width, breakpoint, isAtLeast };
}
