/**
 * Every class string the Avatar renders, for the web renderer.
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
 * The fallback surface is one decision on the web: an avatar shows an entity, so
 * its fallback is a filled accent surface rather than an outline or a tint, and the text
 * on it is the framework's foreground in every colour — the same treatment the shared
 * variant map draws on the web for a `solid` accent.
 *
 * Every entry is a complete, static class string, because both Tailwind and NativeWind
 * compile the classes they can read in the source.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Variant } from "../../../shared/variant";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The variant the initials fall back to.
 * An avatar shows an entity, so its fallback is a filled accent surface rather
 * than an outline or a tint.
 */
export const AVATAR_FALLBACK_VARIANT: Variant = "solid";

// ─── Native ───────────────────────────────────────────────────────────────────
