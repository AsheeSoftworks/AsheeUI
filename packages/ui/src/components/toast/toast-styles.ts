/**
 * Toast styles for AsheeUI.
 * This file provides CSS class mappings for the Toast component's
 * width, padding, font, and animation options.
 */

import type { Size } from "../../shared";
import type { ToastPlacement } from "./toast-config";

/**
 * CSS classes for toast width based on size.
 * Maps size keys to Tailwind width classes.
 */
export const TOAST_WIDTH_CLASS: Record<Size, string> = {
  sm: "w-72 max-w-full",
  md: "w-80 max-w-full",
  lg: "w-96 max-w-full",
};

/**
 * CSS classes for toast padding based on size.
 * Maps size keys to Tailwind padding classes.
 */
export const TOAST_PADDING_CLASS: Record<Size, string> = {
  sm: "p-2.5",
  md: "p-3.5",
  lg: "p-4",
};

/**
 * CSS classes for toast message font size.
 * Maps size keys to Tailwind text size classes.
 */
export const TOAST_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for toast title font size.
 * Maps size keys to Tailwind text size and weight classes.
 */
export const TOAST_TITLE_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
};

/**
 * CSS classes for toast enter and exit animations.
 * Each placement has its own enter and exit animation classes.
 * These classes should be defined in your global CSS with keyframe animations.
 */
export const TOAST_ANIMATION_STATE: Record<
  ToastPlacement,
  { enter: string; exit: string }
> = {
  "top-right": {
    enter: "toast-enter-top-right",
    exit: "toast-exit-top-right",
  },
  "bottom-right": {
    enter: "toast-enter-bottom-right",
    exit: "toast-exit-bottom-right",
  },
  "top-left": {
    enter: "toast-enter-top-left",
    exit: "toast-exit-top-left",
  },
  "bottom-left": {
    enter: "toast-enter-bottom-left",
    exit: "toast-exit-bottom-left",
  },
  "top-center": {
    enter: "toast-enter-top-center",
    exit: "toast-exit-top-center",
  },
  "bottom-center": {
    enter: "toast-enter-bottom-center",
    exit: "toast-exit-bottom-center",
  },
};
