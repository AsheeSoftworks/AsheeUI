/**
 * Select component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Select
 * component, which extends the FieldConfig with menu configuration options.
 * It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import {
  defaultFieldConfig,
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
} from "../field/field-config";
import type { SelectMenuConfig } from "../select-menu";

/**
 * Theme configuration options for the Select component.
 *
 * Inherits the shared field config (label handling) and adds trigger
 * and dropdown-menu overrides. Set under `components.select` in
 * the AsheeUI config.
 */
export interface SelectConfig extends FieldConfig {
  /**
   * Configuration for the dropdown menu.
   * Controls the menu's visual appearance and behavior.
   */
  menu?: SelectMenuConfig;
}

/**
 * Default config values registered for the Select component.
 *
 * Inherits field label defaults from `FALLBACK_FIELD_CONFIG`.
 */
export const defaultSelectConfig: SelectConfig = defaultFieldConfig;

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SELECT_CONFIG = FALLBACK_FIELD_CONFIG;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    select: SelectConfig;
  }
}

registerComponentDefaults("select", defaultSelectConfig);
