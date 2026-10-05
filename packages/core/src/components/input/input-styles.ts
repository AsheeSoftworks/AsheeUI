/**
 * The Input's class dictionaries.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones.
 * They differ in more than spelling, and deliberately: the web field fixes an
 * explicit height because its text is measured in `rem`, while a native field states
 * a *minimum* height because a control a thumb cannot reach is a defect rather than a
 * style choice, and it lets the platform's own text metrics size the rest.
 *
 * Corner rounding is not mapped here on either platform. A radius is the platform's
 * vocabulary rather than a component's, so a renderer that rounds reads the shared
 * radius map instead of restating the scale — which is what keeps a field, a button
 * and a badge in the same corner.
 *
 * The status edge is not mapped here either: an input is a field, so the edge its
 * validation decides is the family's `FIELD_STATUS_BORDER_CLASS`, stated once.
 */

import type { Size } from "../../shared/radius";
import type { Variant } from "../../shared/variant";
import type { ColorRole } from "../../tokens";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * Height, padding and text size for each density.
 * The web states a height rather than a minimum, since its scale is fixed by the
 * stylesheet rather than by the platform's font metrics.
 */
export const INPUT_SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

// ─── Native ───────────────────────────────────────────────────────────────────

/** Shared classes for every native field. */
export const NATIVE_INPUT_BASE_CLASS =
  "w-full flex-row items-center text-foreground";

/**
 * Height, padding and text size for each density.
 * The minimum height is the shared touch target, written as an arbitrary value
 * because NativeWind compiles only the classes it can read in the source.
 */
export const NATIVE_INPUT_SIZE_CLASS: Record<Size, string> = {
  sm: "min-h-[44px] px-3 py-2 text-sm",
  md: "min-h-[48px] px-4 py-3 text-base",
  lg: "min-h-[56px] px-5 py-4 text-lg",
};

/** The surface treatment of each variant. */
export const NATIVE_INPUT_VARIANT_CLASS: Record<Variant, string> = {
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
export const NATIVE_INPUT_EDGE_WIDTH_CLASS: Record<Variant, string> = {
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
export const NATIVE_INPUT_EDGE_NEUTRAL_CLASS: Record<Variant, string> = {
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
export const NATIVE_INPUT_EDGE_ACCENT_CLASS: Record<ColorRole, string> = {
  none: "border-foreground",
  primary: "border-primary",
  secondary: "border-secondary",
  danger: "border-danger",
  warning: "border-warning",
  success: "border-success",
};

/** The accent a field takes when it failed, whatever its colour role is. */
export const NATIVE_INPUT_EDGE_INVALID_CLASS = "border-danger";

/** The unavailable treatment, which dims without hiding what the field says. */
export const NATIVE_INPUT_DISABLED_CLASS = "opacity-50";

/** The treatment of a field that accepts several lines. */
export const NATIVE_INPUT_MULTILINE_CLASS = "min-h-[96px] text-start";
