/**
 * Skeleton component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Skeleton
 * component and registers them with the component registry, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared";

/**
 * Theme configuration options for the Skeleton component.
 *
 * Set under `components.skeleton` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SkeletonConfig {
  /**
   * Corner rounding.
   * Controls the border-radius of the placeholder.
   *
   * @default "sm"
   */
  radius?: Radius;

  /**
   * Whether the placeholder shimmers while it is visible.
   * When true the animation is applied through a reduced-motion-safe class, so
   * a consumer who asked for less motion sees a static placeholder.
   *
   * @default true
   */
  isAnimated?: boolean;
}

/**
 * Default config values registered for the Skeleton component.
 */
export const defaultSkeletonConfig: SkeletonConfig = {
  radius: "sm",
  isAnimated: true,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SKELETON_CONFIG: Required<SkeletonConfig> = {
  radius: "sm",
  isAnimated: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    skeleton: SkeletonConfig;
  }
}

registerComponentDefaults("skeleton", defaultSkeletonConfig);
