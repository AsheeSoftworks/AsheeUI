/**
 * The web renderer's class dictionaries for image.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/image/image-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { ImageFit, ImageRatioKey } from "@asheeui/core";

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
