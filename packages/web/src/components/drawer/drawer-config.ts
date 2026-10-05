/**
 * Drawer component configuration for AsheeUI.
 * This file registers the values the Drawer component defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`: they
 * are the framework's drawer contract rather than a web renderer's, and the native
 * renderer reads the same ones from the same place.
 */

import { type DrawerConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  DrawerConfig,
  DrawerPlacement,
  DrawerSize,
} from "@asheeui/core";

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

registerComponentDefaults("drawer", defaultDrawerConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_DRAWER_CONFIG: Required<DrawerConfig> = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
};
