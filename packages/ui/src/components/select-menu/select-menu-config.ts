/**
 * SelectMenu component configuration for AsheeUI.
 * This file defines the configuration types for the SelectMenu dropdown
 * component, including option structure and visual configuration for
 * menu items. It provides fallback values for the cascade resolution system.
 */

import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * A single option in the select menu.
 * Each option must have a label and a unique value.
 */
export interface SelectMenuOption {
  /**
   * Text displayed in the input and in the options list.
   */
  label: string;

  /**
   * Stable identifier returned via `onValueChange`.
   */
  value: string | number;

  /**
   * Disables the option when `true`.
   * Disabled options cannot be selected.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Allows arbitrary option metadata (e.g. icons, descriptions).
   * Additional properties are passed through and can be used in custom rendering.
   */
  [key: string]: unknown;
}

/**
 * Theme configuration options for the SelectMenu component.
 * Controls the visual appearance of the dropdown menu and its items.
 */
export interface MenuConfig {
  /**
   * Corner rounding of the dropdown menu.
   * Controls the border-radius of the menu container.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Density scale of the dropdown menu.
   * Controls the size of menu items.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Variant for inactive (non-selected) options.
   * Controls the visual style of unselected items.
   *
   * @default "ghost"
   */
  itemVariant?: Variant;

  /**
   * Color for inactive options.
   * Controls the accent color of unselected items.
   *
   * @default "primary"
   */
  itemColor?: Color;

  /**
   * Variant for the selected option.
   * Controls the visual style of the currently selected item.
   *
   * @default "faded"
   */
  activeItemVariant?: Variant;

  /**
   * Color for the selected option.
   * Controls the accent color of the selected item.
   *
   * @default "primary"
   */
  activeItemColor?: Color;

  /**
   * Whether to lock body scroll when the dropdown is open.
   * When true, the page behind the dropdown cannot scroll.
   * This prevents the page from scrolling while interacting with the dropdown.
   *
   * @default false
   */
  lockScroll?: boolean;

  /**
   * Whether to render the menu in a React portal.
   * When true, the menu is rendered at the document body level.
   * Defaults to true. This is typically controlled by the parent
   * component (Select, MultiSelect, Autocomplete) via their own
   * config or props.
   */
  portal?: boolean;

  /**
   * Custom portal target element for the menu.
   * When portal is enabled, the menu is rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;
}

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SELECT_MENU_CONFIG = {
  radius: "md" as Radius,
  size: "md" as Size,
  itemVariant: "ghost" as Variant,
  itemColor: "primary" as Color,
  activeItemVariant: "faded" as Variant,
  activeItemColor: "primary" as Color,
  lockScroll: false,
  portal: true,
};
