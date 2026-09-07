/**
 * Chip component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Chip
 * component, including variant, color, size, and radius options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Visual style of the chip.
 *
 * The `underlined` button variant is excluded because it has no
 * chip-appropriate visual treatment.
 */
export type ChipVariant = Exclude<Variant, "underlined">;

/**
 * Height and font-size scale of the chip.
 * Maps to the standard Size type: "sm", "md", or "lg".
 */
export type ChipSizeKey = Size;

/**
 * Corner rounding scale of the chip.
 * Maps to the standard Radius type.
 */
export type ChipRadiusKey = Radius;

/**
 * Theme configuration options for the Chip component.
 *
 * Set under `components.chip` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ChipConfig {
  /**
   * Visual style variant.
   * Controls the chip's background, border, and hover treatment.
   *
   * @default "bordered"
   */
  variant?: ChipVariant;

  /**
   * Theme accent color.
   * Controls the color of the chip's primary visual elements.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Height and font-size scale.
   * Controls the density and text size of the chip.
   *
   * @default "md"
   */
  size?: ChipSizeKey;

  /**
   * Corner rounding.
   * Controls the border-radius of the chip.
   *
   * @default "full"
   */
  radius?: ChipRadiusKey;
}

/**
 * Default config values registered for the Chip component.
 *
 * `variant` and `color` are intentionally absent so they inherit from
 * the global `defaultVariant` / `defaultColor`.
 */
export const defaultChipConfig: ChipConfig = {
  size: "md",
  radius: "full",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_CHIP_CONFIG = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "full",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    chip: ChipConfig;
  }
}

registerComponentDefaults("chip", defaultChipConfig);
