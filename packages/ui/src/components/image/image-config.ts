/**
 * Image component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Image
 * component, including fit, ratio, radius, loading strategy, and skeleton
 * options. It registers the default configuration with the component
 * registry and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared";

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
  /**
   * Object-fit strategy.
   * Controls how the image fills its container.
   *
   * @default "cover"
   */
  fit?: ImageFit;

  /**
   * Container aspect ratio.
   * Controls the proportional dimensions of the image container.
   *
   * @default "auto"
   */
  ratio?: ImageRatioKey;

  /**
   * Corner rounding.
   * Controls the border-radius of the image container.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Native image loading strategy.
   * Controls when the browser loads the image resource.
   *
   * @default "lazy"
   */
  loading?: "lazy" | "eager";

  /**
   * Shows a shimmering placeholder until the image loads.
   * Displays a subtle loading animation while the image is loading.
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
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_IMAGE_CONFIG = {
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
