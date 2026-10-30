/**
 * Every class string the Chip renders, for the web renderer.
 *
 * The chip's surface — its treatment and its accent — is drawn from the shared variant map
 * on the web and stated per colour on the platform, because the platform's classes are what
 * its compiler reads. Its density is where the two platforms state the same decision in
 * their own vocabulary: the web fixes an explicit height and a padding, because a pointer
 * reads a small token precisely, and the platform states padding and one step of text,
 * because its own text metrics carry the density — the rule the badge already follows.
 *
 * Every entry is a complete, static class string, because both Tailwind and NativeWind
 * compile the classes they can read in the source. An unprefixed `CHIP_*` constant is the
 * web renderer's and a `NATIVE_CHIP_*` constant is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * CSS classes for the avatar slot's diameter based on size.
 *
 * An avatar is a picture of something rather than a glyph beside it, so it takes more
 * of the chip than an icon does: 16, 20 and 24 points inside chips that are 24, 28
 * and 32, which leaves the same four points of breathing room at every density. It is
 * a map of its own for that reason — reusing the icon's would draw a face at 12.
 */
export const CHIP_AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

/**
 * The web chip's pressable treatment, which the platform supplies itself.
 */
export const CHIP_PRESSABLE_CLASS =
  "cursor-pointer hover:opacity-90 active:scale-[0.98]";

// ─── Native ───────────────────────────────────────────────────────────────────
