/**
 * The platform's class dictionaries for image.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/image/image-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { ImageFit, ImageRatioKey } from "@asheeui/core";

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
