/**
 * Every class string the Button renders, for the web renderer.
 *
 * The maps live here because the Button's visual vocabulary is part of the design
 * language rather than part of a renderer: a variant, a density or a radius is the
 * same decision on the web, and keeping the two renderers' strings side by
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
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

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
 *
 * `no-underline` is part of the layout rather than a treatment because a button is not prose: when `href` or
 * `link` makes it an anchor, a page that underlines its links (a documentation body, a consumer's own
 * `a { text-decoration: underline }`) would otherwise draw the rule through the label. The ink the label
 * carries is the variant's — a filled treatment brings its own, on the token that reads against the fill —
 * so the two decisions stay where they belong.
 */
export const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center no-underline font-medium transition-colors select-none shrink-0";

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
 * Corner rounding is not mapped here: a radius is the platform's vocabulary rather
 * than the component's, so the native button reads `NATIVE_RADIUS_CLASS` from
 * `../../shared/radius` like every other native surface that rounds.
 */
