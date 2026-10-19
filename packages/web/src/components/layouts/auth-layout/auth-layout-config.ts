/**
 * AuthLayout component configuration for AsheeUI.
 *
 * This file registers the values the authentication shell defaults to on the web, so the
 * component-level tier of the theme cascade has a value to resolve. The options themselves,
 * and the types that name them, live in `@asheeui/core`: they are the framework's auth-layout
 * contract rather than a web renderer's, and the native renderer reads the same ones from the
 * same place. What stays here is the web default values and the registration that puts them in
 * the web registry.
 */

import {
  type AuthLayoutConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type {
  AuthLayoutAlign,
  AuthLayoutConfig,
  AuthLayoutMediaPosition,
} from "@asheeui/core";

/**
 * Default config values registered for the AuthLayout component.
 */
export const defaultAuthLayoutConfig: AuthLayoutConfig = {
  panel: true,
  align: "center",
  mediaPosition: "end",
  contentSize: "sm",
};

registerComponentDefaults("authlayout", defaultAuthLayoutConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_AUTH_LAYOUT_CONFIG: Required<AuthLayoutConfig> = {
  panel: true,
  align: "center",
  mediaPosition: "end",
  contentSize: "sm",
};
