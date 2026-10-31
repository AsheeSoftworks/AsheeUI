/**
 * The web renderer's class dictionaries for radio.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/radio/radio-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Color, FieldStatus, RadioSizeKey } from "@asheeui/core";

/**
 * CSS classes for radio outer circle size.
 * Controls the diameter of the radio button.
 */
export const RADIO_OUTER_SIZE_CLASS: Record<RadioSizeKey, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

/**
 * CSS classes for radio inner dot size.
 * Controls the diameter of the selected indicator.
 */
export const RADIO_INNER_SIZE_CLASS: Record<RadioSizeKey, string> = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
};

/**
 * CSS classes for radio label font size.
 * Controls the text size of the label and description.
 */
export const RADIO_FONT_SIZE_CLASS: Record<RadioSizeKey, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for radio gap based on size.
 * Controls the spacing between the radio button and its label.
 */
export const RADIO_GAP_CLASS: Record<RadioSizeKey, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

/**
 * CSS classes for radio colour variants.
 * Maps colour keys to border, background, and card background classes.
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
 * A status never changes the width of the edge, only which colour it takes.
 */
export const RADIO_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};
