/**
 * Navbar component configuration for AsheeUI.
 *
 * This file registers the values the bar defaults to on the web, so the component-level tier of the
 * theme cascade has a value to resolve. The options themselves, the types that name them and the
 * destination types live in `@asheeui/core`: they are the framework's navbar contract rather than a
 * web renderer's, and the native renderer reads the same ones from the same place. What stays here
 * is the web default values and the registration that puts them in the web registry.
 */

import { type NavbarConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  NavbarAlign,
  NavbarConfig,
  NavbarLink,
  NavbarLinkItem,
  NavbarPosition,
  NavbarVariant,
} from "@asheeui/core";

/**
 * Default config values registered for the Navbar component.
 */
export const defaultNavbarConfig: NavbarConfig = {
  position: "sticky",
  variant: "solid",
  align: "start",
  contained: true,
  containerSize: "lg",
};

registerComponentDefaults("navbar", defaultNavbarConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_NAVBAR_CONFIG: Required<NavbarConfig> = {
  position: "sticky",
  variant: "solid",
  align: "start",
  contained: true,
  containerSize: "lg",
};
