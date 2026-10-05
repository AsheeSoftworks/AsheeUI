/**
 * The Skeleton's configuration face, shared by both platforms.
 *
 * A skeleton is the shape of content that has not arrived, and both platforms
 * answer the same two questions about it: how round its corners are, and whether it
 * breathes. The options are named here, once, so `components.skeleton` is
 * configured the same way on either platform.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `skeleton` here is what makes `components.skeleton` a
 * known configuration section without either renderer restating it.
 */

import type { Radius } from "../../shared/radius";

/**
 * Configuration options for the Skeleton.
 *
 * Set under `components.skeleton` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SkeletonConfig {
  /**
   * Corner rounding of the placeholder, so it echoes the shape of the content it
   * stands in for. A placeholder for a line of text wants `sm`; one for a card
   * wants `lg`.
   *
   * @default "sm"
   */
  radius?: Radius;

  /**
   * Whether the placeholder pulses while it waits.
   *
   * The web honours this inside `motion-safe`, so a visitor who has asked their
   * system for less motion gets a still placeholder; native animates the same
   * breath through the platform's own animator. A consumer who wants no motion at
   * all on either platform sets this to false.
   *
   * @default true
   */
  isAnimated?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    skeleton: SkeletonConfig;
  }
}
