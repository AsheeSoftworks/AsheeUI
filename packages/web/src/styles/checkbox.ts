/**
 * The web renderer's class dictionaries for checkbox.
 *
 * A checkbox is the field family's set member: it occupies the same row, carries
 * the same label and description beside its mark, and takes its density, accent
 * and validation edge from the same tokens. What differs is the mark itself — a
 * square a reader ticks rather than a circle a set chooses — so the size, gap and
 * accent maps state a checkbox's proportions while the family's field classes
 * state the text.
 */

import type { CheckboxSizeKey, Color, FieldStatus } from "@asheeui/core";

/**
 * CSS classes for the checkbox square.
 * Controls the side of the box the check sits in.
 */
export const CHECKBOX_OUTER_SIZE_CLASS: Record<CheckboxSizeKey, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

/**
 * CSS classes for the check glyph.
 * Kept inside the box so the mark never grows past its edge.
 */
export const CHECKBOX_ICON_SIZE_CLASS: Record<CheckboxSizeKey, string> = {
  sm: "size-2.5",
  md: "size-3",
  lg: "size-3.5",
};

/**
 * CSS classes for the checkbox label font size.
 * Controls the text size of the label and description.
 */
export const CHECKBOX_FONT_SIZE_CLASS: Record<CheckboxSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for the gap between the box and its label.
 */
export const CHECKBOX_GAP_CLASS: Record<CheckboxSizeKey, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

/**
 * CSS classes for the accent a checked checkbox takes.
 *
 * `check` is the ink of the glyph over the fill: a saturated fill takes the
 * framework's on-solid token, a muted fill takes the foreground, and the
 * `none` role fills with the foreground and therefore draws the mark in the
 * surface colour.
 */
export const CHECKBOX_COLOR_CLASS: Record<
  Color,
  { border: string; bg: string; check: string }
> = {
  none: {
    border: "border-foreground",
    bg: "bg-foreground",
    check: "text-background",
  },
  primary: {
    border: "border-primary",
    bg: "bg-primary",
    check: "text-on-solid",
  },
  secondary: {
    border: "border-secondary",
    bg: "bg-secondary",
    check: "text-foreground",
  },
  danger: {
    border: "border-danger",
    bg: "bg-danger",
    check: "text-on-solid",
  },
  warning: {
    border: "border-warning",
    bg: "bg-warning",
    check: "text-on-solid",
  },
  success: {
    border: "border-success",
    bg: "bg-success",
    check: "text-on-solid",
  },
};

/**
 * CSS classes for the validation edge of an unchecked checkbox.
 * A status never changes the width of the edge, only which colour it takes.
 */
export const CHECKBOX_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};

/**
 * The treatment of an unavailable checkbox.
 * Pointer events are removed so the label's click target cannot toggle it either.
 */
export const CHECKBOX_DISABLED_CLASS =
  "opacity-50 pointer-events-none cursor-not-allowed";

/**
 * How a group of checkboxes is arranged.
 *
 * A column is the default because a set of options is read top to bottom, and a
 * row wraps because a set of short labels would otherwise run off a narrow screen.
 */
export const CHECKBOX_GROUP_CLASS: Record<"horizontal" | "vertical", string> = {
  horizontal: "flex flex-row flex-wrap gap-4",
  vertical: "flex flex-col gap-2",
};
