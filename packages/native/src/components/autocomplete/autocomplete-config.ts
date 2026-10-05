/**
 * Autocomplete configuration for the native package.
 *
 * The options are the ones the framework's autocomplete names, so a field that suggests as
 * the reader types on native and on the web are configured the same way. The family's
 * visual axes are taken from the shared configuration, and what follows is native's own: the
 * platform names the unavailable state itself.
 *
 * The web's autocomplete also takes a `menu` option, which configures the floating list it
 * renders under the trigger. It is deliberately absent here, because the platform has no
 * floating layer: the suggestions are part of the field's own layout, so the reader can see
 * what they typed next to what it matches.
 */

import type { InputConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Autocomplete.
 *
 * `size`, `radius`, `variant`, `color` and `status` carry the meanings the shared field
 * family gives them.
 */
export interface NativeAutocompleteConfig
  extends Pick<
    InputConfig,
    "size" | "radius" | "variant" | "color" | "status"
  > {
  /** Whether the field is unavailable. Defaults to false. */
  isDisabled?: boolean;

  /** Whether the field must be answered before the form is submitted. Defaults to false. */
  required?: boolean;
}

/**
 * The defaults the Autocomplete registers with the native registry.
 */
export const defaultNativeAutocompleteConfig: NativeAutocompleteConfig = {
  size: "md",
  variant: "bordered",
  isDisabled: false,
  required: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    autocomplete: NativeAutocompleteConfig;
  }
}

registerNativeComponentDefaults(
  "autocomplete",
  defaultNativeAutocompleteConfig,
);

/**
 * The values the field falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG: Required<NativeAutocompleteConfig> =
  {
    size: "md",
    radius: "md",
    variant: "bordered",
    color: "primary",
    status: "default",
    isDisabled: false,
    required: false,
  };
