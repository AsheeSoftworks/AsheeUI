/**
 * Every class string the Split renders, for both renderers.
 *
 * The web states the breakpoint as a variant prefix, because a media query is what a
 * browser has; the platform states it as a value the component reads from the window
 * and branches on, because React Native reports a width rather than a media query.
 * Both read the same maps, so a change to the division of the width lands on both
 * platforms at once. Every entry is a complete, static class string, because both
 * Tailwind and NativeWind compile the classes they can read in the source.
 */

import type { SplitAlign, SplitRatio, SplitStackAt } from "./split-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/** Shared classes for every split. */
export const SPLIT_BASE_CLASS = "flex w-full min-w-0";

/**
 * Stacking classes per breakpoint.
 * Below the breakpoint the panes are a column, so a narrow screen reads the panes in
 * the order they are written rather than side by side.
 */
export const SPLIT_STACK_CLASS: Record<SplitStackAt, string> = {
  sm: "flex-col sm:flex-row",
  md: "flex-col md:flex-row",
  lg: "flex-col lg:flex-row",
  xl: "flex-col xl:flex-row",
};

/** Cross-axis alignment classes for the wide layout. */
export const SPLIT_ALIGN_CLASS: Record<SplitAlign, string> = {
  start: "items-start",
  center: "items-center",
  stretch: "items-stretch",
};

/** Shared classes for every pane. */
export const SPLIT_PANE_BASE_CLASS = "w-full min-w-0";

/**
 * Width each pane takes once the panes sit side by side, per breakpoint and ratio.
 * `flex-basis` decides the main size of a flex item, so it settles the division of the
 * width without the panes having to grow.
 */
export const SPLIT_PANE_WIDTH_CLASS: Record<
  SplitStackAt,
  Record<SplitRatio, { start: string; end: string }>
> = {
  sm: {
    equal: { start: "sm:basis-1/2", end: "sm:basis-1/2" },
    start: { start: "sm:basis-2/3", end: "sm:basis-1/3" },
    end: { start: "sm:basis-1/3", end: "sm:basis-2/3" },
  },
  md: {
    equal: { start: "md:basis-1/2", end: "md:basis-1/2" },
    start: { start: "md:basis-2/3", end: "md:basis-1/3" },
    end: { start: "md:basis-1/3", end: "md:basis-2/3" },
  },
  lg: {
    equal: { start: "lg:basis-1/2", end: "lg:basis-1/2" },
    start: { start: "lg:basis-2/3", end: "lg:basis-1/3" },
    end: { start: "lg:basis-1/3", end: "lg:basis-2/3" },
  },
  xl: {
    equal: { start: "xl:basis-1/2", end: "xl:basis-1/2" },
    start: { start: "xl:basis-2/3", end: "xl:basis-1/3" },
    end: { start: "xl:basis-1/3", end: "xl:basis-2/3" },
  },
};

/**
 * Divider classes per breakpoint.
 * Stacked panes are separated by a horizontal rule; side-by-side panes by a vertical
 * one, which the same utility produces because it follows the flex direction.
 */
export const SPLIT_DIVIDER_CLASS: Record<SplitStackAt, string> = {
  sm: "divide-y divide-border sm:divide-y-0 sm:divide-x",
  md: "divide-y divide-border md:divide-y-0 md:divide-x",
  lg: "divide-y divide-border lg:divide-y-0 lg:divide-x",
  xl: "divide-y divide-border xl:divide-y-0 xl:divide-x",
};

/**
 * Sticky classes for a pane that stays in view.
 * A sticky flex item also needs to stop stretching, or it has no room to move within
 * its parent.
 */
export const SPLIT_STICKY_CLASS = "sticky top-0 self-start";

// ─── Native ───────────────────────────────────────────────────────────────────

/** Shared classes for every native split. */
export const NATIVE_SPLIT_BASE_CLASS = "flex w-full";

/** The direction the panes take at each state, which the component resolves itself. */
export const NATIVE_SPLIT_DIRECTION_CLASS = {
  stacked: "flex-col",
  sideBySide: "flex-row",
} as const;

/** Cross-axis alignment classes for the panes. */
export const NATIVE_SPLIT_ALIGN_CLASS: Record<SplitAlign, string> = {
  start: "items-start",
  center: "items-center",
  stretch: "items-stretch",
};

/** The pane's classes while the panes are stacked, where each fills the width. */
export const NATIVE_SPLIT_PANE_STACKED_CLASS = "w-full";

/**
 * The share of the width each pane takes once the panes sit side by side.
 *
 * The division is the same as the web's — a half, or a third and two thirds — stated as
 * an explicit percentage rather than as a `flex-basis`, which is the same choice the
 * grid makes: the flex item keeps its default shrink, so the two panes and the gap
 * between them still add up to the width.
 */
export const NATIVE_SPLIT_PANE_WIDTH_CLASS: Record<
  SplitRatio,
  { start: string; end: string }
> = {
  equal: { start: "w-[50%]", end: "w-[50%]" },
  start: { start: "w-[66%]", end: "w-[33%]" },
  end: { start: "w-[33%]", end: "w-[66%]" },
};

/**
 * The rule between the panes.
 *
 * The web draws it with a `divide` utility that follows the flex direction; the
 * platform has no such utility, so the rule is stated on the second pane and which edge
 * it sits on is decided by the direction the component resolved.
 */
export const NATIVE_SPLIT_DIVIDER_STACKED_CLASS = "border-t border-border";

/** The rule between two side-by-side panes. */
export const NATIVE_SPLIT_DIVIDER_ROW_CLASS = "border-l border-border";

/**
 * The sticky treatment of the second pane.
 *
 * The platform has no scroll-linked positioning, so there is nothing for this class to
 * say; it is empty rather than absent so that `stickyEnd` remains a shared option that
 * a screen ignores rather than one it has to strip. A screen that must keep a pane in
 * view puts it in its own scrolling region.
 */
export const NATIVE_SPLIT_STICKY_CLASS = "";
