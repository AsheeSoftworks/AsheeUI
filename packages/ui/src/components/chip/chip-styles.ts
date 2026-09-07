/**
 * Chip component styles for AsheeUI.
 * This file provides CSS class mappings for the Chip component's
 * height, padding, font, gap, and icon size options.
 */

import type { Size } from "../../shared";

/**
 * CSS classes for chip height based on size.
 * Controls the vertical dimension of the chip.
 */
export const CHIP_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-6",
  md: "h-7",
  lg: "h-8",
};

/**
 * CSS classes for chip horizontal padding based on size.
 * Controls the left and right padding of the chip.
 */
export const CHIP_PADDING_CLASS: Record<Size, string> = {
  sm: "px-2",
  md: "px-2.5",
  lg: "px-3",
};

/**
 * CSS classes for chip font size based on size.
 * Controls the text size of the chip label.
 */
export const CHIP_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for chip gap based on size.
 * Controls the spacing between chip elements (icon, avatar, dot, label).
 */
export const CHIP_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

/**
 * CSS classes for chip icon size based on size.
 * Controls the dimensions of icons, avatars, and close buttons.
 */
export const CHIP_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
};
