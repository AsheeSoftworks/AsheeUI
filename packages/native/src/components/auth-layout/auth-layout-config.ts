/**
 * AuthLayout configuration for the native package.
 *
 * The options are the ones the framework's auth-layout contract names, so
 * `components.authlayout` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the renderer is
 * the value each option defaults to on the platform, and the registration that puts it in the
 * native registry.
 */

import type { AuthLayoutConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  AuthLayoutAlign,
  AuthLayoutConfig,
  AuthLayoutMediaPosition,
} from "@asheeui/core";

/**
 * Configuration options for the native AuthLayout.
 */
export type NativeAuthLayoutConfig = AuthLayoutConfig;

/**
 * The defaults the AuthLayout registers with the native registry.
 *
 * They are the web's own values: an authentication form is centred, sits on a panel and keeps
 * the framework's narrowest measure. They are registered rather than assumed, so an
 * application's `components.authlayout` entry overrides a real value on the platform too.
 */
export const defaultNativeAuthLayoutConfig: NativeAuthLayoutConfig = {
  panel: true,
  align: "center",
  mediaPosition: "end",
  contentSize: "sm",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    authlayout: NativeAuthLayoutConfig;
  }
}

registerNativeComponentDefaults("authlayout", defaultNativeAuthLayoutConfig);

/**
 * The values the shell falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_AUTH_LAYOUT_CONFIG: Required<NativeAuthLayoutConfig> =
  {
    panel: true,
    align: "center",
    mediaPosition: "end",
    contentSize: "sm",
  };
