/**
 * Stepper configuration for the web renderer.
 *
 * The stepper's options are shared, so the contract lives in `@asheeui/core` and is re-exported
 * here: a consumer configures `components.stepper` with the same keys on both platforms.
 *
 * What stays with the renderer is the value each option *defaults to* on the web, and the
 * registration itself.
 */

import { registerComponentDefaults, type StepperConfig } from "@asheeui/core";

export type { StepperConfig, StepperOrientation } from "@asheeui/core";
export { FALLBACK_STEPPER_CONFIG } from "@asheeui/core";

/**
 * Default config values registered for the Stepper component.
 */
export const defaultStepperConfig: StepperConfig = {
  orientation: "responsive",
  size: "md",
  showDescriptions: true,
};

registerComponentDefaults("stepper", defaultStepperConfig);
