/**
 * The Radio's class dictionaries, for the web renderer.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones, side
 * by side, because a radio's proportions are part of the design language: how large the
 * circle is next to its label, how far the label sits from it and what a checked circle
 * is filled with are the same decisions on the web. The native scale steps the
 * text up one step, because a native label is read at arm's length rather than at a
 * pointer's distance, and it sizes the circle for a thumb rather than for a click.
 *
 * The strings cannot be unified, and the prefix says which is which: an unprefixed
 * `RADIO_*` constant is the web renderer's and a `NATIVE_RADIO_*` constant is the native
 * one.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Color } from "../../../shared/variant";
import type { FieldStatus } from "../field/field-config";
import type { RadioSizeKey } from "./radio-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

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

// ─── Native ───────────────────────────────────────────────────────────────────
