/**
 * AuthLayout component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the authentication
 * page shell: panel treatment, content alignment, media position and content
 * width. It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { ContainerSize } from "../container/container-config";

/**
 * Theme configuration options for the AuthLayout component.
 *
 * Set under `components.authlayout` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface AuthLayoutConfig {
  /**
   * Whether the form is drawn on a panel.
   * A panel suits a page that also shows product media; without one the form
   * sits directly on the page background.
   *
   * @default true
   */
  panel?: boolean;

  /** Vertical alignment of the form column. @default "center" */
  align?: "center" | "start";

  /**
   * Side the media column sits on from the `lg` breakpoint upwards.
   *
   * @default "end"
   */
  mediaPosition?: "start" | "end";

  /** Maximum width of the form column. @default "sm" */
  contentSize?: ContainerSize;
}

/**
 * Default config values registered for the AuthLayout component.
 */
export const defaultAuthLayoutConfig: AuthLayoutConfig = {
  panel: true,
  align: "center",
  mediaPosition: "end",
  contentSize: "sm",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    authlayout: AuthLayoutConfig;
  }
}

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
