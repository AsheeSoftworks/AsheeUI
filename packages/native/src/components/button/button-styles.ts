/**
 * Button styles for the native package.
 *
 * Every entry is a complete, static NativeWind class string. NativeWind compiles the
 * classes it can see, exactly as Tailwind does on the web, so a class assembled at
 * runtime produces no styling at all; the maps below are what keep that from
 * happening.
 *
 * The density scale is taller than the web scale on purpose: a control on a touch
 * screen has to be reachable, and the minimum target is a design-language constant
 * rather than a per-component decision.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";

/**
 * Height, padding and text size for each density.
 *
 * The minimum height is written as a literal arbitrary value (`min-h-[44px]` and
 * `min-h-[52px]`) because NativeWind, like Tailwind, only compiles classes it can
 * read in the source. The 44 minimises the design language's touch target, which
 * `@asheeui/shared` states and tests.
 */
export const BUTTON_SIZE_CLASS: Record<Size, string> = {
  sm: "px-3 py-2 text-sm min-h-[44px]",
  md: "px-4 py-3 text-base min-h-[44px]",
  lg: "px-6 py-4 text-lg min-h-[52px]",
};

/** Corner rounding for each radius token. */
export const BUTTON_RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/**
 * The solid treatment, per colour role.
 */
const SOLID_CLASS: Record<ColorRole, string> = {
  none: "bg-foreground active:opacity-80",
  primary: "bg-primary active:opacity-80",
  secondary: "bg-secondary active:opacity-80",
  danger: "bg-danger active:opacity-80",
  warning: "bg-warning active:opacity-80",
  success: "bg-success active:opacity-80",
};

/**
 * The faded treatment, per colour role.
 */
const FADED_CLASS: Record<ColorRole, string> = {
  none: "bg-foreground/10 active:bg-foreground/20",
  primary: "bg-primary/10 active:bg-primary/20",
  secondary: "bg-secondary/20 active:bg-secondary/30",
  danger: "bg-danger/10 active:bg-danger/20",
  warning: "bg-warning/10 active:bg-warning/20",
  success: "bg-success/10 active:bg-success/20",
};

/**
 * The bordered treatment, per colour role.
 */
const BORDERED_CLASS: Record<ColorRole, string> = {
  none: "border border-foreground bg-transparent active:bg-foreground/10",
  primary: "border border-primary bg-transparent active:bg-primary/10",
  secondary: "border border-secondary bg-transparent active:bg-secondary/10",
  danger: "border border-danger bg-transparent active:bg-danger/10",
  warning: "border border-warning bg-transparent active:bg-warning/10",
  success: "border border-success bg-transparent active:bg-success/10",
};

/**
 * The ghost treatment, per colour role.
 */
const GHOST_CLASS: Record<ColorRole, string> = {
  none: "bg-transparent active:bg-foreground/10",
  primary: "bg-transparent active:bg-primary/10",
  secondary: "bg-transparent active:bg-secondary/10",
  danger: "bg-transparent active:bg-danger/10",
  warning: "bg-transparent active:bg-warning/10",
  success: "bg-transparent active:bg-success/10",
};

/**
 * The underlined treatment, per colour role.
 */
const UNDERLINED_CLASS: Record<ColorRole, string> = {
  none: "border-b border-foreground bg-transparent active:opacity-70",
  primary: "border-b border-primary bg-transparent active:opacity-70",
  secondary: "border-b border-secondary bg-transparent active:opacity-70",
  danger: "border-b border-danger bg-transparent active:opacity-70",
  warning: "border-b border-warning bg-transparent active:opacity-70",
  success: "border-b border-success bg-transparent active:opacity-70",
};

/**
 * Every treatment and colour role combination the button can render.
 */
export const BUTTON_VARIANT_CLASS: Record<
  Variant,
  Record<ColorRole, string>
> = {
  solid: SOLID_CLASS,
  faded: FADED_CLASS,
  bordered: BORDERED_CLASS,
  ghost: GHOST_CLASS,
  underlined: UNDERLINED_CLASS,
};

/**
 * Text colour for each treatment, which the filled treatments do not need because
 * their background carries the emphasis.
 */
export const BUTTON_TEXT_CLASS: Record<Variant, Record<ColorRole, string>> = {
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

/** Shared classes for every button. */
export const BUTTON_BASE_CLASS =
  "flex-row items-center justify-center gap-2 font-medium";

/** The disabled treatment, which dims without hiding what the control says. */
export const BUTTON_DISABLED_CLASS = "opacity-50";

/** The full-width treatment. */
export const BUTTON_FULL_WIDTH_CLASS = "w-full";
