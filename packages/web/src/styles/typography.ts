/**
 * The web renderer's class dictionaries for typography.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/shared/typography.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type {
  TypographyAlign,
  TypographyLeading,
  TypographyRole,
  TypographySize,
  TypographyTone,
  TypographyTracking,
  TypographyWeight,
} from "@asheeui/core";

/**
 * Size token to static Tailwind class.
 * Note the deliberate difference between the token name (`md`) and the utility
 * (`text-base`): the token is the semantic name, as with `RADIUS_CLASS`.
 */
export const TYPOGRAPHY_SIZE_CLASS: Record<TypographySize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

/** Font-weight token to static Tailwind class. */
export const TYPOGRAPHY_WEIGHT_CLASS: Record<TypographyWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

/** Line-height token to static Tailwind class. */
export const TYPOGRAPHY_LEADING_CLASS: Record<TypographyLeading, string> = {
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

/** Letter-spacing token to static Tailwind class. */
export const TYPOGRAPHY_TRACKING_CLASS: Record<TypographyTracking, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

/** Tone token to static Tailwind class, using framework colour tokens only. */
export const TYPOGRAPHY_TONE_CLASS: Record<TypographyTone, string> = {
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

/** Alignment token to static Tailwind class. */
export const TYPOGRAPHY_ALIGN_CLASS: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

/**
 * The complete, static class string for each semantic role.
 *
 * These are written out in full rather than composed at render time: Tailwind
 * class names must always be static and complete. The entries are asserted
 * against {@link TYPOGRAPHY_ROLE_TOKEN} in the test suite, so the documented
 * token table and the shipped classes cannot drift.
 */
export const TYPOGRAPHY_ROLE_CLASS: Record<TypographyRole, string> = {
  display: "text-3xl font-semibold leading-tight tracking-tight",
  "page-title": "text-xl font-semibold leading-snug tracking-normal",
  "heading-xl": "text-2xl font-semibold leading-tight tracking-tight",
  "heading-lg": "text-xl font-semibold leading-snug tracking-normal",
  "heading-md": "text-lg font-semibold leading-snug tracking-normal",
  "heading-sm": "text-base font-semibold leading-snug tracking-normal",
  "body-lg": "text-lg font-normal leading-relaxed tracking-normal",
  "body-md": "text-base font-normal leading-normal tracking-normal",
  "body-sm": "text-sm font-normal leading-normal tracking-normal",
  label: "text-sm font-medium leading-normal tracking-normal",
  caption: "text-xs font-normal leading-normal tracking-normal",
  overline: "text-xs font-semibold leading-normal tracking-wider",
};
