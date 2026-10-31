/**
 * The platform's class dictionaries for badge.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/badge/badge-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { BadgeVariant, Color, Size } from "@asheeui/core";

/**
 * The layout every native badge starts from, before any resolved treatment is added.
 *
 * Padding sits here rather than in a per-density map because the platform's own text
 * metrics already carry the density: `NATIVE_BADGE_FONT_CLASS` is what grows, and a
 * fixed inset around it keeps the label's proportions while it does. The web has to
 * place padding per density because it also fixes an explicit height.
 */
export const NATIVE_BADGE_BASE_CLASS =
  "flex-row items-center justify-center self-start px-2.5 py-1";

/**
 * The background and border of each treatment and colour.
 *
 * The treatment and the colour are resolved together, because a badge's emphasis
 * comes from the pair: a filled badge carries its colour in the background and
 * `NATIVE_BADGE_TEXT_CLASS` carries it in the opposite tone, while an outlined one
 * carries it in both.
 */
export const NATIVE_BADGE_VARIANT_CLASS: Record<
  BadgeVariant,
  Record<Color, string>
> = {
  solid: {
    none: "bg-foreground",
    primary: "bg-primary",
    secondary: "bg-secondary",
    danger: "bg-danger",
    warning: "bg-warning",
    success: "bg-success",
  },
  faded: {
    none: "bg-foreground/10",
    primary: "bg-primary/10",
    secondary: "bg-secondary/20",
    danger: "bg-danger/10",
    warning: "bg-warning/10",
    success: "bg-success/10",
  },
  bordered: {
    none: "border border-foreground",
    primary: "border border-primary",
    secondary: "border border-secondary",
    danger: "border border-danger",
    warning: "border border-warning",
    success: "border border-success",
  },
  ghost: {
    none: "bg-transparent",
    primary: "bg-transparent",
    secondary: "bg-transparent",
    danger: "bg-transparent",
    warning: "bg-transparent",
    success: "bg-transparent",
  },
};

/**
 * The text colour of each treatment and colour.
 *
 * A filled treatment does not strictly need it — its background carries the
 * emphasis — but the entry is kept so every treatment is described completely
 * rather than by omission, which is what lets the pair be read as one decision.
 */
export const NATIVE_BADGE_TEXT_CLASS: Record<
  BadgeVariant,
  Record<Color, string>
> = {
  solid: {
    none: "text-background",
    primary: "text-on-solid",
    secondary: "text-foreground",
    danger: "text-on-solid",
    warning: "text-on-solid",
    success: "text-on-solid",
  },
  faded: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  bordered: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  ghost: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
};

/**
 * Text size for each density, one step above the web's because a native label is
 * read without the page-zoom affordance the web has.
 */
export const NATIVE_BADGE_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};
