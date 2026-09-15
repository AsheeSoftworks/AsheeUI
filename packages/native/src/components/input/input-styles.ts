/**
 * Input component styles for the native package.
 *
 * Every entry is a complete, static NativeWind class string. The height is given
 * as a minimum in density-independent pixels, because a field a thumb cannot
 * reach is a defect rather than a style choice, and the minimum is the shared
 * touch target.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";

/** Shared classes for every field. */
export const INPUT_BASE_CLASS = "w-full flex-row items-center text-foreground";

/**
 * Height, padding and text size for each density.
 * The minimum height is the shared touch target, written as an arbitrary value
 * because NativeWind compiles only the classes it can read in the source.
 */
export const INPUT_SIZE_CLASS: Record<Size, string> = {
  sm: "min-h-[44px] px-3 py-2 text-sm",
  md: "min-h-[48px] px-4 py-3 text-base",
  lg: "min-h-[56px] px-5 py-4 text-lg",
};

/** Corner rounding for each radius token. */
export const INPUT_RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/** The surface treatment of each variant. */
export const INPUT_VARIANT_CLASS: Record<Variant, string> = {
  solid: "bg-secondary",
  faded: "bg-secondary/40",
  bordered: "bg-background",
  ghost: "bg-transparent",
  underlined: "bg-background",
};

/**
 * The edge of each variant.
 * A width is never stated without a semantic colour beside it, so the platform's
 * own default border colour never shows: a field that is focused or invalid takes
 * the accent, and one that is not takes its neutral edge.
 */
export const INPUT_EDGE_WIDTH_CLASS: Record<Variant, string> = {
  solid: "border",
  faded: "border",
  bordered: "border",
  ghost: "border",
  underlined: "border-b",
};

/**
 * The edge a field shows while it is at rest.
 * Only the two treatments that draw an edge at all have one.
 */
export const INPUT_EDGE_NEUTRAL_CLASS: Record<Variant, string> = {
  solid: "",
  faded: "",
  bordered: "border-border",
  ghost: "",
  underlined: "border-border",
};

/**
 * The accent a field takes while it has focus.
 * A field always shows a visible focus edge, whatever its treatment is, because a
 * focus indicator is a requirement rather than a decoration.
 */
export const INPUT_EDGE_ACCENT_CLASS: Record<ColorRole, string> = {
  none: "border-foreground",
  primary: "border-primary",
  secondary: "border-secondary",
  danger: "border-danger",
  warning: "border-warning",
  success: "border-success",
};

/** The accent a field takes when it failed, whatever its colour role is. */
export const INPUT_EDGE_INVALID_CLASS = "border-danger";

/** The unavailable treatment, which dims without hiding what the field says. */
export const INPUT_DISABLED_CLASS = "opacity-50";

/** The treatment of a field that accepts several lines. */
export const INPUT_MULTILINE_CLASS = "min-h-[96px] text-start";
