/**
 * SearchInput component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the search field:
 * its density, its colour role, whether it dismisses its own text and whether
 * it names itself for assistive technology. It registers the default
 * configuration with the component registry and provides fallback values for the
 * cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Size } from "../../shared";

/**
 * Theme configuration options for the SearchInput component.
 *
 * Set under `components.searchinput` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface SearchInputConfig {
  /**
   * Density of the field and of the control that dismisses its text.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Accent colour of the field's focus ring.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Whether the field offers a control that empties it.
   *
   * @default true
   */
  clearable?: boolean;

  /**
   * Visible label of the field.
   * A search field is often named only for assistive technology, so the label
   * can be hidden from view with `hideLabel`.
   */
  label?: string;

  /**
   * Whether the label is available to assistive technology only.
   *
   * @default true
   */
  hideLabel?: boolean;
}

/**
 * Default config values registered for the SearchInput component.
 * The label is named and hidden rather than absent, because a field whose name
 * is empty is announced as "search" and nothing else.
 */
export const defaultSearchInputConfig: SearchInputConfig = {
  size: "md",
  color: "primary",
  clearable: true,
  label: "Search",
  hideLabel: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    searchinput: SearchInputConfig;
  }
}

registerComponentDefaults("searchinput", defaultSearchInputConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_SEARCH_INPUT_CONFIG: Required<SearchInputConfig> = {
  size: "md",
  color: "primary",
  clearable: true,
  label: "Search",
  hideLabel: true,
};
