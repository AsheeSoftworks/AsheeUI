/**
 * MultiSelect component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the MultiSelect
 * component, which extends the FieldConfig with menu and chip configuration
 * options. It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";
import {
  defaultFieldConfig,
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
} from "../field/field-config";
import type { MenuConfig } from "../select-menu";

/**
 * Theme configuration options for the MultiSelect component.
 *
 * Set under `components.multiSelect` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface MultiSelectConfig extends FieldConfig {
  /**
   * Configuration for the dropdown menu.
   * Controls the menu's visual appearance and behavior.
   */
  menu?: MenuConfig;

  /**
   * Configuration for selected value chips.
   * Controls the appearance of chips in the selected values section.
   */
  chip?: {
    /**
     * Visual style variant for chips.
     */
    variant?: Variant;

    /**
     * Theme accent color for chips.
     */
    color?: Color;

    /**
     * Corner rounding for chips.
     */
    radius?: Radius;

    /**
     * Size scale for chips.
     */
    size?: Size;
  };
}

/**
 * Default config values registered for the MultiSelect component.
 * Inherits field defaults and sets chip size to "sm".
 */
export const defaultMultiSelectConfig: MultiSelectConfig = {
  ...defaultFieldConfig,
  chip: {
    size: "sm",
  },
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_MULTI_SELECT_CONFIG = {
  ...FALLBACK_FIELD_CONFIG,
  chip: {
    size: "sm",
    color: "primary",
    radius: "sm",
    variant: "solid",
  },
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    multiSelect: MultiSelectConfig;
  }
}

registerComponentDefaults("multiSelect", defaultMultiSelectConfig);
