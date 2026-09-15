/**
 * ErrorState component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the failed-region
 * presentation: how dense it is, whether it is drawn as a panel, whether it is
 * announced as a change, and what its retry control and its technical detail are
 * called. It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared";

/**
 * How the failed region announces itself.
 *
 * - `alert`: it is announced as soon as it appears, which is right when it
 *   replaces content after a request failed.
 * - `status`: it is announced politely, which is right when the failure is not
 *   the result of the reader's last action.
 * - `none`: it is not announced, which is right when it is part of the page's
 *   initial markup, such as a not-found page.
 */
export type ErrorStateRole = "alert" | "status" | "none";

/**
 * Theme configuration options for the ErrorState component.
 *
 * Set under `components.errorstate` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface ErrorStateConfig {
  /**
   * Density of the state.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Whether the state is drawn as a panel.
   *
   * @default true
   */
  panel?: boolean;

  /**
   * How the state is announced.
   *
   * @default "alert"
   */
  role?: ErrorStateRole;

  /**
   * Wording of the retry control.
   *
   * @default "Try again"
   */
  retryLabel?: string;

  /**
   * Wording of the disclosure that holds the technical detail.
   *
   * @default "Technical details"
   */
  detailLabel?: string;
}

/**
 * Default config values registered for the ErrorState component.
 * A panel and an announcement are the defaults because this state usually
 * replaces a region after a request failed.
 */
export const defaultErrorStateConfig: ErrorStateConfig = {
  size: "md",
  panel: true,
  role: "alert",
  retryLabel: "Try again",
  detailLabel: "Technical details",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    errorstate: ErrorStateConfig;
  }
}

registerComponentDefaults("errorstate", defaultErrorStateConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_ERROR_STATE_CONFIG: Required<ErrorStateConfig> = {
  size: "md",
  panel: true,
  role: "alert",
  retryLabel: "Try again",
  detailLabel: "Technical details",
};
