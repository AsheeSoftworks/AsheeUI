/**
 * The platform's typography class dictionaries, and the one value that is not a class.
 *
 * The role *table* is core's (`TYPOGRAPHY_ROLE_TOKEN`): which size, weight, leading and
 * tracking a semantic role stands for is a design decision both renderers share, and B15
 * deleted the platform's private copy so the two cannot drift again. What is left here is
 * the platform's own: the utility each token becomes, and the font size a line-height
 * multiplier is applied to.
 *
 * The line-height is the one place the platform cannot compile a class. `leading-tight` is
 * a unitless multiplier on the web; React Native's `lineHeight` is a number of dp, so the
 * multiplier is resolved against the font size at render (impossibility report I4-3). The
 * size in dp is the platform's value (`LAW-2`), not the web's rem.
 */

import {
  TYPOGRAPHY_LEADING_MULTIPLIER,
  type TypographyAlign,
  type TypographyLeading,
  type TypographyRoleTokens,
  type TypographySize,
  type TypographyTone,
  type TypographyTracking,
  type TypographyWeight,
} from "@asheeui/core";
import { classNames } from "../../../utils/class-names";

/** Size token to the platform's font-size utility. */
export const NATIVE_TYPOGRAPHY_SIZE_CLASS: Record<TypographySize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

/**
 * The font size each token states in density-independent pixels.
 *
 * These follow Tailwind's scale, which is the scale both renderers name; the platform
 * needs the number itself because its `lineHeight` is not a multiplier.
 */
export const NATIVE_TYPOGRAPHY_SIZE_DP: Record<TypographySize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
};

/** Font-weight token to the platform's weight utility. */
export const NATIVE_TYPOGRAPHY_WEIGHT_CLASS: Record<
  TypographyWeight,
  string
> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

/** Letter-spacing token to the platform's utility. */
export const NATIVE_TYPOGRAPHY_TRACKING_CLASS: Record<
  TypographyTracking,
  string
> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

/** Tone token to the platform's colour utility. */
export const NATIVE_TYPOGRAPHY_TONE_CLASS: Record<TypographyTone, string> = {
  default: "text-foreground",
  muted: "text-foreground/60",
  disabled: "text-foreground/50",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
  none: "text-background",
};

/** Alignment token to the platform's alignment utility. */
export const NATIVE_TYPOGRAPHY_ALIGN_CLASS: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

/**
 * Compose a role's class string from the token maps.
 *
 * Every utility is a complete literal in one of the maps above, so NativeWind sees each
 * one; nothing is assembled from a fragment.
 *
 * @param tokens - The resolved size/style tokens.
 * @returns The class string for the role.
 */
export function composeNativeTypographyClass(
  tokens: TypographyRoleTokens,
): string {
  return classNames(
    NATIVE_TYPOGRAPHY_SIZE_CLASS[tokens.size],
    NATIVE_TYPOGRAPHY_WEIGHT_CLASS[tokens.weight],
    NATIVE_TYPOGRAPHY_TRACKING_CLASS[tokens.tracking],
  );
}

/**
 * The line height of a treatment, in density-independent pixels.
 *
 * @param tokens - The resolved size/style tokens.
 * @returns The font size multiplied by the leading token's multiplier, rounded to a point.
 */
export function nativeLineHeight(tokens: {
  size: TypographySize;
  leading: TypographyLeading;
}): number {
  return Math.round(
    NATIVE_TYPOGRAPHY_SIZE_DP[tokens.size] *
      TYPOGRAPHY_LEADING_MULTIPLIER[tokens.leading],
  );
}
