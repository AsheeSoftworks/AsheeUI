/**
 * Select component styles for AsheeUI.
 * This file provides CSS class mappings for the Select component's
 * size and status options.
 */

import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import { FIELD_STATUS_BORDER_CLASS } from "../field/field-styles";

/**
 * CSS classes for select trigger size.
 * Maps size keys to Tailwind classes that control height,
 * padding, and font size.
 */
export const SELECT_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

/**
 * CSS classes for select status border styles.
 * Maps status values to Tailwind classes for border and
 * focus ring colors. Re-exports FIELD_STATUS_BORDER_CLASS.
 */
export const SELECT_STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  FIELD_STATUS_BORDER_CLASS;
