/**
 * Sidebar component configuration for AsheeUI.
 *
 * This file registers the values the sidebar defaults to on the web, so the component-level tier of
 * the theme cascade has a value to resolve. The options themselves, the types that name them and the
 * item types live in `@asheeui/core`: they are the framework's sidebar contract rather than a web
 * renderer's, and the native renderer reads the same ones from the same place. What stays here is
 * the web default values and the registration that puts them in the web registry.
 */

import { registerComponentDefaults, type SidebarConfig } from "@asheeui/core";

export type {
  SidebarActiveOptionConfig,
  SidebarConfig,
  SidebarInactiveOptionConfig,
  SidebarItem,
  SidebarItems,
  SidebarLinkSubstitution,
  SidebarOptionsConfig,
  SidebarSection,
  SidebarSizeKey,
  SidebarTooltipConfig,
  SidebarVariant,
} from "@asheeui/core";

/**
 * Default config values registered for the Sidebar component.
 */
export const defaultSidebarConfig: SidebarConfig = {
  size: "md",
  animated: true,
  defaultCollapsed: false,
  collapsible: true,
  showCollapseButton: true,
  options: {
    inactive: { variant: "ghost" },
    active: { variant: "solid", color: "primary" },
  },
  tooltip: {
    show: true,
    placement: "right",
  },
};

registerComponentDefaults("sidebar", defaultSidebarConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SIDEBAR_CONFIG = {
  size: "md",
  variant: "default",
  radius: "none",
  options: {
    radius: "md",
    active: { variant: "solid", color: "primary" },
    inactive: { variant: "ghost", color: "none" },
  },
  tooltip: {
    show: true,
    placement: "right",
    variant: "solid",
    color: "secondary",
  },
  animated: true,
  defaultCollapsed: false,
  collapsible: true,
  showCollapseButton: true,
} as const;
