/**
 * LoadingState component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the loading
 * presentation: what it says, how dense it is, whether it is drawn as a panel
 * and how much room it claims. It registers the default configuration with the
 * component registry and provides fallback values for the cascade resolution
 * system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Size, Space } from "../../shared";

/**
 * Theme configuration options for the LoadingState component.
 *
 * Set under `components.loadingstate` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface LoadingStateConfig {
  /**
   * Text announced and shown while the region loads.
   *
   * @default "Loading"
   */
  label?: string;

  /**
   * Density of the indicator and of the label.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Whether the state is drawn as a panel.
   * A panel suits a region inside a dashboard; without one the state sits
   * directly on the page, which suits a whole-page load.
   *
   * @default false
   */
  panel?: boolean;

  /**
   * Room the state claims, so the page does not jump when the content arrives.
   *
   * @default "sm"
   */
  minHeight?: Space;
}

/**
 * Default config values registered for the LoadingState component.
 */
export const defaultLoadingStateConfig: LoadingStateConfig = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "sm",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    loadingstate: LoadingStateConfig;
  }
}

registerComponentDefaults("loadingstate", defaultLoadingStateConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_LOADING_STATE_CONFIG: Required<LoadingStateConfig> = {
  label: "Loading",
  size: "md",
  panel: false,
  minHeight: "sm",
};
