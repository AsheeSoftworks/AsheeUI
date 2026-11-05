/**
 * The platform's class dictionaries for checkbox.
 *
 * A checkbox is the field family's set member, so the row, the text beside the
 * mark and the accent tokens are the ones every field uses. What is the
 * component's own is the square and the glyph inside it, which is what separates
 * a checkbox from a radio on a device as well as in a browser.
 */

import type { CheckboxSizeKey, Color, FieldStatus } from "@asheeui/core";

/** The row one checkbox occupies, which holds the square and the text beside it. */
export const NATIVE_CHECKBOX_ROW_CLASS = "flex-row items-start";

/**
 * The square, which is self-sized rather than stretched: a checkbox that filled
 * its row would read as a bar rather than as a box.
 */
export const NATIVE_CHECKBOX_OUTER_BASE_CLASS =
  "items-center justify-center self-start border-2";

/** Square size for each density. */
export const NATIVE_CHECKBOX_OUTER_SIZE_CLASS: Record<CheckboxSizeKey, string> =
  {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

/** Glyph size for each density, matched to the square it sits in. */
export const NATIVE_CHECKBOX_GLYPH_SIZE_CLASS: Record<CheckboxSizeKey, string> =
  {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

/** Label and description size for each density, one step above the web's. */
export const NATIVE_CHECKBOX_FONT_CLASS: Record<CheckboxSizeKey, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

/** Spacing between the square and its text, for each density. */
export const NATIVE_CHECKBOX_GAP_CLASS: Record<CheckboxSizeKey, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

/** The border, fill and glyph ink of each colour role. */
export const NATIVE_CHECKBOX_COLOR_CLASS: Record<
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

/** The edge an unchecked checkbox takes for each validation status. */
export const NATIVE_CHECKBOX_STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  {
    default: "border-border",
    error: "border-danger",
    warning: "border-warning",
    success: "border-success",
  };

/** The treatment of a checkbox that is unavailable. */
export const NATIVE_CHECKBOX_DISABLED_CLASS = "opacity-50";

/**
 * How a group of checkboxes is arranged.
 *
 * The column is the default because a set of options is read top to bottom, and
 * the row wraps because a set of short labels on a narrow screen would otherwise
 * run off it.
 */
export const NATIVE_CHECKBOX_GROUP_CLASS: Record<
  "horizontal" | "vertical",
  string
> = {
  horizontal: "flex-row flex-wrap gap-4",
  vertical: "flex-col gap-2",
};
