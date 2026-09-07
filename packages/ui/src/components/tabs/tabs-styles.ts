/**
 * Tabs component styles for AsheeUI.
 * This file provides CSS class mappings for the Tabs component's
 * height, padding, and font size options.
 */

import type { Size } from "../../shared";

/**
 * CSS classes for tab trigger height.
 * Maps size keys to Tailwind height classes.
 */
export const TABS_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

/**
 * CSS classes for tab trigger horizontal padding.
 * Maps size keys to Tailwind padding-x classes.
 */
export const TABS_PADDING_X_CLASS: Record<Size, string> = {
  sm: "px-2.5",
  md: "px-3.5",
  lg: "px-4",
};

/**
 * CSS classes for tab trigger font size.
 * Maps size keys to Tailwind text size classes.
 */
export const TABS_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};
