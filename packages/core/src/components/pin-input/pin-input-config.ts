/**
 * The PinInput's configuration face, shared by both platforms.
 *
 * A code field is a field family member that collects one value in several places, so its
 * configuration is the family's validation vocabulary plus the four decisions only a code
 * field has: how many characters it collects, which characters it accepts, whether they
 * are hidden, and which form of the whole value a consumer reads.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `pininput` here is what makes `components.pininput` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Radius } from "../../tokens";

/**
 * Characters a code field accepts.
 *
 * - `numeric`: digits only, which is what a code sent by SMS contains.
 * - `alphanumeric`: letters and digits, for a code that mixes both.
 * - `text`: any character except whitespace.
 */
export type PinInputMode = "numeric" | "alphanumeric" | "text";

/**
 * Density of a code field.
 */
export type PinInputSize = "sm" | "md" | "lg";

/**
 * Theme configuration options for the PinInput component.
 *
 * Set under `components.pininput` in the AsheeUI config.
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
   * Defaults to the framework radius, so a code field matches the surrounding form.
   */
  radius?: Radius;

  /**
   * Whether the field is unavailable.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the current value is invalid.
   * Marks the group for assistive technology and colours the boxes, so an error is never
   * carried by colour alone.
   *
   * @default false
   */
  isInvalid?: boolean;
}

/**
 * The values a code field falls back to when no tier provides one.
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

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    pininput: PinInputConfig;
  }
}
