/**
 * Drawer component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Drawer
 * component, including placement, size, animation, and behavior options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared";

/**
 * The placement of the drawer on the screen.
 * - `right`: Slides in from the right edge.
 * - `left`: Slides in from the left edge.
 * - `top`: Slides in from the top edge.
 * - `bottom`: Slides in from the bottom edge.
 */
export type DrawerPlacement = "right" | "left" | "top" | "bottom";

/**
 * The size of the drawer.
 * Can be "sm", "md", "lg", or "full" for full screen.
 */
export type DrawerSize = Size | "full";

/**
 * Theme configuration options for the Drawer component.
 *
 * Set under `components.drawer` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface DrawerConfig {
  /**
   * The size of the drawer.
   * Controls the width for left/right drawers and height for top/bottom drawers.
   *
   * @default "md"
   */
  size?: DrawerSize;

  /**
   * The placement of the drawer.
   * Determines which edge the drawer slides in from.
   *
   * @default "right"
   */
  placement?: DrawerPlacement;

  /**
   * Whether the drawer has slide animations.
   * When false, the drawer appears and disappears instantly.
   *
   * @default true
   */
  animated?: boolean;

  /**
   * Whether clicking on the overlay closes the drawer.
   *
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Whether pressing the Escape key closes the drawer.
   *
   * @default true
   */
  closeOnEsc?: boolean;
}

/**
 * Default config values registered for the Drawer component.
 */
export const defaultDrawerConfig: DrawerConfig = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_DRAWER_CONFIG: Required<DrawerConfig> = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    drawer: DrawerConfig;
  }
}

registerComponentDefaults("drawer", defaultDrawerConfig);
