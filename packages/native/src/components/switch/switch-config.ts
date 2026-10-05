/**
 * Switch configuration for the native package.
 *
 * The options are the ones the framework's field family names, so a switch on native
 * and a switch on the web are configured the same way. The four axes native
 * implements are taken from the family's own configuration rather than restated, so a
 * member that renames or retypes one cannot leave the switch behind. The two options
 * that follow are native's own: the platform names the unavailable state itself, and a
 * switch is a control that can be required.
 *
 * The family axes native does not implement — `labelAlign` and `fullWidth` — are
 * absent deliberately, because a configuration that advertised them would offer a
 * consumer options the platform would ignore.
 */

import type { FieldConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Switch.
 *
 * `size`, `radius`, `variant` and `color` carry the meanings the shared field family
 * gives them.
 */
export interface NativeSwitchConfig
  extends Pick<FieldConfig, "size" | "radius" | "variant" | "color"> {
  /** Whether the switch is unavailable. Defaults to false. */
  isDisabled?: boolean;

  /** Whether the switch must be set before the form is submitted. Defaults to false. */
  required?: boolean;
}

/**
 * The defaults the Switch registers with the native registry.
 *
 * The track is `full`, which is what makes a switch read as a track and a knob rather
 * than as a checkbox, and the density is the shared `md` whose proportions the native
 * scale makes thumb-sized.
 */
export const defaultNativeSwitchConfig: NativeSwitchConfig = {
  size: "md",
  radius: "full",
  variant: "solid",
  isDisabled: false,
  required: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    switch: NativeSwitchConfig;
  }
}

registerNativeComponentDefaults("switch", defaultNativeSwitchConfig);

/**
 * The values the switch falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_SWITCH_CONFIG: Required<NativeSwitchConfig> = {
  size: "md",
  radius: "full",
  variant: "solid",
  color: "primary",
  isDisabled: false,
  required: false,
};
