/**
 * The LoadingState's configuration face, shared by both platforms.
 *
 * A region whose content has not arrived yet is presented the same way on both
 * platforms, and the four questions both renderers ask about it are stated once
 * here: what it says, how dense it is, whether it is drawn as a panel, and how much
 * room it claims before its content arrives.
 *
 * The room it claims is a shared spacing token rather than a height a renderer
 * invented, which is what keeps "the page does not jump when the content arrives"
 * true on either platform: both read the same step of the same scale.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `loadingstate` here is what makes `components.loadingstate`
 * a known configuration section without either renderer restating it.
 */

import type { Size } from "../../shared/radius";
import type { Space } from "../../shared/spacing";

/**
 * Configuration options for the LoadingState.
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
   * A panel suits a region inside a dashboard; without one the state sits directly
   * on the page, which suits a whole-page load.
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

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    loadingstate: LoadingStateConfig;
  }
}
