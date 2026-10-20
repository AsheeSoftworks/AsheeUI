/**
 * MultiSelect component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the MultiSelect
 * component, which extends the FieldConfig with menu and chip configuration
 * options. It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import type { Color, Concrete, Radius, Size, Variant } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";
import { FALLBACK_FIELD_CONFIG, type FieldConfig } from "../field/field-config";
import { defaultInputConfig, type InputConfig } from "../input";
import type { MenuConfig } from "../menu";

/**
 * Configuration for selected value chips.
 * Controls the appearance of chips in the selected values section.
 */
export interface MultiSelectChipConfig {
  /**
   * Visual style variant for chips.
   */
  variant?: Variant | undefined;

  /**
   * Theme accent color for chips.
   */
  color?: Color | undefined;

  /**
   * Corner rounding for chips.
   */
  radius?: Radius | undefined;

  /**
   * Size scale for chips.
   */
  size?: Size | undefined;
}

/**
 * Theme configuration options for the MultiSelect component.
 *
 * Set under `components.multiSelect` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface MultiSelectConfig extends InputConfig {
  /**
   * Configuration for the dropdown menu.
   * Controls the menu's visual appearance and behavior.
   */
  menu?: MenuConfig | undefined;

  /**
   * Configuration for selected value chips.
   * Controls the appearance of chips in the selected values section.
   */
  chip?: MultiSelectChipConfig | undefined;
}

/**
 * Default config values registered for the MultiSelect component.
 * Inherits field defaults and sets chip size to "sm".
 */
export const defaultMultiSelectConfig: MultiSelectConfig = {
  ...defaultInputConfig,
  chip: {
    size: "sm",
  },
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_MULTI_SELECT_CONFIG: Concrete<FieldConfig> & {
  chip: Concrete<MultiSelectChipConfig>;
} = {
  ...FALLBACK_FIELD_CONFIG,
  chip: {
    size: "sm",
    color: "primary",
    radius: "sm",
    variant: "solid",
  },
};

declare module "@asheeui/core" {
  interface ComponentTypeConfigRegistry {
    multiSelect: MultiSelectConfig;
  }
}

registerComponentDefaults("multiSelect", defaultMultiSelectConfig);
