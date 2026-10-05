/**
 * The EmptyState's configuration face, shared by both platforms.
 *
 * A region with nothing in it is presented the same way on both platforms, so the
 * three questions both renderers ask about it are stated once here: the tone of the
 * state, how dense it is, and whether it is drawn as a panel. `components.emptystate`
 * therefore means the same thing in a web application and in a native one, and a
 * renderer that forgets one of the options fails to compile rather than quietly
 * ignoring it.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `emptystate` here is what makes `components.emptystate` a
 * known configuration section without either renderer restating it.
 */

import type { Size } from "../../shared/radius";

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
  type?: EmptyStateType;

  /**
   * Density of the state.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Whether the state is drawn as a panel.
   * A panel suits a region inside a dashboard; without one the state sits directly
   * on the page, which suits a whole-page empty view.
   *
   * @default false
   */
  panel?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    emptystate: EmptyStateConfig;
  }
}
