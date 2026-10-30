/**
 * Every value the Image renders, for the web renderer.
 *
 * The two platforms express a picture differently, and the maps sit side by side here so
 * the difference is stated once rather than twice.
 *
 * The web styles a picture with CSS: the fit is an `object-*` class and the ratio is an
 * `aspect-*` class, both of which the browser lays out before the picture arrives. The
 * platform styles it through its own image view: the fit is the view's `resizeMode`
 * value, and the ratio is an `aspectRatio` number on the frame, because the platform
 * measures a remote source after it loads rather than before. That is why one map holds
 * classes and the other holds a platform value and a number — the vocabulary is shared,
 * the technology is not.
 *
 * Every class entry is a complete, static class string, because both Tailwind and
 * NativeWind compile the classes they can read in the source and a class assembled at
 * runtime produces no styling at all. As elsewhere in the framework, an unprefixed
 * `IMAGE_*` constant is the web renderer's and a `NATIVE_IMAGE_*` constant is the
 * native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { ImageFit, ImageRatioKey } from "./image-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * CSS classes for image object-fit.
 * Maps fit strategies to Tailwind object-fit utility classes.
 */
export const IMAGE_FIT_CLASS: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

/**
 * CSS classes for image aspect ratio.
 * Maps ratio keys to Tailwind aspect-ratio utility classes.
 * The "auto" ratio uses the image's intrinsic dimensions.
 */
export const IMAGE_RATIO_CLASS: Record<ImageRatioKey, string> = {
  auto: "",
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

// ─── Native ───────────────────────────────────────────────────────────────────
