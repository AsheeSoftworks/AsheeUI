/**
 * Switch component styles for AsheeUI.
 * This file provides CSS class mappings for the Switch component's
 * track size, thumb size, and thumb translation options.
 */

import type { FieldSizeKey } from "../field/field-config";

/**
 * CSS classes for switch track size.
 * Maps size keys to Tailwind width, height, and padding classes.
 */
export const SWITCH_TRACK_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "w-8 h-4.5 p-0.5",
  md: "w-11 h-6 p-0.5",
  lg: "w-14 h-7.5 p-1",
};

/**
 * CSS classes for switch thumb size.
 * Maps size keys to Tailwind width and height classes.
 */
export const SWITCH_THUMB_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-5.5",
};

/**
 * CSS classes for switch thumb translation.
 * Maps size keys to Tailwind translate classes that control how far
 * the thumb moves when checked.
 */
export const SWITCH_THUMB_TRANSLATE_CLASS: Record<FieldSizeKey, string> = {
  sm: "translate-x-3.5",
  md: "translate-x-5",
  lg: "translate-x-6",
};
