/**
 * Every class string the SidebarLayout renders, for both renderers, kept side by side so a change
 * to the shell's shape lands on both platforms at once. Every entry is a complete, static class
 * string, because both Tailwind and NativeWind compile the classes they can read in the source.
 */

import type { SidebarLayoutWidth } from "./sidebar-layout-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The shell: a full-height column of the header, the two-column row and the
 * footer. The shell itself stays a column at every width, so the header and the
 * footer always span the page rather than sitting beside the columns.
 */
export const SIDEBAR_LAYOUT_CLASS =
  "flex min-h-dvh w-full flex-col bg-background";

/**
 * The row that holds the navigation column and the content column.
 * It stacks the two columns on a narrow screen and places them side by side
 * from the `lg` breakpoint, which is where the shell becomes two columns.
 */
export const SIDEBAR_LAYOUT_ROW_CLASS =
  "flex w-full flex-1 flex-col lg:flex-row";

/** The navigation column, stacked above the content on a narrow screen. */
export const SIDEBAR_LAYOUT_ASIDE_CLASS =
  "w-full shrink-0 border-b border-border";

/** The navigation column when it sits at the trailing edge. */
export const SIDEBAR_LAYOUT_ASIDE_END_CLASS = "lg:order-last";

/** The separator of the navigation column on the leading edge. */
export const SIDEBAR_LAYOUT_ASIDE_START_BORDER_CLASS = "lg:border-r";

/** The separator of the navigation column on the trailing edge. */
export const SIDEBAR_LAYOUT_ASIDE_END_BORDER_CLASS = "lg:border-l";

/** Keeps the navigation column in view while the content scrolls. */
export const SIDEBAR_LAYOUT_ASIDE_STICKY_CLASS =
  "lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto";

/** The content column. */
export const SIDEBAR_LAYOUT_CONTENT_CLASS = "flex min-w-0 flex-1 flex-col";

/** Width of the navigation column at each size, from `lg` upwards. */
export const SIDEBAR_LAYOUT_WIDTH_CLASS: Record<SidebarLayoutWidth, string> = {
  sm: "lg:w-56",
  md: "lg:w-64",
  lg: "lg:w-80",
};

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The native shell.
 *
 * The web states a minimum height in viewport units, because a document page grows with what it
 * holds and has to be told not to be shorter than the window; a native screen is given its height
 * by the platform, so the shell is what fills it.
 */
export const NATIVE_SIDEBAR_LAYOUT_CLASS =
  "flex-1 w-full flex-col bg-background";

/** The row that holds the navigation and the content. */
export const NATIVE_SIDEBAR_LAYOUT_ROW_CLASS = "flex w-full flex-1 flex-col";

/**
 * The row once the window is wide enough for two columns.
 * The web says `lg` as a variant prefix and lets the browser reflow; the platform has no media
 * query, so the shell asks `useBreakpoint` the same width and states the direction it means.
 */
export const NATIVE_SIDEBAR_LAYOUT_ROW_SPLIT_CLASS = "flex-row";

/**
 * The native navigation column.
 *
 * The platform states the separator that follows the direction the window produced: a stacked
 * column is separated from the content below it, and a column beside the content is separated
 * from it along the edge the side puts it on. The web states the stacked rule once and the row
 * rules as variants; here the two are separate classes because the direction is a decision rather
 * than a width.
 */
export const NATIVE_SIDEBAR_LAYOUT_ASIDE_CLASS = "w-full shrink-0";

/** The separator of the stacked navigation column. */
export const NATIVE_SIDEBAR_LAYOUT_ASIDE_STACKED_BORDER_CLASS = "border-b";

/** The separator of the navigation column on the leading edge. */
export const NATIVE_SIDEBAR_LAYOUT_ASIDE_START_BORDER_CLASS = "border-r";

/** The separator of the navigation column on the trailing edge. */
export const NATIVE_SIDEBAR_LAYOUT_ASIDE_END_BORDER_CLASS = "border-l";

/**
 * The navigation column when it sits at the trailing edge.
 * The platform places the column after the content, whether the two are stacked or side by side,
 * so one order statement covers both arrangements.
 */
export const NATIVE_SIDEBAR_LAYOUT_ASIDE_END_CLASS = "order-last";

/**
 * The native answer to keeping the column in view.
 *
 * The platform has no scroll-linked positioning. What it has is a shell that places the column
 * beside the content: the consumer's own scrolling region lives inside the content, so a column
 * placed outside it is already in view for as long as the screen is. A screen that wants its
 * navigation to scroll away with the content puts the navigation inside its own scroller, which
 * is the platform's own way of arranging that. The option therefore resolves through the shared
 * contract and states nothing here, rather than claiming a stickiness the platform does not have.
 */
export const NATIVE_SIDEBAR_LAYOUT_ASIDE_STICKY_CLASS = "";

/** The content column. */
export const NATIVE_SIDEBAR_LAYOUT_CONTENT_CLASS = "flex flex-1 flex-col";

/**
 * Width of the navigation column at each size, once the columns sit side by side.
 *
 * The web states the widths at the breakpoint it becomes two columns; the platform states them
 * alongside the direction decision, because a stacked column is as wide as the screen.
 */
export const NATIVE_SIDEBAR_LAYOUT_WIDTH_CLASS: Record<
  SidebarLayoutWidth,
  string
> = {
  sm: "w-56",
  md: "w-64",
  lg: "w-80",
};
