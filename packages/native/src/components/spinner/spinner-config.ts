/**
 * Spinner configuration for the native package.
 *
 * The options are the ones the framework's spinner contract names, so a spinner is
 * configured the same way on both platforms, and the three axes that matter here —
 * density, colour role and speed — are taken from the shared contract rather than
 * restated, so the shared contract cannot be retyped without this failing to compile.
 *
 * The differences between the two renderers are in the *values* rather than in the
 * shape: the density steps up, because a ring is read at arm's length on a phone
 * rather than at a pointer's distance, and that lives in the class map.
 */

import { SPINNER_FALLBACK_SPEED, type SpinnerConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Spinner.
 *
 * `size`, `color` and `speed` carry the meanings the shared spinner contract gives
 * them, and `className` is the extra classes a consumer applies to every instance.
 */
export type NativeSpinnerConfig = Pick<
  SpinnerConfig,
  "size" | "color" | "speed" | "className"
>;

/**
 * The defaults the Spinner registers with the native registry.
 *
 * `color` stays unset so it inherits from the platform's configuration rather than
 * pinning a role, and the speed is the framework's own, so a consumer who retunes it
 * retunes both platforms.
 */
export const defaultNativeSpinnerConfig: NativeSpinnerConfig = {
  size: "md",
  speed: SPINNER_FALLBACK_SPEED,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    spinner: NativeSpinnerConfig;
  }
}

registerNativeComponentDefaults("spinner", defaultNativeSpinnerConfig);

/**
 * The values the spinner falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_SPINNER_CONFIG: Required<NativeSpinnerConfig> = {
  size: "md",
  color: "primary",
  speed: SPINNER_FALLBACK_SPEED,
  className: "",
};
