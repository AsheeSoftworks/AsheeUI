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
 * Uses a light theme by default, with faded primary buttons, an extra-small
 * border radius, and no component-specific overrides.
 */
export const defaultConfig: Config = {
  /**
   * Default color configuration with built-in light and dark themes.
   */
  color: defaultColorConfig,

  /**
   * Default border radius for components.
   *
   * `xs` is deliberate: AsheeUI's visual language is boxy by design. A component
   * that leaves `radius` unregistered inherits this value, so a consumer can
   * restyle those components through this one key. A component that registers a
   * radius of its own — a pill badge, a circular avatar, a radio, a switch, or a
   * surface whose rounding the framework fixes (an alert, a toast) — keeps it,
   * and this key never reaches it; each such component says so in its config
   * module.
   * @default "xs"
   */
  defaultRadius: "xs",

  /**
   * Default theme setting following system preference.
   * @default "system"
   */
  defaultTheme: "system",

  /**
   * Default variant for components.
   *
   * Components whose design requires a different treatment (for example a
   * bordered card or an underlined tab) set their own value.
   * @default "faded"
   */
  defaultVariant: "faded",

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
