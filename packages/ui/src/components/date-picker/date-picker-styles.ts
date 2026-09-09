/**
 * DatePicker component styles for AsheeUI.
 * This file provides CSS class mappings for the DatePicker component's
 * size, status, and calendar color options.
 */

import type { Color } from "../../shared";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import { FIELD_STATUS_BORDER_CLASS } from "../field/field-styles";

// ─── Size Classes ────────────────────────────────────────────────────────────

/**
 * CSS classes for date picker trigger size.
 * Maps size keys to Tailwind classes that control the trigger's
 * height, padding, and font size.
 */
export const DATE_PICKER_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

/**
 * CSS classes for date picker calendar cell size.
 * Maps size keys to Tailwind classes that control individual
 * day cells in the calendar grid.
 */
export const DATE_PICKER_CELL_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-7 text-xs",
  md: "size-8 text-xs",
  lg: "size-9 text-sm",
};

// ─── Status Classes ──────────────────────────────────────────────────────────

/**
 * CSS classes for date picker status border styles.
 * Maps status values to Tailwind classes for border and
 * focus ring colors.
 */
export const DATE_PICKER_STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  FIELD_STATUS_BORDER_CLASS;

// ─── Color Classes ───────────────────────────────────────────────────────────

/**
 * CSS classes for calendar color variations.
 * Maps color names to the corresponding background, text,
 * border, and hover styles for calendar elements.
 */
export const CALENDAR_COLOR_CLASSES: Record<
  Color | string,
  { bg: string; text: string; border: string; hover: string }
> = {
  default: {
    bg: "bg-foreground text-background",
    text: "text-foreground",
    border: "border-foreground",
    hover: "hover:text-foreground hover:bg-secondary",
  },
  primary: {
    bg: "bg-primary text-primary-foreground",
    text: "text-primary",
    border: "border-primary",
    hover: "hover:text-primary hover:bg-primary/10",
  },
  secondary: {
    bg: "bg-secondary text-foreground/70",
    text: "text-secondary",
    border: "border-secondary",
    hover: "hover:text-secondary hover:bg-secondary/10",
  },
  success: {
    bg: "bg-success text-success-foreground",
    text: "text-success",
    border: "border-success",
    hover: "hover:text-success hover:bg-success/10",
  },
  warning: {
    bg: "bg-warning text-warning-foreground",
    text: "text-warning",
    border: "border-warning",
    hover: "hover:text-warning hover:bg-warning/10",
  },
  danger: {
    bg: "bg-danger text-danger-foreground",
    text: "text-danger",
    border: "border-danger",
    hover: "hover:text-danger hover:bg-danger/10",
  },
};
