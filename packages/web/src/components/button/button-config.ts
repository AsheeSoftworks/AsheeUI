/**
 * Button component configuration for AsheeUI.
 * This file provides the web renderer's own side of the Button's configuration: the
 * values it defaults to, and the registration that puts them in the component registry
 * when the component is imported. The option names and their meaning are shared with
 * the native renderer, so the type itself lives in `@asheeui/core` and is re-exported
 * here, which keeps the package's public surface unchanged.
 */

import { type ButtonConfig, registerComponentDefaults } from "@asheeui/core";

export type { ButtonConfig };

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
