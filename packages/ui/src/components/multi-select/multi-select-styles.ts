/**
 * MultiSelect component styles for AsheeUI.
 * This file provides CSS class mappings for the MultiSelect component's
 * height, padding, font, and status border options.
 */

import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import { FIELD_STATUS_BORDER_CLASS } from "../field/field-styles";

/**
 * CSS classes for multi-select trigger height based on size.
 * Controls the vertical dimension of the trigger button.
 */
export const MULTI_SELECT_HEIGHT_CLASS: Record<FieldSizeKey, string> = {
  sm: "h-9",
  md: "h-10",
  lg: "h-11",
};

/**
 * CSS classes for multi-select padding based on size.
 * Controls the horizontal padding of the trigger button.
 */
export const MULTI_SELECT_PADDING_CLASS: Record<FieldSizeKey, string> = {
  sm: "px-2.5",
  md: "px-3",
  lg: "px-3.5",
};

/**
 * CSS classes for multi-select font size based on size.
 * Controls the text size of the trigger button.
 */
export const MULTI_SELECT_FONT_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

/**
 * CSS classes for multi-select status border styles.
 * Maps status values to Tailwind classes for border and
 * focus ring colors.
 */
export const STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  FIELD_STATUS_BORDER_CLASS;
