/**
 * SidebarLayout component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the application
 * shell that places a navigation column beside a page: side, sidebar width and
 * stickiness. It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";

/**
 * Side the navigation column sits on from the `lg` breakpoint upwards.
 */
export type SidebarLayoutSide = "start" | "end";

/**
 * Width of the navigation column.
 */
export type SidebarLayoutWidth = "sm" | "md" | "lg";

/**
 * Theme configuration options for the SidebarLayout component.
 *
 * Set under `components.sidebarlayout` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SidebarLayoutConfig {
  /** Side the navigation column sits on. @default "start" */
  side?: SidebarLayoutSide;

  /** Width of the navigation column. @default "md" */
  sidebarWidth?: SidebarLayoutWidth;

  /**
   * Whether the navigation column stays in view while the content scrolls.
   * Applies from the `lg` breakpoint upwards, where the column sits beside the
   * content rather than above it.
   *
   * @default true
   */
  stickySidebar?: boolean;
}

/**
 * Default config values registered for the SidebarLayout component.
 */
export const defaultSidebarLayoutConfig: SidebarLayoutConfig = {
  side: "start",
  sidebarWidth: "md",
  stickySidebar: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    sidebarlayout: SidebarLayoutConfig;
  }
}

registerComponentDefaults("sidebarlayout", defaultSidebarLayoutConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_SIDEBAR_LAYOUT_CONFIG: Required<SidebarLayoutConfig> = {
  side: "start",
  sidebarWidth: "md",
  stickySidebar: true,
};
