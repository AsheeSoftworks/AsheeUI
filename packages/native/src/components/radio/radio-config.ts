/**
 * Radio configuration for the native package.
 *
 * The options are the ones the framework's field family names, so a radio on native and
 * a radio on the web are configured the same way. The five axes native implements are
 * taken from the family's own configuration rather than restated, so a member that
 * renames or retypes one cannot leave the radio behind. What follows is native's own:
 * the platform names the unavailable state itself.
 *
 * The family axes native does not implement — `labelAlign` and `fullWidth` — are absent
 * deliberately, because a configuration that advertised them would offer a consumer
 * options the platform would ignore.
 */

import type { RadioConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Radio.
 *
 * `size`, `radius`, `variant`, `color` and `status` carry the meanings the shared field
 * family gives them.
 */
export interface NativeRadioConfig
  extends Pick<
    RadioConfig,
    "size" | "radius" | "variant" | "color" | "status"
  > {
  /** Whether the radio is unavailable. Defaults to false. */
  isDisabled?: boolean;
}

/**
 * The defaults the Radio registers with the native registry.
 * The rounding is `full` and the variant is `default`, which together are what make a
 * radio read as a circle a consumer picks rather than as a second checkbox.
 */
export const defaultNativeRadioConfig: NativeRadioConfig = {
  size: "md",
  radius: "full",
  variant: "default",
  isDisabled: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    radio: NativeRadioConfig;
  }
}

registerNativeComponentDefaults("radio", defaultNativeRadioConfig);

/**
 * The values a radio falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_RADIO_CONFIG: Required<NativeRadioConfig> = {
  size: "md",
  radius: "full",
  variant: "default",
  color: "primary",
  status: "default",
  isDisabled: false,
};
