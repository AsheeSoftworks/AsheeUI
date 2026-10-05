/**
 * Carousel component configuration for AsheeUI.
 * This file registers the values the Carousel component defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`: they
 * are the framework's carousel contract rather than a web renderer's, and the native
 * renderer reads the same ones from the same place.
 */

import { type CarouselConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  CarouselConfig,
  CarouselItem,
  CarouselVariant,
} from "@asheeui/core";

/**
 * Default config values registered for the Carousel component.
 *
 * `variant` and `radius` are intentionally absent so they inherit from the global
 * `defaultVariant` / `defaultRadius`.
 */
export const defaultCarouselConfig: CarouselConfig = {
  size: "md",
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
  disableAnimation: false,
};

registerComponentDefaults("carousel", defaultCarouselConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CAROUSEL_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "lg",
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
  disableAnimation: false,
} as const;
