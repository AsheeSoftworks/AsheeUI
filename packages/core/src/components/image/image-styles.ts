/**
 * Every value the Image renders, for both renderers.
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

/**
 * The platform's fit value for each object-fit strategy.
 *
 * Two of the five strategies are one value on the platform: the platform has no
 * `scale-down`, and a `contain` that never enlarges a small picture is what the web's
 * `scale-down` asks for, so it resolves to `contain` rather than to nothing. `none`
 * means "natural size, no scaling", which is the platform's `center`, and `fill` is its
 * `stretch`.
 */
export const NATIVE_IMAGE_RESIZE_MODE: Record<
  ImageFit,
  "cover" | "contain" | "stretch" | "center"
> = {
  cover: "cover",
  contain: "contain",
  fill: "stretch",
  none: "center",
  "scale-down": "contain",
};

/**
 * The aspect ratio a frame keeps, per ratio key, as the number the platform's layout
 * takes. `auto` states none, because the platform takes the ratio from the source.
 */
export const NATIVE_IMAGE_ASPECT_RATIO: Record<
  ImageRatioKey,
  number | undefined
> = {
  auto: undefined,
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
};

/**
 * The frame every native picture is drawn in.
 *
 * The frame fills the column it is given and clips the picture to the resolved radius,
 * which is the web frame's job stated in the platform's vocabulary. It is not given a
 * height: the ratio option or the consumer's own classes state that.
 */
export const NATIVE_IMAGE_FRAME_CLASS = "w-full overflow-hidden";

/**
 * The picture inside a frame whose ratio is stated or whose frame the consumer sized.
 * It fills the frame, because the frame is what decides the shape.
 */
export const NATIVE_IMAGE_PICTURE_FILL_CLASS = "h-full w-full";

/**
 * The picture inside a frame with no stated ratio.
 *
 * It claims the frame's width and no height, which is how the platform is asked to take
 * the height from the source's own proportions.
 */
export const NATIVE_IMAGE_PICTURE_CLASS = "w-full";

/**
 * The placeholder that stands in for the picture until it loads.
 * It covers the frame, so the space is claimed before the picture arrives.
 */
export const NATIVE_IMAGE_SKELETON_CLASS = "absolute inset-0";
