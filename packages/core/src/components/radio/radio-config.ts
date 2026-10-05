/**
 * The Radio's configuration face, shared by both platforms.
 *
 * A radio is a field that holds one value out of a set, so its configuration is the
 * family's — density, rounding, accent, label alignment and validation status — with one
 * substitution: the treatment it resolves is not the family's `variant` but the two shapes
 * a radio is drawn in. A radio is either a dot with a label beside it or a card the whole
 * option sits in, and neither of those is a surface treatment the other family members
 * offer, which is why the option is named here rather than inherited.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `radio` here is what makes `components.radio` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import {
  FALLBACK_FIELD_CONFIG,
  type FieldSizeKey,
} from "../field/field-config";
import type { InputConfig } from "../input/input-config";

/**
 * Density of a radio, named as the family names it.
 */
export type RadioSizeKey = FieldSizeKey;

/**
 * Visual style variant of the radio.
 * - `default`: Standard radio button with a circular indicator.
 * - `card`: Radio rendered as a card-style container.
 */
export type RadioVariant = "default" | "card";

/**
 * Theme configuration options for the Radio component.
 * Set under `components.radio` in the AsheeUI config.
 */
export interface RadioConfig extends Omit<InputConfig, "variant"> {
  /**
   * Visual style variant.
   * Controls whether the radio appears as a standard button or a card.
   *
   * @default "default"
   */
  variant?: RadioVariant;
}

/**
 * The values a radio falls back to when no tier provides one.
 *
 * The rounding is `full` and the variant is `default`, which together are what make a
 * radio read as a circle a consumer picks rather than as a second checkbox.
 */
export const FALLBACK_RADIO_CONFIG: Required<RadioConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  radius: "full",
  variant: "default",
};

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    radio: RadioConfig;
  }
}
