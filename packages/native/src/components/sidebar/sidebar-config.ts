/**
 * Sidebar configuration for the native package.
 *
 * The options are the ones the framework's sidebar contract names, so `components.sidebar` is
 * configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to on
 * the platform, and the registration that puts it in the native registry.
 */

import type { SidebarConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

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
 * Configuration options for the native Sidebar.
 */
export type NativeSidebarConfig = SidebarConfig;

/**
 * The defaults the Sidebar registers with the native registry.
 *
 * They are the web's own values. `animated` is the web's way of animating a width change, and a
 * platform class cannot declare movement, so the option resolves and states nothing here.
 */
export const defaultNativeSidebarConfig: NativeSidebarConfig = {
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

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    sidebar: NativeSidebarConfig;
  }
}

registerNativeComponentDefaults("sidebar", defaultNativeSidebarConfig);

/**
 * The values the sidebar falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_SIDEBAR_CONFIG = {
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
