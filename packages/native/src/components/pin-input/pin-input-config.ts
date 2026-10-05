/**
 * PinInput configuration for the native package.
 *
 * The options are the ones the framework's code field names, so a code field on native and
 * on the web are configured the same way. Every axis is taken from the shared
 * configuration rather than restated, so a member that renames or retypes one cannot leave
 * the code field behind.
 */

import type { PinInputConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native PinInput.
 *
 * `length`, `mode`, `size`, `masked`, `radius`, `isDisabled` and `isInvalid` carry the
 * meanings the shared code field gives them.
 */
export type NativePinInputConfig = PinInputConfig;

/**
 * The defaults the PinInput registers with the native registry.
 * Four digits is the length of a code sent by SMS, and the boxes are the shared `md` whose
 * proportions the native scale makes thumb-sized.
 */
export const defaultNativePinInputConfig: NativePinInputConfig = {
  length: 4,
  mode: "numeric",
  size: "md",
  masked: false,
  isDisabled: false,
  isInvalid: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    pininput: NativePinInputConfig;
  }
}

registerNativeComponentDefaults("pininput", defaultNativePinInputConfig);

/**
 * The values the field falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_PIN_INPUT_CONFIG: Required<NativePinInputConfig> =
  {
    length: 4,
    mode: "numeric",
    size: "md",
    masked: false,
    radius: "sm",
    isDisabled: false,
    isInvalid: false,
  };
