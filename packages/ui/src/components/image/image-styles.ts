/**
 * Image component styles for AsheeUI.
 * This file provides CSS class mappings for the Image component's
 * fit and ratio options.
 */

import type { ImageFit, ImageRatioKey } from "./image-config";

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
