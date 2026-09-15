/**
 * Badge component styles for the native package.
 *
 * Every entry is a complete, static NativeWind class string. The treatment and the
 * colour are resolved together, because a badge's emphasis comes from the pair:
 * a filled badge carries its colour in the background and its text in the
 * opposite tone, a faded one carries it in both.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";

/** Shared classes for every badge. */
export const BADGE_BASE_CLASS =
  "flex-row items-center justify-center self-start px-2.5 py-1";

/** The background of each treatment and colour. */
export const BADGE_VARIANT_CLASS: Record<Variant, Record<ColorRole, string>> = {
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
  underlined: {
    none: "border-b border-foreground",
    primary: "border-b border-primary",
    secondary: "border-b border-secondary",
    danger: "border-b border-danger",
    warning: "border-b border-warning",
    success: "border-b border-success",
  },
};

/** The text colour of each treatment and colour. */
export const BADGE_TEXT_CLASS: Record<Variant, Record<ColorRole, string>> = {
  solid: {
    none: "text-background",
    primary: "text-background",
    secondary: "text-foreground",
    danger: "text-background",
    warning: "text-background",
    success: "text-background",
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
  underlined: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
};

/** Text size for each density. */
export const BADGE_SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/** Corner rounding for each radius token. */
export const BADGE_RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};
