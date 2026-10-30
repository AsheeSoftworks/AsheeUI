/**
 * Card component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Card
 * component, including variant, size, radius, image placement, and
 * behavior options. It registers the default configuration with the
 * component registry and provides fallback values for the cascade
 * resolution system.
 */

import type { Radius, Size } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";
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
  position?: CardImagePosition | undefined;

  /**
   * Aspect ratio of the positioned image.
   * Controls the proportional dimensions of the image container.
   * Common values: "video" (16:9), "square" (1:1), "portrait" (3:4).
   *
   * @default "video"
   */
  ratio?: ImageRatioKey | undefined;

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
  fit?: ImageFit | undefined;

  /**
   * Native loading strategy of the positioned image.
   * `lazy` defers loading until the image is near the viewport.
   * `eager` loads the image immediately.
   *
   * @default "lazy"
   */
  loading?: CardImageLoading | undefined;
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
   * The card's own four treatments are always expressible. The framework's
   * `defaultVariant` names a control's treatment instead, so a value the card
   * cannot draw resolves to the nearest card surface it can — see
   * {@link resolveCardVariant}.
   *
   * @default "bordered"
   */
  variant?: CardVariant | undefined;

  /**
   * Content padding and spacing scale.
   * Controls the density of the card's internal spacing.
   * Larger values provide more padding and gap between elements.
   *
   * @default "md"
   */
  size?: Size | undefined;

  /**
   * Corner rounding.
   * Controls the border-radius of the card.
   *
   * @default "md"
   */
  radius?: Radius | undefined;

  /**
   * Enables the press animation when clickable.
   * When true, the card scales down slightly on click for tactile feedback.
   *
   * @default true
   */
  animate?: boolean | undefined;

  /**
   * Image configuration for the card.
   * Controls the placement, aspect ratio, fit, and loading behavior
   * of the card's image.
   *
   * Optional because a configuration is a partial override: a consumer states
   * `components.card.size` and nothing else, and the image options then resolve
   * from the registered defaults. A consumer that writes the object as JSON can
   * also set `image: null` to state "no image options at all", so a renderer
   * must read this tier defensively rather than assume the object is present.
   */
  image?: CardImageConfig | undefined;
}

/**
 * The shared rule that lands a treatment on a surface a card can draw.
 *
 * It lives in `@asheeui/core` because both renderers need it and because the platform's
 * card draws the shared vocabulary directly: the rule speaks the shared treatments and
 * maps the web card's own two surface names (`elevated`, `flat`) onto the filled one, so a
 * configuration written for the web lands somewhere sensible on a device. This package
 * re-exports it under the same name, and projects the result onto its own four surfaces in
 * `card-surface.ts`.
 */
export { resolveCardVariant } from "@asheeui/core";

/**
 * Default config values registered for the Card component.
 *
 * `variant` and `radius` are intentionally absent so they inherit from
 * the global `defaultVariant` / `defaultRadius`. The inherited treatment names the
 * shared vocabulary rather than a card surface, so {@link resolveCardVariant} lands
 * it on one the card can draw: the shipped `faded` resolves to the card's documented
 * border default, while an application that sets `defaultVariant: "solid"` or
 * `"ghost"` reaches the matching card surface instead of silently rendering
 * `bordered`.
 */
export const defaultCardConfig: CardConfig = {
  size: "md",
  image: { position: "top", ratio: "video", fit: "cover" },
  animate: true,
};

declare module "@asheeui/core" {
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
