/**
 * The native chip's class maps that cannot be read from `@asheeui/core`.
 *
 * Every other `NATIVE_CHIP_*` map lives in the core chip style module beside the web
 * chip's, because those are shared decisions that only differ in spelling. The avatar
 * slot is one decision the two platforms state in two vocabularies, so the native map
 * lives here with its own name rather than being read out of the web section.
 *
 * The web constant `CHIP_AVATAR_SIZE_CLASS` gives the same 16/20/24 diameter as
 * `size-4`, `size-5` and `size-6`. The native renderer states a square box as a width
 * and a height everywhere — `NATIVE_AVATAR_SIZE_CLASS` and
 * `NATIVE_CHIP_ICON_SIZE_CLASS` both do — so a web `size-*` class is not the spelling
 * the rest of the native class maps use. The two maps therefore land on the same
 * diameters in each platform's own vocabulary, which is the same reason the icon maps
 * are stated twice.
 */

import type { Size } from "@asheeui/core";

/**
 * The diameter of the box an avatar sits in, per density.
 *
 * An avatar is a picture of something rather than a glyph beside it, so it takes more of
 * the chip than an icon does: 16, 20 and 24 points, against the icon's 12, 14 and 16.
 * The numbers are the web's own ({@link CHIP_AVATAR_SIZE_CLASS}), and they are a map of
 * their own for the web's reason: reusing the icon map would draw a face at 12.
 */
export const NATIVE_CHIP_AVATAR_SIZE_CLASS: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};
