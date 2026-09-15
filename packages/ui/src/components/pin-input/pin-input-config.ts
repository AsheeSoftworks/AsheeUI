/**
 * PinInput component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the PinInput field:
 * length, accepted characters, density, masking and validation state. It
 * registers the default configuration with the component registry and provides
 * fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared";

/**
 * Characters a PIN field accepts.
 *
 * - `numeric`: digits only, which is what a code sent by SMS contains.
 * - `alphanumeric`: letters and digits, for a code that mixes both.
 * - `text`: any character except whitespace.
 */
export type PinInputMode = "numeric" | "alphanumeric" | "text";

/**
 * Density of a PIN field.
 */
export type PinInputSize = "sm" | "md" | "lg";

/**
 * Theme configuration options for the PinInput component.
 *
 * Set under `components.pininput` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface PinInputConfig {
  /**
   * Number of characters the field collects.
   *
   * @default 4
   */
  length?: number;

  /**
   * Characters the field accepts.
   *
   * @default "numeric"
   */
  mode?: PinInputMode;

  /**
   * Density of the boxes.
   *
   * @default "md"
   */
  size?: PinInputSize;

  /**
   * Whether the typed characters are hidden.
   * Use it for a value that must not be readable over a shoulder.
   *
   * @default false
   */
  masked?: boolean;

  /**
   * Corner rounding of each box.
   * Defaults to the framework radius, so a PIN field matches the surrounding
   * form.
   */
  radius?: Radius;

  /**
   * Whether the field is disabled.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the current value is invalid.
   * Marks the group for assistive technology and colours the boxes, so an
   * error is never carried by colour alone.
   *
   * @default false
   */
  isInvalid?: boolean;
}

/**
 * Default config values registered for the PinInput component.
 */
export const defaultPinInputConfig: PinInputConfig = {
  length: 4,
  mode: "numeric",
  size: "md",
  masked: false,
  isDisabled: false,
  isInvalid: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    pininput: PinInputConfig;
  }
}

registerComponentDefaults("pininput", defaultPinInputConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_PIN_INPUT_CONFIG: Required<
  Omit<PinInputConfig, "radius">
> & { radius: Radius } = {
  length: 4,
  mode: "numeric",
  size: "md",
  masked: false,
  isDisabled: false,
  isInvalid: false,
  radius: "sm",
};
