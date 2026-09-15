/**
 * Spacing token definitions for AsheeUI.
 *
 * This file provides the shared spacing scale that the layout components use
 * for gaps, vertical rhythm and section padding. Every entry is a complete,
 * static Tailwind class string, so the scale never assembles a utility name at
 * runtime (Hard Rule 5) and a layout component can resolve spacing through the
 * standard configuration cascade.
 */

/**
 * The available spacing tokens.
 * The scale is intentionally small: it exists so layout primitives agree on
 * rhythm, not so it can express every value Tailwind supports.
 */
export type Space = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Flex and grid gap classes for each spacing token.
 * Used by `Stack` and `Grid` for the space between their children.
 */
export const SPACE_GAP_CLASS: Record<Space, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};

/**
 * Vertical rhythm classes for stacked block content.
 * Applied to a container whose direct children are blocks rather than
 * flex or grid items.
 */
export const SPACE_BLOCK_CLASS: Record<Space, string> = {
  none: "space-y-0",
  xs: "space-y-1",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
  "2xl": "space-y-12",
};

/**
 * Vertical padding classes for a page section.
 * Larger tokens add a wider step at the `md` breakpoint, so the same token
 * reads as a section on a phone and as a band on a wide screen.
 */
export const SPACE_PADDING_Y_CLASS: Record<Space, string> = {
  none: "py-0",
  xs: "py-2",
  sm: "py-6",
  md: "py-8 md:py-12",
  lg: "py-12 md:py-16",
  xl: "py-16 md:py-24",
  "2xl": "py-20 md:py-32",
};

/**
 * Horizontal padding classes for a page gutter.
 * Used by `Container`, where the gutter widens with the viewport.
 */
export const SPACE_PADDING_X_CLASS: Record<Space, string> = {
  none: "px-0",
  xs: "px-1",
  sm: "px-3",
  md: "px-4 sm:px-6",
  lg: "px-4 sm:px-6 lg:px-8",
  xl: "px-6 sm:px-8 lg:px-12",
  "2xl": "px-8 sm:px-12 lg:px-16",
};
