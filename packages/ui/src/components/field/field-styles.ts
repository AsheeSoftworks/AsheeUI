/**
 * Field component styles for AsheeUI.
 * This file provides CSS class mappings for field components' labels,
 * status messages, sizes, and spacing options.
 */

import type { FieldSizeKey, FieldStatus, LabelAlign } from "./field-config";

/**
 * CSS classes for label alignment.
 * Controls the text alignment of field labels.
 */
export const FIELD_LABEL_ALIGN_CLASS: Record<LabelAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * CSS classes for status message text colors.
 * Maps status values to Tailwind text color classes.
 */
export const FIELD_STATUS_TEXT_CLASS: Record<FieldStatus, string> = {
  default: "text-foreground",
  error: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

/**
 * CSS classes for label font size based on field size.
 */
export const FIELD_LABEL_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for description font size based on field size.
 */
export const FIELD_DESCRIPTION_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
};

/**
 * CSS classes for message font size based on field size.
 */
export const FIELD_MESSAGE_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
};

/**
 * CSS classes for field shell gap based on field size.
 * Controls the spacing between field elements.
 */
export const FIELD_SHELL_GAP_CLASS: Record<FieldSizeKey, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

export const FIELD_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "",
  error:
    "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
  warning:
    "border-warning focus-visible:border-warning focus-visible:ring-warning/20",
  success:
    "border-success focus-visible:border-success focus-visible:ring-success/20",
};
