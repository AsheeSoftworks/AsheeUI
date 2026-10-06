/**
 * SidebarLayout configuration for the native package.
 *
 * The options are the ones the framework's sidebar-layout contract names, so `components.sidebarlayout`
 * is configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to on
 * the platform, and the registration that puts it in the native registry.
 */

import type { SidebarLayoutConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  SidebarLayoutConfig,
  SidebarLayoutSide,
  SidebarLayoutWidth,
} from "@asheeui/core";

/**
 * Configuration options for the native SidebarLayout.
 */
export type NativeSidebarLayoutConfig = SidebarLayoutConfig;

/**
 * The defaults the SidebarLayout registers with the native registry.
 *
 * They are the web's own values. `stickySidebar` is the web's way of keeping a column in view while
 * the content scrolls; a native shell places the column outside the region that scrolls, so the
 * option resolves and states no class here.
 */
export const defaultNativeSidebarLayoutConfig: NativeSidebarLayoutConfig = {
  side: "start",
  sidebarWidth: "md",
  stickySidebar: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    sidebarlayout: NativeSidebarLayoutConfig;
  }
}

registerNativeComponentDefaults(
  "sidebarlayout",
  defaultNativeSidebarLayoutConfig,
);

/**
 * The values the shell falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_SIDEBAR_LAYOUT_CONFIG: Required<NativeSidebarLayoutConfig> =
  {
    side: "start",
    sidebarWidth: "md",
    stickySidebar: true,
  };
