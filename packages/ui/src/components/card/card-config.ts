import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
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

/** Placement of the card image relative to the content. */
export type CardImagePosition = "top" | "bottom" | "background";

/** Native image loading strategy. */
export type CardImageLoading = "lazy" | "eager";

/**
 * Theme configuration options for the Card component.
 *
 * Set under `components.card` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface CardConfig {
  /** Visual style variant.
   *
   * @default "bordered"
   */
  variant?: CardVariant;
  /** Content padding and spacing scale.
   *
   * @default "md"
   */
  size?: Size;
  /** Corner rounding.
   *
   * @default "md"
   */
  radius?: Radius;
  /** Placement of the card image.
   *
   * @default "top"
   */
  imagePosition?: CardImagePosition;
  /** Aspect ratio of the positioned image.
   *
   * @default "video"
   */
  imageRatio?: ImageRatioKey;
  /** Object-fit strategy of the positioned image.
   *
   * @default "cover"
   */
  imageFit?: ImageFit;
  /** Native loading strategy of the positioned image.
   *
   * @default "lazy"
   */
  imageLoading?: CardImageLoading;
  /** Enables interactive hover and keyboard behaviour.
   *
   * @default false
   */
  isClickable?: boolean;
  /** Enables the press animation when clickable.
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
  isClickable: false,
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
 */
export const FALLBACK_CARD_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "md",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
  imageLoading: "lazy",
  isClickable: false,
  animate: true,
} as const;
