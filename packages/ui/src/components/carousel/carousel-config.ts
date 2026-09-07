/**
 * Carousel component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Carousel
 * component, including variant, size, radius, autoplay, and behavior options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius, Size } from "../../shared";

/**
 * Visual style of the carousel.
 * - `bordered`: Card with border and background.
 * - `ghost`: Transparent background without border.
 */
export type CarouselVariant = "bordered" | "ghost";

/**
 * A single carousel slide item.
 */
export interface CarouselItem {
  /**
   * Optional unique identifier for the slide.
   * Used for React keys and accessibility.
   */
  id?: string;

  /**
   * The content to display in the slide.
   * Can be any React node.
   */
  content: ReactNode;
}

/**
 * Theme configuration options for the Carousel component.
 *
 * Set under `components.carousel` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface CarouselConfig {
  /**
   * Visual style variant.
   * Controls the carousel's background and border treatment.
   *
   * @default "bordered"
   */
  variant?: CarouselVariant;

  /**
   * Height scale of the carousel.
   * Controls the fixed height of the carousel container.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * Controls the border-radius of the carousel.
   *
   * @default "lg"
   */
  radius?: Radius;

  /**
   * Whether the carousel should autoplay.
   * When true, slides advance automatically.
   *
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Interval in milliseconds between autoplay transitions.
   *
   * @default 5000
   */
  autoPlayInterval?: number;

  /**
   * Whether the carousel should loop.
   * When true, wraps from last to first slide and vice versa.
   *
   * @default true
   */
  loop?: boolean;

  /**
   * Whether to show navigation controls.
   *
   * @default true
   */
  showControls?: boolean;

  /**
   * Whether to show indicator dots.
   *
   * @default true
   */
  showIndicators?: boolean;

  /**
   * Whether autoplay should pause when hovering.
   *
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Disables all slide transition animations.
   * When true, slides snap instantly.
   *
   * @default false
   */
  disableAnimation?: boolean;
}

/**
 * Default config values registered for the Carousel component.
 *
 * `variant` and `radius` are intentionally absent so they inherit from
 * the global `defaultVariant` / `defaultRadius`.
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

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    carousel: CarouselConfig;
  }
}

registerComponentDefaults("carousel", defaultCarouselConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
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
