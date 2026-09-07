/**
 * TextArea component styles for AsheeUI.
 * This file provides CSS class mappings for the TextArea component's
 * size and status border options.
 */

import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import { FIELD_STATUS_BORDER_CLASS } from "../field/field-styles";

/**
 * CSS classes for textarea padding and font size.
 * Maps size keys to Tailwind padding and text size classes.
 */
export const TEXTAREA_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "p-2 text-xs",
  md: "p-3 text-sm",
  lg: "p-4 text-base",
};

/**
 * CSS classes for textarea status border styles.
 * Maps status values to Tailwind classes for border and
 * focus ring colors. Re-exports FIELD_STATUS_BORDER_CLASS.
 */
export const TEXTAREA_STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  FIELD_STATUS_BORDER_CLASS;
