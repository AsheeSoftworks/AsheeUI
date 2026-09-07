/**
 * Input component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Input
 * component. It extends the FieldConfig interface and registers defaults
 * with the component registry.
 */

import { registerComponentDefaults } from "../../libs/registry";
import { defaultFieldConfig, type FieldConfig } from "../field/field-config";

/**
 * Theme configuration options for the Input component.
 * Extends the shared FieldConfig with input-specific options.
 * Set under `components.input` in the AsheeUI config.
 */
export interface InputConfig extends FieldConfig {}

/**
 * Default config values registered for the Input component.
 * Inherits the default field configuration.
 */
export const defaultInputConfig = defaultFieldConfig;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    input: InputConfig;
  }
}

registerComponentDefaults("input", defaultInputConfig);
