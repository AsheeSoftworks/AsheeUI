/**
 * Marquee component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Marquee
 * component, including axis, direction, speed, gap, and edge fading options.
 * It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";

/**
 * The axis of the marquee animation.
 * - `x`: Horizontal scrolling.
 * - `y`: Vertical scrolling.
 */
export type MarqueeAxis = "x" | "y";

/**
 * The direction of the marquee animation.
 * - `forward`: Scrolls from right to left (x) or bottom to top (y).
 * - `reverse`: Scrolls from left to right (x) or top to bottom (y).
 */
export type MarqueeDirection = "forward" | "reverse";

/**
 * Speed presets for the marquee.
 * - `slow`: 50 seconds for a full cycle.
 * - `normal`: 30 seconds for a full cycle.
 * - `fast`: 15 seconds for a full cycle.
 */
export type MarqueeSpeedPreset = "slow" | "normal" | "fast";

/**
 * Theme configuration options for the Marquee component.
 *
 * Set under `components.marquee` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface MarqueeConfig {
  /**
   * The axis of the marquee animation.
   * Controls whether the marquee scrolls horizontally or vertically.
   *
   * @default "x"
   */
  axis?: MarqueeAxis;

  /**
   * The direction of the marquee animation.
   * Controls the scroll direction.
   *
   * @default "forward"
   */
  direction?: MarqueeDirection;

  /**
   * The speed of the marquee animation.
   * Can be a preset value ("slow", "normal", "fast") or a number
   * representing the duration in seconds for a full cycle.
   *
   * @default "normal"
   */
  speed?: MarqueeSpeedPreset | number;

  /**
   * The gap between marquee items.
   * Accepts any valid CSS gap value.
   *
   * @default "1.5rem"
   */
  gap?: string;

  /**
   * Whether the marquee pauses on hover.
   * When true, the animation stops when hovering over the marquee.
   *
   * @default false
   */
  pauseOnHover?: boolean;

  /**
   * Whether the marquee has fading edges.
   * When true, the edges of the marquee fade to transparent.
   *
   * @default false
   */
  fadeEdges?: boolean;
}

/**
 * Default config values registered for the Marquee component.
 */
export const defaultMarqueeConfig: MarqueeConfig = {
  axis: "x",
  direction: "forward",
  speed: "normal",
  gap: "1.5rem",
  pauseOnHover: false,
  fadeEdges: false,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_MARQUEE_CONFIG = {
  axis: "x" as MarqueeAxis,
  direction: "forward" as MarqueeDirection,
  speed: "normal" as MarqueeSpeedPreset,
  gap: "1.5rem",
  pauseOnHover: true,
  fadeEdges: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    marquee: MarqueeConfig;
  }
}

registerComponentDefaults("marquee", defaultMarqueeConfig);
