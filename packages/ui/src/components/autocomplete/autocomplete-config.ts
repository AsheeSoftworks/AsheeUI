/**
 * Autocomplete component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Autocomplete
 * component, which combines a text input with a filterable suggestion dropdown.
 * It extends the FieldConfig for label handling and adds menu configuration options.
 */

import { registerComponentDefaults } from "../../libs/registry";
import {
  defaultFieldConfig,
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
} from "../field/field-config";
import type { SelectMenuConfig } from "../select-menu";

/**
 * Theme configuration options for the Autocomplete component.
 *
 * Inherits the shared field config (label handling) and adds trigger
 * and dropdown-menu overrides. Set under `components.autocomplete` in
 * the AsheeUI config.
 */
export interface AutocompleteConfig extends FieldConfig {
  /**
   * Configuration for the dropdown menu that displays suggestions.
   * Controls the menu's visual appearance and behavior.
   */
  menu?: SelectMenuConfig;
}

/**
 * Default config values registered for the Autocomplete component.
 *
 * Inherits field label defaults from `FALLBACK_FIELD_CONFIG`.
 */
export const defaultAutocompleteConfig: AutocompleteConfig = defaultFieldConfig;

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_AUTOCOMPLETE_CONFIG = FALLBACK_FIELD_CONFIG;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    autocomplete: AutocompleteConfig;
  }
}

registerComponentDefaults("autocomplete", defaultAutocompleteConfig);
