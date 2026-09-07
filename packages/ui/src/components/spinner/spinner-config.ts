/**
 * Spinner component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Spinner
 * component, including size, color, and animation speed options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Size } from "../../shared";

/**
 * Theme configuration options for the Spinner component.
 *
 * Set under `components.spinner` in the AsheeUI config. Values feed
 * the component-level fallback tier of the theme cascade.
 */
export interface SpinnerConfig {
  /**
   * Pixel-size scale.
   * Controls the dimensions of the spinner.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Theme accent color.
   * Controls the color of the spinner.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * CSS `animation-duration` for one rotation.
   * Controls how fast the spinner rotates.
   *
   * @default "0.75s"
   */
  speed?: string;

  /**
   * Extra classes applied to every spinner instance.
   *
   * @default ""
   */
  className?: string;
}

/**
 * Default config values registered for the Spinner component.
 *
 * `color` is intentionally absent so it inherits from the global
 * `defaultColor`.
 */
export const defaultSpinnerConfig: SpinnerConfig = {
  size: "md",
  speed: "0.75s",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SPINNER_CONFIG: Required<SpinnerConfig> = {
  size: "md",
  color: "primary",
  speed: "0.75s",
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    spinner: SpinnerConfig;
  }
}

registerComponentDefaults("spinner", defaultSpinnerConfig);
