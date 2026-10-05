/**
 * Tooltip component styles for AsheeUI.
 * This file provides CSS class mappings for the Tooltip component's
 * padding and font size options.
 */

import type { TooltipSizeKey } from "./tooltip-config";

/**
 * CSS classes for tooltip horizontal padding.
 * Maps size keys to Tailwind padding-x classes.
 */
export const TOOLTIP_PADDING_X_CLASS: Record<TooltipSizeKey, string> = {
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

/**
 * CSS classes for tooltip vertical padding.
 * Maps size keys to Tailwind padding-y classes.
 */
export const TOOLTIP_PADDING_Y_CLASS: Record<TooltipSizeKey, string> = {
  sm: "py-1",
  md: "py-1.5",
  lg: "py-2",
};

/**
 * CSS classes for tooltip font size.
 * Maps size keys to Tailwind text size classes.
 */
export const TOOLTIP_FONT_CLASS: Record<TooltipSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};
