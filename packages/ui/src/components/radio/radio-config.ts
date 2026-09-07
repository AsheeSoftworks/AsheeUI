/**
 * Radio component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Radio
 * component and RadioGroup. It extends the FieldConfig with variant
 * support and registers defaults with the component registry.
 */

import { registerComponentDefaults } from "../../libs/registry";
import {
  defaultFieldConfig,
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

/**
 * Size key for radio components.
 * Maps to the FieldSizeKey type: "sm", "md", or "lg".
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
 *
 * Set under `components.radio` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface RadioConfig extends Omit<FieldConfig, "variant"> {
  /**
   * Visual style variant.
   * Controls whether the radio appears as a standard button or a card.
   *
   * @default "default"
   */
  variant?: RadioVariant;
}

/**
 * Default config values registered for the Radio component.
 * Sets radius to "full" for circular radio buttons.
 */
export const defaultRadioConfig: RadioConfig = {
  ...defaultFieldConfig,
  radius: "full",
  variant: "default",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_RADIO_CONFIG = {
  ...FALLBACK_FIELD_CONFIG,
  radius: "full",
  variant: "default",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    radio: RadioConfig;
  }
}

registerComponentDefaults("radio", defaultRadioConfig);
