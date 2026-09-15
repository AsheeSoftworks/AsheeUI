/**
 * Split component styles for AsheeUI.
 *
 * This file provides the static class mappings for the Split layout primitive.
 * The maps are keyed by the breakpoint at which the panes stop stacking, so a
 * consumer's choice of breakpoint never has to be assembled from parts: every
 * entry is a complete class string that Tailwind can see in the source.
 */

import type { SplitAlign, SplitRatio, SplitStackAt } from "./split-config";

/** Shared classes for every split. */
export const SPLIT_BASE_CLASS = "flex w-full min-w-0";

/**
 * Stacking classes per breakpoint.
 * Below the breakpoint the panes are a column, so a narrow screen reads the
 * panes in the order they are written rather than side by side.
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
 * Width each pane takes once the panes sit side by side, per breakpoint and
 * ratio. `flex-basis` decides the main size of a flex item, so it settles the
 * division of the width without the panes having to grow.
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
 * Stacked panes are separated by a horizontal rule; side-by-side panes by a
 * vertical one, which the same utility produces because it follows the flex
 * direction.
 */
export const SPLIT_DIVIDER_CLASS: Record<SplitStackAt, string> = {
  sm: "divide-y divide-border sm:divide-y-0 sm:divide-x",
  md: "divide-y divide-border md:divide-y-0 md:divide-x",
  lg: "divide-y divide-border lg:divide-y-0 lg:divide-x",
  xl: "divide-y divide-border xl:divide-y-0 xl:divide-x",
};

/**
 * Sticky classes for a pane that stays in view.
 * A sticky flex item also needs to stop stretching, or it has no room to move
 * within its parent.
 */
export const SPLIT_STICKY_CLASS = "sticky top-0 self-start";
