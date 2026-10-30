/**
 * The platform's class dictionaries for button.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/button/button-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { ColorRole, Size, Variant } from "@asheeui/core";

/**
 * Height, padding and text size for each density.
 *
 * The density scale is taller than the web scale on purpose: a control on a touch
 * screen has to be reachable, and the minimum target is a design-language constant
 * rather than a per-component decision. The minimum height is written as a literal
 * arbitrary value because NativeWind, like Tailwind, only compiles classes it can
 * read in the source.
 */
export const NATIVE_BUTTON_SIZE_CLASS: Record<Size, string> = {
  sm: "px-3 py-2 text-sm min-h-[44px]",
  md: "px-4 py-3 text-base min-h-[44px]",
  lg: "px-6 py-4 text-lg min-h-[52px]",
};

/**
 * The solid treatment, per colour role.
 */
const NATIVE_SOLID_CLASS: Record<ColorRole, string> = {
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
const NATIVE_FADED_CLASS: Record<ColorRole, string> = {
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
const NATIVE_BORDERED_CLASS: Record<ColorRole, string> = {
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
const NATIVE_GHOST_CLASS: Record<ColorRole, string> = {
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
const NATIVE_UNDERLINED_CLASS: Record<ColorRole, string> = {
  none: "border-b border-foreground bg-transparent active:opacity-70",
  primary: "border-b border-primary bg-transparent active:opacity-70",
  secondary: "border-b border-secondary bg-transparent active:opacity-70",
  danger: "border-b border-danger bg-transparent active:opacity-70",
  warning: "border-b border-warning bg-transparent active:opacity-70",
  success: "border-b border-success bg-transparent active:opacity-70",
};

/**
 * Every treatment and colour role combination the native button can render.
 */
export const NATIVE_BUTTON_VARIANT_CLASS: Record<
  Variant,
  Record<ColorRole, string>
> = {
  solid: NATIVE_SOLID_CLASS,
  faded: NATIVE_FADED_CLASS,
  bordered: NATIVE_BORDERED_CLASS,
  ghost: NATIVE_GHOST_CLASS,
  underlined: NATIVE_UNDERLINED_CLASS,
};

/**
 * Text colour for each treatment, which the filled treatments do not need because
 * their background carries the emphasis.
 */
export const NATIVE_BUTTON_TEXT_CLASS: Record<
  Variant,
  Record<ColorRole, string>
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
  underlined: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
};

/** Shared classes for every native button. */
export const NATIVE_BUTTON_BASE_CLASS =
  "flex-row items-center justify-center gap-2 font-medium";

/** The native disabled treatment, which dims without hiding what the control says. */
export const NATIVE_BUTTON_DISABLED_CLASS = "opacity-50";

/** The native full-width treatment, which both platforms express the same way. */
export const NATIVE_BUTTON_FULL_WIDTH_CLASS = "w-full";
