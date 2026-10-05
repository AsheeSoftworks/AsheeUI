/**
 * Dropmenu configuration for the native package.
 *
 * The options are the ones the framework's select names, so a select on native and a select
 * on the web are configured the same way. The family's visual axes are taken from the shared
 * configuration rather than restated, and what follows is native's own: the platform names
 * the unavailable state itself.
 *
 * The web's select also takes a `menu` option, which configures the floating list it renders
 * beside the trigger. It is deliberately absent here, because the platform has no floating
 * layer: the list is one surface at a time, and the option would describe something the
 * platform cannot show.
 */

import type { InputConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Dropmenu.
 *
 * `size`, `radius`, `variant`, `color` and `status` carry the meanings the shared field
 * family gives them.
 */
export interface NativeDropmenuConfig
  extends Pick<
    InputConfig,
    "size" | "radius" | "variant" | "color" | "status"
  > {
  /** Whether the select is unavailable. Defaults to false. */
  isDisabled?: boolean;

  /** Whether the select must be answered before the form is submitted. Defaults to false. */
  required?: boolean;
}

/**
 * The defaults the Dropmenu registers with the native registry.
 * The density is the shared `md` whose proportions the native scale makes touch-sized.
 */
export const defaultNativeDropmenuConfig: NativeDropmenuConfig = {
  size: "md",
  variant: "bordered",
  isDisabled: false,
  required: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    dropmenu: NativeDropmenuConfig;
  }
}

registerNativeComponentDefaults("dropmenu", defaultNativeDropmenuConfig);

/**
 * The values the select falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_DROPMENU_CONFIG: Required<NativeDropmenuConfig> = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  isDisabled: false,
  required: false,
};
