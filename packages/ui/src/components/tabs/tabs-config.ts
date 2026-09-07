/**
 * Tabs component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Tabs
 * component, including variant, size, radius, and active state styling
 * options. It registers the default configuration with the component
 * registry and provides fallback values for the cascade resolution system.
 */

import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Visual style variant of the tabs.
 * - `underline`: Active tab highlighted with an underline.
 * - `bordered`: Tabs with a bordered container.
 * - `ghost`: Minimal tabs without container styling.
 */
export type TabsVariant = "underline" | "bordered" | "ghost";

/**
 * A single tab item in the tabs list.
 * Each tab must have an id and either label or name for display.
 */
export interface TabItem {
  /**
   * Unique identifier for the tab.
   * Used for selection state and React keys.
   */
  id: string | number;

  /**
   * Primary display text.
   * Alias for `name` for cleaner API.
   */
  label?: ReactNode;

  /**
   * Legacy display text support.
   * Backward compatibility for `name` prop.
   */
  name?: ReactNode;

  /**
   * Optional icon rendered before the label.
   */
  icon?: ReactNode;

  /**
   * Optional badge rendered after the label.
   * Typically a number or status indicator.
   */
  badge?: ReactNode;

  /**
   * Content rendered in the tab panel when this tab is active.
   */
  content?: ReactNode;

  /**
   * Whether the tab is disabled.
   * Disabled tabs cannot be selected.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Active button variant override for this specific tab.
   * Overrides the component-level activeVariant.
   */
  activeVariant?: Variant;

  /**
   * Active button color override for this specific tab.
   * Overrides the component-level activeColor.
   */
  activeColor?: Color;

  /**
   * Allows arbitrary tab metadata.
   * Additional properties are passed through.
   */
  [key: string]: unknown;
}

/**
 * Theme configuration options for the Tabs component.
 *
 * Set under `components.tabs` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface TabsConfig {
  /**
   * Density scale of the tabs.
   * Controls the height, padding, and font size of tab triggers.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Visual style variant.
   * Controls the container and active indicator styling.
   *
   * @default "underline"
   */
  variant?: TabsVariant;

  /**
   * Corner rounding of the tab container.
   * Controls the border-radius of the tablist container.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Corner rounding of the active tab button.
   * Controls the border-radius of the selected tab trigger.
   *
   * @default "md"
   */
  activeRadius?: Radius;

  /**
   * Visual variant for the active tab button.
   * Controls the style of the selected tab trigger.
   *
   * @default "solid"
   */
  activeVariant?: Variant;

  /**
   * Theme color for the active tab button.
   * Controls the color of the selected tab trigger.
   *
   * @default "primary"
   */
  activeColor?: Color;
}

/**
 * Default config values registered for the Tabs component.
 */
export const defaultTabsConfig: TabsConfig = {
  size: "md",
  variant: "underline",
  radius: "md",
  activeRadius: "md",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_TABS_CONFIG: Required<TabsConfig> = {
  size: "md",
  variant: "underline",
  radius: "md",
  activeRadius: "md",
  activeVariant: "solid",
  activeColor: "primary",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    tabs: TabsConfig;
  }
}

registerComponentDefaults("tabs", defaultTabsConfig);
