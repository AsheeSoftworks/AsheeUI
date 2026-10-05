/**
 * Carousel configuration for the native package.
 *
 * The options are the ones the framework's carousel contract names, so
 * `components.carousel` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the renderer is
 * the value each option defaults to on the platform, and the registration that puts it in
 * the native registry.
 *
 * `variant` and `radius` are deliberately absent, as they are on the web, so they inherit
 * from the platform's configuration. A treatment the carousel has none for — the platform's
 * filled default, which is stated for a control — becomes the treatment it documents, which
 * is the same guard the accordion uses.
 */

import type { CarouselConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  CarouselConfig,
  CarouselItem,
  CarouselVariant,
} from "@asheeui/core";

/**
 * Configuration options for the native Carousel.
 */
export type NativeCarouselConfig = CarouselConfig;

/**
 * The defaults the Carousel registers with the native registry.
 */
export const defaultNativeCarouselConfig: NativeCarouselConfig = {
  size: "md",
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
  disableAnimation: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    carousel: NativeCarouselConfig;
  }
}

registerNativeComponentDefaults("carousel", defaultNativeCarouselConfig);

/**
 * The values the carousel falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_CAROUSEL_CONFIG = {
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
