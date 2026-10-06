/**
 * The Marquee's configuration face, shared by both platforms.
 *
 * A marquee is content that moves in a loop. Which axis it moves along, which way, how
 * fast, how far apart its items sit, whether it stops when a pointer rests on it, whether
 * its edges fade and whether it moves at all are the same questions on both platforms, so
 * they are named here, once, and `components.marquee` means the same thing in a web
 * application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `marquee` here is what makes `components.marquee` a known
 * configuration section, on every platform, without each renderer restating it.
 */

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
   * Can be a preset value ("slow", "normal" or "fast") or a number
   * representing the duration in seconds for a full cycle.
   *
   * @default "normal"
   */
  speed?: MarqueeSpeedPreset | number;

  /**
   * The gap between marquee items, stated as a CSS length.
   *
   * The web passes it to its stylesheet as written. The platform has no stylesheet, so it
   * reads the same value as a length in the framework's own units and converts it: a
   * `rem` is the framework's 16 units, and a `px` is one unit of density-independent
   * pixels. Any other unit is one the platform cannot state, so the gap falls back to the
   * framework's own.
   *
   * @default "1.5rem"
   */
  gap?: string;

  /**
   * Whether the marquee pauses on hover.
   * When true, the animation stops when hovering over the marquee.
   * The platform has no pointer, so it has nothing to pause on; see
   * `NATIVE_MARQUEE_PAUSE_ON_HOVER_CLASS`.
   *
   * @default false
   */
  pauseOnHover?: boolean;

  /**
   * Whether the marquee has fading edges.
   * When true, the edges of the marquee fade to transparent.
   * A fade is a gradient, which the platform paints only through a drawing library it does
   * not depend on; see `NATIVE_MARQUEE_FADE_CLASS`.
   *
   * @default false
   */
  fadeEdges?: boolean;

  /**
   * Whether the content moves.
   *
   * A loop is motion, so a screen states whether it may happen: the web also yields to the
   * reader's reduced-motion preference, and the platform to the platform's own motion
   * setting. With `isAnimated` false the content stands still on both platforms and is
   * read in place, which is what a screen that must not move asks for.
   *
   * @default true
   */
  isAnimated?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    marquee: MarqueeConfig;
  }
}
