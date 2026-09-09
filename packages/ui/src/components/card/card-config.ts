/**
 * Card component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Card
 * component, including variant, size, radius, image placement, and
 * behavior options. It registers the default configuration with the
 * component registry and provides fallback values for the cascade
 * resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Radius, Size } from "../../shared";
import type { ImageFit, ImageRatioKey } from "../image/image-config";

/**
 * Visual style of the card.
 *
 * - `elevated`: Box shadow elevation.
 * - `bordered`: Subtle outline border.
 * - `flat`: Solid neutral background.
 * - `ghost`: Transparent background without a border.
 */
export type CardVariant = "elevated" | "bordered" | "flat" | "ghost";

/**
 * Placement of the card image relative to the content.
 * "top" and "bottom" place the image above or below the content.
 * "background" places the image as a full-bleed background layer.
 */
export type CardImagePosition = "top" | "bottom" | "background";

/**
 * Native image loading strategy.
 * Controls when the browser loads the image resource.
 */
export type CardImageLoading = "lazy" | "eager";

/**
 * Configuration options for the card image.
 * Controls the placement, aspect ratio, fit, and loading behavior
 * of images displayed within the card.
 */
export interface CardImageConfig {
  /**
   * Placement of the card image.
   * Determines where the image appears relative to the content.
   *
   * @default "top"
   */
  position?: CardImagePosition;

  /**
   * Aspect ratio of the positioned image.
   * Controls the proportional dimensions of the image container.
   * Common values: "video" (16:9), "square" (1:1), "portrait" (3:4).
   *
   * @default "video"
   */
  ratio?: ImageRatioKey;

  /**
   * Object-fit strategy of the positioned image.
   * Controls how the image fills its container.
   *
   * - `cover`: Scales the image to cover the container, cropping if necessary.
   * - `contain`: Scales the image to fit within the container.
   * - `fill`: Stretches the image to fill the container.
   *
   * @default "cover"
   */
  fit?: ImageFit;

  /**
   * Native loading strategy of the positioned image.
   * `lazy` defers loading until the image is near the viewport.
   * `eager` loads the image immediately.
   *
   * @default "lazy"
   */
  loading?: CardImageLoading;
}

/**
 * Theme configuration options for the Card component.
 *
 * Set under `components.card` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface CardConfig {
  /**
   * Visual style variant.
   * Controls the card's background, border, and shadow treatment.
   *
   * - `elevated`: Card with box shadow elevation.
   * - `bordered`: Card with a subtle outline border.
   * - `flat`: Card with a solid neutral background.
   * - `ghost`: Transparent card background without a border.
   *
   * @default "bordered"
   */
  variant?: CardVariant;

  /**
   * Content padding and spacing scale.
   * Controls the density of the card's internal spacing.
   * Larger values provide more padding and gap between elements.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * Controls the border-radius of the card.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Enables the press animation when clickable.
   * When true, the card scales down slightly on click for tactile feedback.
   *
   * @default true
   */
  animate?: boolean;

  /**
   * Image configuration for the card.
   * Controls the placement, aspect ratio, fit, and loading behavior
   * of the card's image.
   */
  image: CardImageConfig;
}

/**
 * Default config values registered for the Card component.
 *
 * `variant` and `radius` are intentionally absent so they inherit from
 * the global `defaultVariant` / `defaultRadius`. This allows the card
 * to adapt to the global theme settings while providing sensible defaults
 * for other properties.
 */
export const defaultCardConfig: CardConfig = {
  size: "md",
  image: { position: "top", ratio: "video", fit: "cover" },
  animate: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    card: CardConfig;
  }
}

registerComponentDefaults("card", defaultCardConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 *
 * These provide the absolute minimum defaults to ensure the card
 * renders correctly even when no configuration is available.
 */
export const FALLBACK_CARD_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "md",
  image: {
    position: "top",
    ratio: "video",
    fit: "cover",
    loading: "lazy",
  },
  animate: true,
} as const;
