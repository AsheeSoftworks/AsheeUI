/**
 * Spinner component styles for AsheeUI.
 * This file provides CSS class mappings for the Spinner component's
 * size and color options.
 */

import type { Color, Size } from "../../shared";

/**
 * CSS classes for spinner size.
 * Maps size keys to Tailwind width and height classes.
 */
export const SPINNER_SIZE_CLASS: Record<Size, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

/**
 * CSS classes for spinner colors.
 * Maps color keys to Tailwind text color classes.
 */
export const SPINNER_COLOR_CLASS: Record<Color, string> = {
  none: "text-background",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};
