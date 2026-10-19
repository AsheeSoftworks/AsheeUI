/**
 * SidebarLayout component configuration for AsheeUI.
 *
 * This file registers the values the application shell defaults to on the web, so the
 * component-level tier of the theme cascade has a value to resolve. The options themselves, and
 * the types that name them, live in `@asheeui/core`: they are the framework's sidebar-layout
 * contract rather than a web renderer's, and the native renderer reads the same ones from the
 * same place. What stays here is the web default values and the registration that puts them in
 * the web registry.
 */

import {
  registerComponentDefaults,
  type SidebarLayoutConfig,
} from "@asheeui/core";

export type {
  SidebarLayoutConfig,
  SidebarLayoutSide,
  SidebarLayoutWidth,
} from "@asheeui/core";

/**
 * Default config values registered for the SidebarLayout component.
 */
export const defaultSidebarLayoutConfig: SidebarLayoutConfig = {
  side: "start",
  sidebarWidth: "md",
  stickySidebar: true,
};

registerComponentDefaults("sidebarlayout", defaultSidebarLayoutConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_SIDEBAR_LAYOUT_CONFIG: Required<SidebarLayoutConfig> = {
  side: "start",
  sidebarWidth: "md",
  stickySidebar: true,
};
