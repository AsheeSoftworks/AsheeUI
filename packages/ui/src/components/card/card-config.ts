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
   * @default "bordered"
   */
  variant?: CardVariant;

  /**
   * Content padding and spacing scale.
   * Controls the density of the card's internal spacing.
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
   * Placement of the card image.
   * Determines where the image appears relative to the content.
   *
   * @default "top"
   */
  imagePosition?: CardImagePosition;

  /**
   * Aspect ratio of the positioned image.
   * Controls the proportional dimensions of the image container.
   *
   * @default "video"
   */
  imageRatio?: ImageRatioKey;

  /**
   * Object-fit strategy of the positioned image.
   * Controls how the image fills its container.
   *
   * @default "cover"
   */
  imageFit?: ImageFit;

  /**
   * Native loading strategy of the positioned image.
   *
   * @default "lazy"
   */
  imageLoading?: CardImageLoading;

  /**
   * Enables the press animation when clickable.
   * When true, the card scales down slightly on click.
   *
   * @default true
   */
  animate?: boolean;
}

/**
 * Default config values registered for the Card component.
 *
 * `variant` and `radius` are intentionally absent so they inherit from
 * the global `defaultVariant` / `defaultRadius`.
 */
export const defaultCardConfig: CardConfig = {
  size: "md",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
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
 */
export const FALLBACK_CARD_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "md",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
  imageLoading: "lazy",
  animate: true,
} as const;
