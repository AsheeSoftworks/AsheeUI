/**
 * Every class string the Badge renders, for both renderers.
 *
 * The maps live here because the Badge's visual vocabulary is part of the design
 * language rather than part of a renderer: a treatment, a density or a radius is
 * the same decision on both platforms, and keeping the two renderers' strings side
 * by side is what lets a change to the scale be one edit instead of two that drift.
 *
 * The strings themselves are not unified, and deliberately so: they cannot be. Web
 * expresses a density as a real height with its own padding and type size (`h-5`,
 * `text-[10px]`) because a pointer can read a small label; native expresses it as
 * padding around text one step larger (`px-2.5 py-1`, `text-xs`) because a label a
 * thumb is next to has to survive being read at arm's length. What is shared is the
 * module, the key names and the meaning of each key; what differs is the technology
 * each platform compiles. The prefix says which is which: an unprefixed `BADGE_*`
 * constant is the web renderer's, a `NATIVE_BADGE_*` constant is the native
 * renderer's, matching the way the rest of the framework names a platform's own
 * value (`NATIVE_BUTTON_*`, `NATIVE_FALLBACK_CONFIG`).
 *
 * Every entry is a complete, static class string. Tailwind on the web and NativeWind
 * on native both compile the classes they can read in the source, so a class
 * assembled at runtime produces no styling at all; the maps are what keep that from
 * happening.
 *
 * Two of the badge's axes are shared rather than per-platform, because they resolve
 * to the same vocabulary on both sides: the treatment map a filled or outlined badge
 * draws from is `resolveVariantClass`, and the radius map is `RADIUS_CLASS`, which
 * the badge reads through the same resolution the Button does.
 */

import type { Size } from "../../shared/radius";
import type { ColorRole } from "../../tokens";
import type { BadgeVariant } from "./badge-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The layout every web badge starts from, before any resolved treatment is added.
 */
export const BADGE_BASE_CLASS =
  "inline-flex items-center justify-center shrink-0 whitespace-nowrap font-medium select-none";

/**
 * CSS classes for badge height based on size.
 * Controls the vertical dimension of the badge.
 */
export const BADGE_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-5",
  md: "h-6",
  lg: "h-7",
};

/**
 * CSS classes for badge horizontal padding based on size.
 * Controls the left and right padding of the badge.
 */
export const BADGE_PADDING_CLASS: Record<Size, string> = {
  sm: "px-1.5",
  md: "px-2",
  lg: "px-2.5",
};

/**
 * CSS classes for badge font size based on size.
 * Controls the text size of the badge content. The web can start below the scale's
 * first step because a pointer can zoom a page; a native label has no such
 * affordance, which is why `NATIVE_BADGE_FONT_CLASS` starts one step higher.
 */
export const BADGE_FONT_CLASS: Record<Size, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

/**
 * CSS classes for badge gap based on size.
 * Controls the spacing between an icon and the badge content.
 */
export const BADGE_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-1.5",
};

/**
 * CSS classes for icon size based on size.
 * Applied to the icon slot so an icon matches the badge's scale. The web alone has
 * this affordance: it can style the SVG a consumer passed in, where a native icon
 * is a component with a size prop of its own.
 */
export const BADGE_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "[&_svg]:size-3",
  md: "[&_svg]:size-3.5",
  lg: "[&_svg]:size-4",
};

// ─── Native ───────────────────────────────────────────────────────────────────

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
  Record<ColorRole, string>
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
