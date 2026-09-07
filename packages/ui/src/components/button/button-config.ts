/**
 * Button component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Button
 * component, including variant, color, size, radius, and behavior options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Theme configuration options for the Button component.
 *
 * Set under `components.button` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ButtonConfig {
  /**
   * Visual style variant.
   * Controls the background, border, and hover treatment.
   *
   * @default "bordered"
   */
  variant?: Variant;

  /**
   * Theme accent color.
   * Controls the color of the button's primary visual elements.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Padding and font-size scale.
   * Controls the density and text size of the button.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * Controls the border-radius of the button.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Enables the press-down scale animation.
   * When true, the button scales down slightly on click.
   *
   * @default true
   */
  animate?: boolean;

  /**
   * Makes the button stretch to fill its parent width.
   * When true, the button expands to 100% of its container width.
   *
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Default config values registered for the Button component.
 *
 * `variant`, `color`, and `radius` are intentionally absent so they
 * inherit from the global `defaultVariant` / `defaultColor` /
 * `defaultRadius`.
 */
export const defaultButtonConfig: ButtonConfig = {
  size: "md",
  animate: true,
  fullWidth: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    button: ButtonConfig;
  }
}

registerComponentDefaults("button", defaultButtonConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_BUTTON_CONFIG: Required<ButtonConfig> = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "md",
  animate: true,
  fullWidth: false,
} as const;
