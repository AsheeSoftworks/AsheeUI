/**
 * Drawer component configuration for AsheeUI.
 * This file registers the values the Drawer component defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`: they
 * are the framework's drawer contract rather than a web renderer's, and the native
 * renderer reads the same ones from the same place.
 */

import {
  type Concrete,
  type DrawerConfig,
  type DrawerConfigOptions,
  registerComponentDefaults,
} from "@asheeui/core";

export type {
  DrawerConfig,
  DrawerConfigOptions,
  DrawerPlacement,
  DrawerSize,
} from "@asheeui/core";

/**
 * Default config values registered for the Drawer component.
 *
 * The dismissal switches are registered under their deprecated spelling on
 * purpose. Registering the canonical name instead would put a defined
 * `closeOnBackdropClick` in every merged section, which would shadow a
 * consumer's `closeOnOverlayClick: false` before the aliases are consulted;
 * registering one spelling keeps the other one's absence visible to the
 * resolver, and the values are the same either way.
 */
export const defaultDrawerConfig: DrawerConfigOptions = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
};

registerComponentDefaults("drawer", defaultDrawerConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 *
 * The deprecated fields keep the shape this export has always had; the
 * canonical fields state the same values under the names the component
 * resolves, so neither spelling can fall through to `undefined`.
 */
export const FALLBACK_DRAWER_CONFIG: Concrete<DrawerConfig> & {
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
} = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
};
