/**
 * Badge component styles for AsheeUI.
 * This file provides CSS class mappings for the Badge component's height,
 * padding, font size, gap, and icon size options.
 */

import type { Size } from "../../shared";

/**
 * CSS classes for badge height based on size.
 * Controls the vertical dimension of the badge.
 */
export const BADGE_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-5",
  md: "h-6",
  lg: "h-7",
};

/**
 * CSS classes for badge horizontal padding based on size.
 * Controls the left and right padding of the badge.
 */
export const BADGE_PADDING_CLASS: Record<Size, string> = {
  sm: "px-1.5",
  md: "px-2",
  lg: "px-2.5",
};

/**
 * CSS classes for badge font size based on size.
 * Controls the text size of the badge content.
 */
export const BADGE_FONT_CLASS: Record<Size, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

/**
 * CSS classes for badge gap based on size.
 * Controls the spacing between an icon and the badge content.
 */
export const BADGE_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-1.5",
};

/**
 * CSS classes for icon size based on size.
 * Applied to the icon slot so an icon matches the badge's scale.
 */
export const BADGE_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "[&_svg]:size-3",
  md: "[&_svg]:size-3.5",
  lg: "[&_svg]:size-4",
};
