/**
 * Sidebar component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Sidebar
 * component, including size, variant, radius, item styling, tooltip,
 * and collapse behavior options. It registers the default configuration
 * with the component registry and provides fallback values for the
 * cascade resolution system.
 */

import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";
import type { TooltipPlacement } from "../tooltip/tooltip-config";

/**
 * Size key for the sidebar.
 * Controls the width of the sidebar when expanded and collapsed.
 */
export type SidebarSizeKey = Size;

/**
 * Visual style variant of the sidebar.
 * - `default`: Standard sidebar with border and background.
 * - `bordered`: Sidebar with a thicker border.
 * - `floating`: Sidebar with rounded corners and shadow (floating appearance).
 * - `ghost`: Minimal sidebar with background only, no border.
 */
export type SidebarVariant = "default" | "bordered" | "floating" | "ghost";

/**
 * A single navigation item in the sidebar.
 */
export interface SidebarItem<T = string> {
  /**
   * Unique item identifier.
   */
  id: T;

  /**
   * Display label or title.
   */
  label: ReactNode;

  /**
   * URL or path for navigation.
   */
  href?: string;

  /**
   * Leading icon element.
   */
  icon?: ReactNode;

  /**
   * Optional trailing badge element or count.
   */
  badge?: ReactNode;

  /**
   * Role string list for optional visibility filtering.
   * When provided, the item is only shown to users with matching roles.
   */
  roles?: string[];

  /**
   * Disables click interaction.
   * @default false
   */
  disabled?: boolean;

  /**
   * Target for link (e.g., "_blank").
   */
  target?: string;

  /**
   * Rel attribute for link.
   */
  rel?: string;
}

/**
 * A section containing multiple sidebar items.
 * Used to group related navigation items under a label.
 */
export interface SidebarSection<T = string> {
  /**
   * Unique section identifier.
   */
  id: T;

  /**
   * Display label or title.
   * Shown as a section header when the sidebar is expanded.
   */
  label?: ReactNode;

  /**
   * Optional array of sidebar items within the section.
   */
  items?: SidebarItem<T>[];

  /**
   * Role string list for optional visibility filtering.
   * When provided, the section is only shown to users with matching roles.
   */
  roles?: string[];

  /**
   * Disables click interaction for the entire section.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Union type for sidebar content.
 * Can be either a flat array of items or an array of sections.
 */
export type SidebarItems<T = string> = SidebarItem<T>[] | SidebarSection<T>[];

/**
 * Theme configuration options for the Sidebar component.
 *
 * Set under `components.sidebar` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SidebarConfig {
  /**
   * Size scale of the sidebar.
   * Controls the width of the sidebar when expanded and collapsed.
   *
   * @default "md"
   */
  size?: SidebarSizeKey;

  /**
   * Visual style variant.
   * Controls the sidebar's appearance including borders and background.
   */
  variant?: SidebarVariant;

  /**
   * Corner rounding of the sidebar container.
   */
  radius?: Radius;

  /**
   * Corner rounding of individual navigation items.
   */
  itemRadius?: Radius;

  /**
   * Visual variant for inactive navigation items.
   */
  itemVariant?: Variant;

  /**
   * Visual variant for the active navigation item.
   */
  activeItemVariant?: Variant;

  /**
   * Theme color for the active navigation item.
   */
  activeItemColor?: Color;

  /**
   * Whether the collapse button is shown.
   * @default true
   */
  showCollapseButton?: boolean;

  /**
   * Whether tooltips are shown for collapsed items.
   * @default true
   */
  showTooltips?: boolean;

  /**
   * Placement of tooltips relative to the item.
   * @default "right"
   */
  tooltipPlacement?: TooltipPlacement;

  /**
   * Visual variant for tooltips.
   */
  tooltipVariant?: Variant;

  /**
   * Theme color for tooltips.
   */
  tooltipColor?: Color;

  /**
   * Whether the sidebar has animations.
   * @default true
   */
  animated?: boolean;

  /**
   * Initial collapsed state for uncontrolled usage.
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Whether the sidebar can be collapsed.
   * @default true
   */
  collapsible?: boolean;
}

/**
 * Default config values registered for the Sidebar component.
 */
export const defaultSidebarConfig: SidebarConfig = {
  size: "md",
  showTooltips: true,
  tooltipPlacement: "right",
  animated: true,
  defaultCollapsed: false,
  collapsible: true,
  showCollapseButton: true,
  itemVariant: "ghost",
  activeItemVariant: "solid",
  activeItemColor: "primary",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SIDEBAR_CONFIG: Required<SidebarConfig> = {
  size: "md",
  variant: "default",
  radius: "none",
  itemRadius: "md",
  itemVariant: "ghost",
  activeItemVariant: "solid",
  activeItemColor: "primary",
  showTooltips: true,
  tooltipPlacement: "right",
  tooltipVariant: "solid",
  tooltipColor: "secondary",
  animated: true,
  defaultCollapsed: false,
  collapsible: true,
  showCollapseButton: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    sidebar: SidebarConfig;
  }
}

registerComponentDefaults("sidebar", defaultSidebarConfig);
