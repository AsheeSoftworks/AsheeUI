/**
 * Every class string the Badge renders, for the web renderer.
 *
 * The maps live here because the Badge's visual vocabulary is part of the design
 * language rather than part of a renderer: a treatment, a density or a radius is
 * the same decision on the web, and keeping the two renderers' strings side
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
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

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
 * The layout of the box an icon sits in.
 *
 * The badge gives its icon the same kind of slot the chip does rather than styling the
 * drawing from the root, so which node a consumer passes cannot change how it is laid
 * out.
 */
export const BADGE_SLOT_CLASS =
  "inline-flex items-center justify-center shrink-0";

/**
 * CSS classes for icon size based on size.
 * Applied to the icon slot so an icon matches the badge's scale. The slot is stated and
 * so is the SVG inside it: a consumer's icon is usually an SVG that carries a size of
 * its own, and a box around it only clips what it draws. Stating both is what makes the
 * same node render the same size in a badge and in a chip, whose icon slot states the
 * pair too — the web alone has this affordance, because a native icon is a component
 * with a size prop of its own.
 */
export const BADGE_ICON_SIZE_CLASS: Record<Size, string> = {
  sm: "size-3 [&_svg]:size-3",
  md: "size-3.5 [&_svg]:size-3.5",
  lg: "size-4 [&_svg]:size-4",
};

// ─── Native ───────────────────────────────────────────────────────────────────
