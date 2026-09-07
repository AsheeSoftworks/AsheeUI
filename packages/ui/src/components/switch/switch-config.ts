/**
 * Switch component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Switch
 * component, which extends the FieldConfig with size and status options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import {
  defaultFieldConfig,
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

/**
 * Size key for the switch component.
 * Maps to the FieldSizeKey type: "sm", "md", or "lg".
 */
export type SwitchSizeKey = FieldSizeKey;

/**
 * Theme configuration options for the Switch component.
 *
 * Set under `components.switch` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SwitchConfig extends FieldConfig {}

/**
 * Default config values registered for the Switch component.
 * Inherits the default field configuration.
 */
export const defaultSwitchConfig: SwitchConfig = {
  ...defaultFieldConfig,
  radius: "full",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SWITCH_CONFIG: Required<SwitchConfig> =
  FALLBACK_FIELD_CONFIG;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    switch: SwitchConfig;
  }
}

registerComponentDefaults("switch", defaultSwitchConfig);
