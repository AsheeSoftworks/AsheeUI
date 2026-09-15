/**
 * EmptyState component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the EmptyState
 * pattern: the tone of the state and its density. It registers the default
 * configuration with the component registry and provides fallback values for the
 * cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared";

/**
 * The tone of an empty region.
 *
 * - `info`: nothing is here yet, which is expected.
 * - `success`: the region is empty because the work finished.
 * - `warning`: the region is empty and something needs attention.
 * - `error`: the region could not be filled because something failed.
 */
export type EmptyStateType = "info" | "success" | "warning" | "error";

/**
 * Theme configuration options for the EmptyState component.
 *
 * Set under `components.emptystate` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface EmptyStateConfig {
  /** Tone of the state. @default "info" */
  type?: EmptyStateType;

  /** Density of the state. @default "md" */
  size?: Size;

  /**
   * Whether the state is drawn as a panel.
   * A panel suits a region inside a dashboard; without one the state sits
   * directly on the page, which suits a whole-page empty view.
   *
   * @default false
   */
  panel?: boolean;
}

/**
 * Default config values registered for the EmptyState component.
 */
export const defaultEmptyStateConfig: EmptyStateConfig = {
  type: "info",
  size: "md",
  panel: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    emptystate: EmptyStateConfig;
  }
}

registerComponentDefaults("emptystate", defaultEmptyStateConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_EMPTY_STATE_CONFIG: Required<EmptyStateConfig> = {
  type: "info",
  size: "md",
  panel: false,
};
