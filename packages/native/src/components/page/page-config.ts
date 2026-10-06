/**
 * Page component configuration for the native package.
 *
 * The options are the ones the framework's page contract names, so `components.page` is
 * configured the same way on both platforms, and the types are re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value each
 * option defaults to on the platform, and the registration that puts it in the native
 * registry.
 */

import type { PageConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { PageConfig } from "@asheeui/core";

/**
 * Configuration options for the native page parts.
 */
export type NativePageConfig = PageConfig;

/**
 * The defaults the page parts register with the native registry.
 *
 * They are the web's own values. A native screen is usually narrower than a desktop window,
 * so a part stays contained and keeps the framework's default width and rhythm until an
 * application says otherwise, which is what makes a form or a settings screen read like the
 * web's page of the same shape.
 */
export const defaultNativePageConfig: NativePageConfig = {
  contained: true,
  containerSize: "lg",
  spacing: "md",
  sticky: true,
  divider: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    page: NativePageConfig;
  }
}

registerNativeComponentDefaults("page", defaultNativePageConfig);

/**
 * The values the page parts fall back to when no tier provides one.
 */
export const FALLBACK_NATIVE_PAGE_CONFIG: Required<NativePageConfig> = {
  contained: true,
  containerSize: "lg",
  spacing: "md",
  sticky: true,
  divider: true,
};
