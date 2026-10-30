/**
 * The web renderer's class dictionaries for sidebar-layout.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/layouts/sidebar-layout/sidebar-layout-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { SidebarLayoutWidth } from "@asheeui/core";

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
