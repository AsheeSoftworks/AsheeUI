/**
 * Navbar configuration for the native package.
 *
 * The options are the ones the framework's navbar contract names, so `components.navbar` is
 * configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to on
 * the platform, and the registration that puts it in the native registry.
 */

import type { NavbarConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  NavbarAlign,
  NavbarConfig,
  NavbarLink,
  NavbarLinkItem,
  NavbarPosition,
  NavbarVariant,
} from "@asheeui/core";

/**
 * Configuration options for the native Navbar.
 */
export type NativeNavbarConfig = NavbarConfig;

/**
 * The defaults the Navbar registers with the native registry.
 *
 * They are the web's own values, with one difference in meaning rather than in value: `sticky` is
 * the web's way of pinning a bar to the top of a viewport, and a native bar is pinned by the screen
 * that places it outside its scrolling region, so the option resolves and states no class here.
 */
export const defaultNativeNavbarConfig: NativeNavbarConfig = {
  position: "sticky",
  variant: "solid",
  align: "start",
  contained: true,
  containerSize: "lg",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    navbar: NativeNavbarConfig;
  }
}

registerNativeComponentDefaults("navbar", defaultNativeNavbarConfig);

/**
 * The values the bar falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_NAVBAR_CONFIG: Required<NativeNavbarConfig> = {
  position: "sticky",
  variant: "solid",
  align: "start",
  contained: true,
  containerSize: "lg",
};
