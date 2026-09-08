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
 * Default config values registered for the Select component.
 *
 * Inherits field label defaults from `FALLBACK_FIELD_CONFIG`.
 */
export const defaultSelectConfig: SelectConfig = {
  ...defaultFieldConfig,
  portal: true,
  portalTarget: null,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SELECT_CONFIG = {
  ...FALLBACK_FIELD_CONFIG,
  portal: true,
  portalTarget: null,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    select: SelectConfig;
  }
}

registerComponentDefaults("select", defaultSelectConfig);
