/**
 * Every class string the Button renders, for both renderers.
 *
 * The maps live here because the Button's visual vocabulary is part of the design
 * language rather than part of a renderer: a variant, a density or a radius is the
 * same decision on both platforms, and keeping the two renderers' strings side by
 * side is what lets a change to the scale be one edit instead of two that drift.
 *
 * The strings themselves are not unified, and deliberately so: they cannot be.
 * Web expresses a size as a real height with responsive and hover states
 * (`h-9`, `sm:h-10`, `hover:`), native expresses it as a minimum touch target
 * (`min-h-[44px]`, `active:`) because a control a thumb cannot reach is a defect
 * rather than a style choice. What is shared is the module, the key names and the
 * meaning of each key; what differs is the technology each platform compiles. The
 * prefix says which is which: an unprefixed `BUTTON_*` constant is the web
 * renderer's, a `NATIVE_BUTTON_*` constant is the native renderer's, matching the
 * way the rest of the framework names a platform's own value (`NativeButtonConfig`,
 * `NATIVE_FALLBACK_CONFIG`).
 *
 * Every entry is a complete, static class string. Tailwind on the web and NativeWind
 * on native both compile the classes they can read in the source, so a class
 * assembled at runtime produces no styling at all; the maps are what keep that from
 * happening.
 */

import type { Size } from "../../shared/radius";
import type { Variant } from "../../shared/variant";
import type { ColorRole } from "../../tokens";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * CSS classes for standard button sizes.
 * Maps size keys to Tailwind classes that control padding, height,
 * font size, and spacing between elements.
 */
export const BUTTON_SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-3.5 text-xs sm:h-10 sm:px-4 sm:text-sm gap-2",
  lg: "h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base gap-2.5",
};

/**
 * CSS classes for icon-only button sizes.
 * Maps size keys to Tailwind classes that create square buttons
 * with consistent dimensions for icons. The web alone has this affordance: a
 * native icon button is an ordinary button whose label happens to be an icon.
 */
export const BUTTON_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-8 p-0 text-xs gap-0",
  md: "size-9 sm:size-10 p-0 text-xs sm:text-sm gap-0",
  lg: "size-11 sm:size-12 p-0 text-sm sm:text-base gap-0",
};

/**
 * The layout every web button starts from, before any resolved treatment is added.
 */
export const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center font-medium transition-colors select-none shrink-0";

/**
 * The web's visible focus ring.
 * A pointer can see where it is; a keyboard cannot, so the ring is the control's
 * only indication that the next Enter will activate it.
 */
export const BUTTON_FOCUS_CLASS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/**
 * The web's disabled and busy treatment.
 *
 * Written as selectors (`disabled:`, `aria-disabled:`) so one string covers both a
 * natively disabled control and a link that reports `aria-disabled`; the map is
 * applied unconditionally and the selectors decide whether it takes effect.
 */
export const BUTTON_DISABLED_CLASS =
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

/**
 * The full-width treatment, which both platforms express the same way.
 */
export const BUTTON_FULL_WIDTH_CLASS = "w-full";

// ─── Native ───────────────────────────────────────────────────────────────────

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
 * Corner rounding is not mapped here: a radius is the platform's vocabulary rather
 * than the component's, so the native button reads `NATIVE_RADIUS_CLASS` from
 * `../../shared/radius` like every other native surface that rounds.
 */

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

/** Shared classes for every native button. */
export const NATIVE_BUTTON_BASE_CLASS =
  "flex-row items-center justify-center gap-2 font-medium";

/** The native disabled treatment, which dims without hiding what the control says. */
export const NATIVE_BUTTON_DISABLED_CLASS = "opacity-50";

/** The native full-width treatment, which both platforms express the same way. */
export const NATIVE_BUTTON_FULL_WIDTH_CLASS = "w-full";
