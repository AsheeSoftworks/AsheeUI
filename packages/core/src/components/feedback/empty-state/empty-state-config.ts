/**
 * The EmptyState's configuration face, shared by both platforms.
 *
 * A region with nothing in it is presented the same way on both platforms, so the
 * questions both renderers ask about it are stated once here: the tone of the state,
 * how dense it is, whether it is drawn as a panel, and how it announces itself.
 * `components.emptystate` therefore means the same thing in a web application and in
 * a native one, and a renderer that forgets one of the options fails to compile
 * rather than quietly ignoring it.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `emptystate` here is what makes `components.emptystate` a
 * known configuration section without either renderer restating it.
 */

import type { Size } from "../../../shared/radius";
import type { ErrorStateRole } from "../error-state/error-state-config";

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
 * How an empty region announces itself.
 *
 * It is the same three levels {@link ErrorStateRole} names — and the same
 * decision — so the two states cannot describe the announcement differently:
 *
 * - `alert`: it is announced as soon as it appears, which is right for an empty
 *   result that is itself a failure the reader has to hear now.
 * - `status`: it is announced politely, which is right for a state that replaced
 *   content after a query.
 * - `none`: it is not announced, which is right for a state that was part of the
 *   page's initial markup.
 *
 * {@link ErrorStateRole} is the same vocabulary; it is aliased here so the empty
 * region's option reads with its own name.
 */
export type EmptyStateRole = ErrorStateRole;

/**
 * Configuration options for the EmptyState.
 *
 * Set under `components.emptystate` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface EmptyStateConfig {
  /**
   * Tone of the state.
   *
   * @default "info"
   */
  type?: EmptyStateType | undefined;

  /**
   * Density of the state.
   *
   * @default "md"
   */
  size?: Size | undefined;

  /**
   * Whether the state is drawn as a panel.
   * A panel suits a region inside a dashboard; without one the state sits directly
   * on the page, which suits a whole-page empty view.
   *
   * @default false
   */
  panel?: boolean | undefined;

  /**
   * How the state is announced.
   *
   * The announcement is a decision about timing, so it is configurable the same
   * way `ErrorState`'s is: a product that renders its empty states in response to
   * a search can state `status` once. Leave it at `none` for states that are part
   * of a page's first markup, because announcing those describes a change that
   * never happened.
   *
   * @default "none"
   */
  role?: EmptyStateRole | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    emptystate: EmptyStateConfig;
  }
}
