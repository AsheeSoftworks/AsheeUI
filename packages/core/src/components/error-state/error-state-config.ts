/**
 * The ErrorState's configuration face, shared by both platforms.
 *
 * A region whose content could not be loaded is presented the same way on both
 * platforms, so its options are stated once here: how dense it is, whether it is
 * drawn as a panel, how it announces itself, and what its two controls are called.
 * `components.errorstate` therefore means the same thing in a web application and in
 * a native one.
 *
 * The role is part of the shared vocabulary rather than of a renderer because it is
 * a decision about the message rather than about the platform: a failure that
 * replaced content after a request has to be announced, and a not-found page that
 * was part of the page from the start must not be. Each renderer says it in its own
 * words — a live region on the web, a live region and a role on the platform.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `errorstate` here is what makes `components.errorstate` a
 * known configuration section without either renderer restating it.
 */

import type { Size } from "../../shared/radius";

/**
 * How the failed region announces itself.
 *
 * - `alert`: it is announced as soon as it appears, which is right when it replaces
 *   content after a request failed.
 * - `status`: it is announced politely, which is right when the failure is not the
 *   result of the reader's last action.
 * - `none`: it is not announced, which is right when it is part of the page's
 *   initial markup, such as a not-found page.
 */
export type ErrorStateRole = "alert" | "status" | "none";

/**
 * Configuration options for the ErrorState.
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

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    errorstate: ErrorStateConfig;
  }
}
