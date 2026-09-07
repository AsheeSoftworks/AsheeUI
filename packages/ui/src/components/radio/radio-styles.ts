/**
 * Radio component styles for AsheeUI.
 * This file provides CSS class mappings for the Radio component's
 * size, color, gap, and status options.
 */

import type { Color } from "../../shared";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";

/**
 * CSS classes for radio outer circle size.
 * Controls the diameter of the radio button.
 */
export const RADIO_OUTER_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

/**
 * CSS classes for radio inner dot size.
 * Controls the diameter of the selected indicator.
 */
export const RADIO_INNER_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
};

/**
 * CSS classes for radio label font size.
 * Controls the text size of the label and description.
 */
export const RADIO_FONT_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for radio gap based on size.
 * Controls the spacing between the radio button and its label.
 */
export const RADIO_GAP_CLASS: Record<FieldSizeKey, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

/**
 * CSS classes for radio color variants.
 * Maps color keys to border, background, and card background classes.
 */
export const RADIO_COLOR_CLASS: Record<
  Color,
  { border: string; bg: string; cardBg: string }
> = {
  none: {
    border: "border-border",
    bg: "bg-foreground",
    cardBg: "bg-secondary/10",
  },
  primary: {
    border: "border-primary",
    bg: "bg-primary",
    cardBg: "bg-primary/10",
  },
  secondary: {
    border: "border-secondary",
    bg: "bg-secondary",
    cardBg: "bg-secondary/10",
  },
  danger: {
    border: "border-danger",
    bg: "bg-danger",
    cardBg: "bg-danger/10",
  },
  warning: {
    border: "border-warning",
    bg: "bg-warning",
    cardBg: "bg-warning/10",
  },
  success: {
    border: "border-success",
    bg: "bg-success",
    cardBg: "bg-success/10",
  },
};

/**
 * CSS classes for radio status border styles.
 */
export const RADIO_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};
