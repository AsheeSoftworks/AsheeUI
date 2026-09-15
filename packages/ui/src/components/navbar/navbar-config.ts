/**
 * Navbar component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Navbar pattern:
 * position, surface treatment, link alignment and nesting. It registers the
 * default configuration with the component registry and provides fallback values
 * for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { ContainerSize } from "../container/container-config";

/**
 * How the bar behaves when the page scrolls.
 *
 * - `static`: the bar scrolls away with the page.
 * - `sticky`: the bar stays at the top of the viewport.
 */
export type NavbarPosition = "static" | "sticky";

/**
 * Surface treatment of the bar.
 *
 * - `solid`: the page background, so the bar reads as part of the page.
 * - `ghost`: transparent, so the bar sits on a hero without adding a band.
 * - `bordered`: the page background with a separator below it.
 */
export type NavbarVariant = "solid" | "ghost" | "bordered";

/**
 * Where the navigation links sit in the bar.
 */
export type NavbarAlign = "start" | "center" | "end";

/**
 * Theme configuration options for the Navbar component.
 *
 * Set under `components.navbar` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface NavbarConfig {
  /** How the bar behaves when the page scrolls. @default "sticky" */
  position?: NavbarPosition;

  /** Surface treatment of the bar. @default "solid" */
  variant?: NavbarVariant;

  /** Where the navigation links sit. @default "start" */
  align?: NavbarAlign;

  /** Whether the bar wraps its content in a `Container`. @default true */
  contained?: boolean;

  /** Maximum content width of the bar. @default "lg" */
  containerSize?: ContainerSize;
}

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

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    navbar: NavbarConfig;
  }
}

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
