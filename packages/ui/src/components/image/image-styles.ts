import type { ImageFit, ImageRatioKey } from "./image-config";

export const IMAGE_FIT_CLASS: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

export const IMAGE_RATIO_CLASS: Record<ImageRatioKey, string> = {
  auto: "",
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};
