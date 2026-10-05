/**
 * MultiSelect configuration for the native package.
 *
 * The options are the ones the framework's multi-select names, so a field that picks
 * several values on native and on the web are configured the same way. The family's visual
 * axes are taken from the shared configuration, and what follows is native's own: the
 * platform names the unavailable state itself.
 *
 * The web's multi-select also takes `menu` and `chip` options, which configure the floating
 * list and the chip slots it renders. They are deliberately absent here: the platform has no
 * floating layer, and its chips are drawn by the component from the values it holds rather
 * than supplied by the consumer.
 */

import type { InputConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native MultiSelect.
 *
 * `size`, `radius`, `variant`, `color` and `status` carry the meanings the shared field
 * family gives them.
 */
export interface NativeMultiSelectConfig
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
 * The defaults the MultiSelect registers with the native registry.
 */
export const defaultNativeMultiSelectConfig: NativeMultiSelectConfig = {
  size: "md",
  variant: "bordered",
  isDisabled: false,
  required: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    multiSelect: NativeMultiSelectConfig;
  }
}

registerNativeComponentDefaults("multiSelect", defaultNativeMultiSelectConfig);

/**
 * The values the field falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_MULTI_SELECT_CONFIG: Required<NativeMultiSelectConfig> =
  {
    size: "md",
    radius: "md",
    variant: "bordered",
    color: "primary",
    status: "default",
    isDisabled: false,
    required: false,
  };
