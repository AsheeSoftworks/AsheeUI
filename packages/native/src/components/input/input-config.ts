/**
 * Input configuration for the native package.
 *
 * The options are the ones the framework's input contract names, so a text field on
 * native and a text field on the web are configured the same way. The density scale is
 * decided by touch, which is why the default is taller here than on the web.
 *
 * The five axes the family offers are taken from the family's own configuration rather
 * than restated, so a member of the family that renames or retypes one cannot leave the
 * input behind. The three options that follow are native's own: the platform has one
 * control for one line and for several, where the web has a field and a textarea
 * beside it, and it names the unavailable and the mandatory state itself. The family
 * axes native does not implement — `labelAlign` and `fullWidth` — are absent
 * deliberately, because a configuration that advertised them would offer a consumer
 * options the platform ignores.
 */

import type { FieldConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Input.
 *
 * `size`, `radius`, `variant`, `color` and `status` carry the meanings the shared field
 * contract gives them.
 */
export interface NativeInputConfig
  extends Pick<
    FieldConfig,
    "size" | "radius" | "variant" | "color" | "status"
  > {
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
