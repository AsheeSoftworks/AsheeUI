/**
 * The Stepper's configuration face, shared by both platforms.
 *
 * A stepper is not a field: it is the family's shape for a sequence, which is why it states
 * only how the steps are arranged and how dense they are. Its members are read rather than
 * filled in, so the validation vocabulary does not apply to it.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `stepper` here is what makes `components.stepper` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Size } from "../../tokens";

/**
 * How the steps are arranged.
 *
 * - `responsive`: a column on a narrow screen and a row on a wide one, which is the
 *   arrangement a checkout summary wants.
 * - `horizontal`: a row at every width, for a stepper of two or three short steps.
 * - `vertical`: a column at every width, for a long sequence or a sidebar.
 */
export type StepperOrientation = "responsive" | "horizontal" | "vertical";

/**
 * Theme configuration options for the Stepper component.
 *
 * Set under `components.stepper` in the AsheeUI config.
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
 * The values a stepper falls back to when no tier provides one.
 */
export const FALLBACK_STEPPER_CONFIG: Required<StepperConfig> = {
  orientation: "responsive",
  size: "md",
  showDescriptions: true,
};

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    stepper: StepperConfig;
  }
}
