/**
 * Badge component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Badge
 * component, including variant, color, size, and radius options. It registers
 * the default configuration with the component registry and provides fallback
 * values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Visual style of the badge.
 *
 * The `underlined` button variant is excluded because a badge has no baseline
 * an underline could sit on.
 */
export type BadgeVariant = Exclude<Variant, "underlined">;

/**
 * Theme configuration options for the Badge component.
 *
 * Set under `components.badge` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface BadgeConfig {
  /**
   * Visual style variant.
   * Controls the badge's background, border, and text treatment.
   *
   * @default "faded"
   */
  variant?: BadgeVariant;

  /**
   * Theme accent color.
   * Controls the badge's colour within the variant treatment.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Height and font-size scale.
   * Controls the density and text size of the badge.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * Controls the border-radius of the badge.
   *
   * @default "full"
   */
  radius?: Radius;
}

/**
 * Default config values registered for the Badge component.
 *
 * `variant` and `color` are intentionally absent so they inherit from the
 * global `defaultVariant` and `defaultColor`.
 */
export const defaultBadgeConfig: BadgeConfig = {
  size: "md",
  radius: "full",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_BADGE_CONFIG: Required<BadgeConfig> = {
  variant: "faded",
  color: "primary",
  size: "md",
  radius: "full",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    badge: BadgeConfig;
  }
}

registerComponentDefaults("badge", defaultBadgeConfig);
