/**
 * Stepper component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the stepper: its
 * orientation, its density and whether the step descriptions are shown. It
 * registers the default configuration with the component registry and provides
 * fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared";

/**
 * How the steps are arranged.
 *
 * - `responsive`: a column on a narrow screen and a row from the `md`
 *   breakpoint, which is the arrangement a checkout summary wants.
 * - `horizontal`: a row at every width, for a stepper of two or three short
 *   steps.
 * - `vertical`: a column at every width, for a long sequence or a sidebar.
 */
export type StepperOrientation = "responsive" | "horizontal" | "vertical";

/**
 * Theme configuration options for the Stepper component.
 *
 * Set under `components.stepper` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface StepperConfig {
  /**
   * How the steps are arranged.
   *
   * @default "responsive"
   */
  orientation?: StepperOrientation;

  /**
   * Density of the step markers and their labels.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Whether each step's description is shown under its label.
   *
   * @default true
   */
  showDescriptions?: boolean;
}

/**
 * Default config values registered for the Stepper component.
 */
export const defaultStepperConfig: StepperConfig = {
  orientation: "responsive",
  size: "md",
  showDescriptions: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    stepper: StepperConfig;
  }
}

registerComponentDefaults("stepper", defaultStepperConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_STEPPER_CONFIG: Required<StepperConfig> = {
  orientation: "responsive",
  size: "md",
  showDescriptions: true,
};
