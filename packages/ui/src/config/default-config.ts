/**
 * Default configuration for AsheeUI.
 * This file provides the default values that are used when no custom
 * configuration is provided. These defaults are merged with user-provided
 * ExternalConfig and component-registered defaults.
 */

import { defaultColorConfig } from "../theme";
import type { Config } from "./config";

/**
 * The default AsheeUI configuration.
 * Uses a light theme by default, with solid primary buttons,
 * medium border radius, and no component-specific overrides.
 */
export const defaultConfig: Config = {
  /**
   * Default color configuration with built-in light and dark themes.
   */
  color: defaultColorConfig,

  /**
   * Default border radius for components.
   * @default "md"
   */
  defaultRadius: "md",

  /**
   * Default theme setting following system preference.
   * @default "system"
   */
  defaultTheme: "system",

  /**
   * Default variant for components.
   * @default "solid"
   */
  defaultVariant: "solid",

  /**
   * Default color for components.
   * @default "primary"
   */
  defaultColor: "primary",

  /**
   * Component-specific overrides.
   * @default {}
   */
  components: {},
};
