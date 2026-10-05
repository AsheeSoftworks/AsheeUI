/**
 * Stepper configuration for the native package.
 *
 * The options are the ones the framework's stepper names, so a sequence on native and on the
 * web are configured the same way. Every axis is taken from the shared configuration rather
 * than restated.
 *
 * What the renderer keeps is what `responsive` *means*: native has no breakpoints, so the
 * arrangement it answers `responsive` with is the column, because a phone is narrow.
 */

import type { StepperConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Stepper.
 *
 * `orientation`, `size` and `showDescriptions` carry the meanings the shared stepper gives
 * them.
 */
export type NativeStepperConfig = StepperConfig;

/**
 * The defaults the Stepper registers with the native registry.
 */
export const defaultNativeStepperConfig: NativeStepperConfig = {
  orientation: "responsive",
  size: "md",
  showDescriptions: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    stepper: NativeStepperConfig;
  }
}

registerNativeComponentDefaults("stepper", defaultNativeStepperConfig);

/**
 * The values the stepper falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_STEPPER_CONFIG: Required<NativeStepperConfig> = {
  orientation: "responsive",
  size: "md",
  showDescriptions: true,
};
