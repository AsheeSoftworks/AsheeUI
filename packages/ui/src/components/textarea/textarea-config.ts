/**
 * TextArea component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the TextArea
 * component, which extends the FieldConfig with rows configuration.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import {
  defaultFieldConfig,
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
} from "../field/field-config";

/**
 * Theme configuration options for the TextArea component.
 *
 * Set under `components.textarea` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface TextAreaConfig extends FieldConfig {
  /**
   * Default number of visible text rows.
   * Controls the initial height of the textarea.
   *
   * @default 4
   */
  rows?: number;
}

/**
 * Default config values registered for the TextArea component.
 * Inherits field defaults and sets default rows to 4.
 */
export const defaultTextAreaConfig: TextAreaConfig = {
  ...defaultFieldConfig,
  rows: 4,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_TEXTAREA_CONFIG: Required<TextAreaConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  rows: 4,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    textarea: TextAreaConfig;
  }
}

registerComponentDefaults("textarea", defaultTextAreaConfig);
