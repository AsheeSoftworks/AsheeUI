import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";

/**
 * Object-fit behaviour of the image inside its ratio box.
 *
 * - `cover`: Scales to fill, cropping overflow.
 * - `contain`: Scales to fit entirely inside.
 * - `fill`: Stretches to fill, ignoring aspect ratio.
 * - `none`: Natural size, no scaling.
 * - `scale-down`: Smallest of `none` and `contain`.
 */
export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

/**
 * Aspect ratio applied to the image container.
 *
 * - `auto`: Uses the image's intrinsic ratio.
 * - `square`: 1 / 1.
 * - `video`: 16 / 9.
 * - `portrait`: 4 / 5.
 */
export type ImageRatioKey = "auto" | "square" | "video" | "portrait";

/**
 * Theme configuration options for the Image component.
 *
 * Set under `components.image` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ImageConfig {
  /** Object-fit strategy.
   *
   * @default "cover"
   */
  fit?: ImageFit;
  /** Container aspect ratio.
   *
   * @default "auto"
   */
  ratio?: ImageRatioKey;
  /** Corner rounding.
   *
   * @default "md"
   */
  radius?: Radius;
  /** Native image loading strategy.
   *
   * @default "lazy"
   */
  loading?: "lazy" | "eager";
  /** Shows a shimmering placeholder until the image loads.
   *
   * @default true
   */
  showSkeleton?: boolean;
}

/**
 * Default config values registered for the Image component.
 */
export const defaultImageConfig: ImageConfig = {
  fit: "cover",
  ratio: "auto",
  radius: "md",
  loading: "lazy",
  showSkeleton: true,
};

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_IMAGE_CONFIG: Required<ImageConfig> = {
  fit: "cover",
  ratio: "auto",
  radius: "md",
  loading: "lazy",
  showSkeleton: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    image: ImageConfig;
  }
}

registerComponentDefaults("image", defaultImageConfig);
