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

  /**
   * Whether to render the dropdown menu in a React portal.
   * When true, the menu is rendered at the document body level,
   * escaping any parent DOM hierarchy. This prevents CSS containment
   * and stacking context issues. Defaults to true because dropdowns
   * should always appear above other content.
   *
   * @default true
   */
  portal?: boolean;

  /**
   * Custom portal target element for the dropdown menu.
   * When portal is enabled, the menu is rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;
}

/**
 * Default config values registered for the Autocomplete component.
 *
 * Inherits field label defaults from `FALLBACK_FIELD_CONFIG`.
 */
export const defaultAutocompleteConfig: AutocompleteConfig = {
  ...defaultFieldConfig,
  portal: true,
  portalTarget: null,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_AUTOCOMPLETE_CONFIG = {
  ...FALLBACK_FIELD_CONFIG,
  portal: true,
  portalTarget: null,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    autocomplete: AutocompleteConfig;
  }
}

registerComponentDefaults("autocomplete", defaultAutocompleteConfig);
