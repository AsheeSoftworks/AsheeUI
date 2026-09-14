/**
 * Avatar component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Avatar
 * component and registers them with the component registry, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size } from "../../shared";

/**
 * Theme configuration options for the Avatar component.
 *
 * Set under `components.avatar` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface AvatarConfig {
  /**
   * Diameter scale of the avatar.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * The default makes a circular avatar; a smaller radius makes it square.
   *
   * @default "full"
   */
  radius?: Radius;

  /**
   * Theme accent colour.
   * Colours the surface the initials fall back to. It does not tint the image.
   *
   * @default "primary"
   */
  color?: Color;
}

/**
 * Default config values registered for the Avatar component.
 *
 * `color` is intentionally absent so it inherits from the global
 * `defaultColor`.
 */
export const defaultAvatarConfig: AvatarConfig = {
  size: "md",
  radius: "full",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_AVATAR_CONFIG: Required<AvatarConfig> = {
  size: "md",
  radius: "full",
  color: "primary",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    avatar: AvatarConfig;
  }
}

registerComponentDefaults("avatar", defaultAvatarConfig);
