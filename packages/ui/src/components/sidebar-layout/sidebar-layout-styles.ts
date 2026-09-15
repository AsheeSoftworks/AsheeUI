/**
 * SidebarLayout component styles for AsheeUI.
 * This file provides the static class mappings for the application shell.
 */

import type { SidebarLayoutWidth } from "./sidebar-layout-config";

/**
 * The shell: a full-height column that becomes a row from the `lg` breakpoint,
 * where the navigation column and the content sit beside each other.
 */
export const SIDEBAR_LAYOUT_CLASS =
  "flex min-h-dvh w-full flex-col bg-background lg:flex-row";

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
