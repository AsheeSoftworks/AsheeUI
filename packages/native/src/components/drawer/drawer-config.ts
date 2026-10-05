/**
 * Drawer configuration for the native package.
 *
 * The options are the ones the framework's drawer contract names, so `components.drawer` is
 * configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to
 * on the platform, and the registration that puts it in the native registry.
 */

import type { DrawerConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  DrawerConfig,
  DrawerPlacement,
  DrawerSize,
} from "@asheeui/core";

/**
 * Configuration options for the native Drawer.
 */
export type NativeDrawerConfig = DrawerConfig;

/**
 * The defaults the Drawer registers with the native registry.
 */
export const defaultNativeDrawerConfig: NativeDrawerConfig = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    drawer: NativeDrawerConfig;
  }
}

registerNativeComponentDefaults("drawer", defaultNativeDrawerConfig);

/**
 * The values the drawer falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_DRAWER_CONFIG: Required<NativeDrawerConfig> = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
};
