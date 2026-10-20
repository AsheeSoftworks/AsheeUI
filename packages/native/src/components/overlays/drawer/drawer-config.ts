/**
 * Drawer configuration for the native package.
 *
 * The options are the ones the framework's drawer contract names, so `components.drawer` is
 * configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to
 * on the platform, and the registration that puts it in the native registry.
 *
 * The two dismissal switches are accepted under both spellings: the canonical
 * `closeOnBackdropClick` / `closeOnEscape` the modal uses, and the drawer's older
 * `closeOnOverlayClick` / `closeOnEsc`, which stay as deprecated aliases.
 */

import type { DrawerConfigOptions } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type {
  DrawerConfig,
  DrawerConfigOptions,
  DrawerPlacement,
  DrawerSize,
} from "@asheeui/core";

/**
 * Configuration options for the native Drawer.
 *
 * `closeOnBackdropClick` and `closeOnEscape` are the canonical dismissal names, shared with
 * the Modal; `closeOnOverlayClick` and `closeOnEsc` remain accepted as their deprecated
 * aliases, so either spelling configures the drawer.
 */
export type NativeDrawerConfig = DrawerConfigOptions;

/**
 * The defaults the Drawer registers with the native registry.
 *
 * The dismissal switches are registered under their deprecated spelling on purpose, the way
 * the web drawer registers them. Registering `closeOnBackdropClick` instead would put a
 * defined value in every merged section and would shadow a consumer's
 * `closeOnOverlayClick: false` before the renderer consults the aliases; registering one
 * spelling keeps the other one's absence visible to the resolution. The values are the same
 * either way.
 */
export const defaultNativeDrawerConfig: NativeDrawerConfig = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    drawer: NativeDrawerConfig;
  }
}

registerNativeComponentDefaults("drawer", defaultNativeDrawerConfig);

/**
 * The values the drawer falls back to when no tier provides one.
 *
 * Both spellings of each switch are stated, so neither can fall through to `undefined`: the
 * renderer reads the canonical name first, the deprecated alias second, and this is the last
 * tier either of them can reach.
 */
export const FALLBACK_NATIVE_DRAWER_CONFIG = {
  size: "md",
  placement: "right",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
} satisfies NativeDrawerConfig;
