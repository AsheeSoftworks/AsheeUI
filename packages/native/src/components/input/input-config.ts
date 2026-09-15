/**
 * Input component configuration for the native package.
 *
 * The options are the ones the framework's input contract names, so a text field
 * on native and a text field on the web are configured the same way. The density
 * scale is decided by touch, which is why the default is taller here than on the
 * web.
 */

import type { ColorRole, Radius, Size, Variant } from "@asheeui/shared";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Input.
 */
export interface NativeInputConfig {
  /** Density, which decides height, padding and text size. Defaults to "md". */
  size?: Size;

  /** Corner rounding. Defaults to the platform's `defaultRadius`. */
  radius?: Radius;

  /** Surface treatment. Defaults to "bordered". */
  variant?: Variant;

  /** Accent colour of the field's focused border. Defaults to the platform's `defaultColor`. */
  color?: ColorRole;

  /** Validation status of the field. Defaults to "default". */
  status?: "default" | "error" | "warning" | "success";

  /** Whether the field accepts several lines. Defaults to false. */
  multiline?: boolean;

  /** Whether the field is unavailable. Defaults to false. */
  isDisabled?: boolean;

  /** Whether the field must be filled in before the form is submitted. Defaults to false. */
  required?: boolean;
}

/**
 * The defaults the Input registers with the native registry.
 * The density is `md`, which is the shared density whose height the native scale
 * makes touch-sized; `variant` and `color` stay unset so they inherit the
 * platform's configuration.
 */
export const defaultNativeInputConfig: NativeInputConfig = {
  size: "md",
  variant: "bordered",
  multiline: false,
  isDisabled: false,
  required: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    input: NativeInputConfig;
  }
}

registerNativeComponentDefaults("input", defaultNativeInputConfig);

/**
 * The values the field falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_INPUT_CONFIG: Required<NativeInputConfig> = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  multiline: false,
  isDisabled: false,
  required: false,
};
