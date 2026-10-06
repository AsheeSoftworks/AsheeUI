/**
 * Every class string the Avatar renders, for both renderers.
 *
 * The two platforms state the same diameters, the same initials scale and the same
 * accent surface, and they state them side by side here so a change to the scale is one
 * edit rather than two that drift.
 *
 * The diameter is where the platforms spell the same idea differently. The web states it
 * as one `size-*` utility, which is the Tailwind v4 shorthand for a width and a height;
 * the platform states the pair as `h-* w-*`, because that is the form its compiler reads.
 * The values are the same three diameters on both sides: 32, 40 and 48 points.
 *
 * The fallback surface is one decision on both platforms: an avatar shows an entity, so
 * its fallback is a filled accent surface rather than an outline or a tint, and the text
 * on it is the framework's foreground in every colour — the same treatment the shared
 * variant map draws on the web for a `solid` accent.
 *
 * Every entry is a complete, static class string, because both Tailwind and NativeWind
 * compile the classes they can read in the source.
 */

import type { Size } from "../../shared/radius";
import type { Variant } from "../../shared/variant";
import type { ColorRole } from "../../tokens";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * CSS classes for the avatar's diameter based on size.
 */
export const AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

/**
 * CSS classes for the initials' font size based on size.
 */
export const AVATAR_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * Base classes for the avatar frame.
 * The frame clips the picture to the resolved radius and centres a fallback.
 */
export const AVATAR_BASE_CLASS =
  "relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none font-medium uppercase";

/**
 * The variant the initials fall back to.
 * An avatar shows an entity, so its fallback is a filled accent surface rather
 * than an outline or a tint.
 */
export const AVATAR_FALLBACK_VARIANT: Variant = "solid";

/**
 * The classes the initials block carries, on the web.
 */
export const AVATAR_FALLBACK_CLASS =
  "inline-flex items-center justify-center size-full";

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The layout every native avatar starts from.
 * The frame clips the picture to the resolved radius and centres the fallback, which is
 * the web frame's job in the platform's vocabulary.
 */
export const NATIVE_AVATAR_BASE_CLASS =
  "flex-row items-center justify-center shrink-0 overflow-hidden";

/**
 * The diameter for each size, as the pair of classes the platform's compiler reads.
 */
export const NATIVE_AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

/**
 * The initials' text size for each size, one step above the web's: a native label is
 * read at arm's length and has no page-zoom affordance beside it.
 */
export const NATIVE_AVATAR_FONT_CLASS: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

/**
 * The accent surface the initials fall back to, per colour role.
 */
export const NATIVE_AVATAR_FALLBACK_CLASS: Record<ColorRole, string> = {
  none: "bg-background",
  primary: "bg-primary",
  secondary: "bg-secondary",
  danger: "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
};

/**
 * The colour of the initials on that surface.
 * One value for every role, because a filled accent surface carries the framework's
 * foreground on both platforms.
 */
export const NATIVE_AVATAR_FALLBACK_TEXT_CLASS = "text-foreground";

/**
 * The classes the initials block carries, on the platform.
 * It fills the frame, so the initials are centred at every diameter.
 */
export const NATIVE_AVATAR_TEXT_BLOCK_CLASS =
  "h-full w-full items-center justify-center";

/**
 * The text treatment of the initials themselves, on the platform.
 * The web states this on the frame (`font-medium uppercase`); the platform states it on
 * the text, because its compiler reads a class on the element that carries it.
 */
export const NATIVE_AVATAR_INITIALS_CLASS = "font-medium text-center uppercase";
