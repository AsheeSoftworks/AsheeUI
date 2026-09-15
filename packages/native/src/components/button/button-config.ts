/**
 * Button component configuration for the native package.
 *
 * The options are the ones the framework's button contract names, with native
 * defaults: a button is dense enough for a pointer on the web and large enough for a
 * thumb here, which is why the default size is `lg` rather than the web's `md`.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Button.
 */
export interface NativeButtonConfig {
  /** Visual treatment. Defaults to the platform's `defaultVariant`. */
  variant?: Variant;

  /** Colour role. Defaults to the platform's `defaultColor`. */
  color?: ColorRole;

  /** Density, which decides height, padding and text size. Defaults to `"lg"`. */
  size?: Size;

  /** Corner rounding. Defaults to the platform's `defaultRadius`. */
  radius?: Radius;

  /** Whether the button stretches to its container's width. Defaults to false. */
  fullWidth?: boolean;
}

/**
 * The defaults the Button registers with the native registry.
 *
 * `variant`, `color` and `radius` are deliberately absent so they inherit from the
 * platform's configuration rather than pinning a value.
 */
export const defaultNativeButtonConfig: NativeButtonConfig = {
  size: "lg",
  fullWidth: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    button: NativeButtonConfig;
  }
}

registerNativeComponentDefaults("button", defaultNativeButtonConfig);

/**
 * The values the button falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_BUTTON_CONFIG: Required<NativeButtonConfig> = {
  variant: "solid",
  color: "primary",
  size: "lg",
  radius: "md",
  fullWidth: false,
};
