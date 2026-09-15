/**
 * Centered component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Centered layout
 * primitive: the axis it centres on, how much vertical room it reserves, and
 * whether it holds its content in a Container. It registers the default
 * configuration with the component registry and provides fallback values for the
 * cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";
import type { ContainerSize } from "../container/container-config";

/**
 * The axes a Centered block can centre on.
 *
 * - `both`: centres horizontally and vertically, the arrangement a sign-in card
 *   or an empty page wants.
 * - `horizontal`: centres sideways only, for a heading or a single control.
 * - `vertical`: centres vertically only, when the block's own width is intended.
 */
export type CenteredAxis = "both" | "horizontal" | "vertical";

/**
 * Theme configuration options for the Centered component.
 *
 * Set under `components.centered` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface CenteredConfig {
  /**
   * The axis the content is centred on.
   *
   * @default "both"
   */
  axis?: CenteredAxis;

  /**
   * Vertical room the block reserves before centring.
   * A block that is as tall as its content cannot be centred vertically, so a
   * consumer chooses how much height the block claims.
   *
   * @default "none"
   */
  minHeight?: Space;

  /**
   * Whether the content is held in a {@link Container}.
   * Use it when the centred content is a whole page region rather than a single
   * control, so the content keeps a readable maximum width.
   *
   * @default false
   */
  contained?: boolean;

  /**
   * Maximum content width when `contained` is on.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize;
}

/**
 * Default config values registered for the Centered component.
 * The axis and the container width are pinned; the height is not, because a
 * block that reserves height by default would add space to every layout.
 */
export const defaultCenteredConfig: CenteredConfig = {
  axis: "both",
  contained: false,
  containerSize: "lg",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    centered: CenteredConfig;
  }
}

registerComponentDefaults("centered", defaultCenteredConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CENTERED_CONFIG: Required<CenteredConfig> = {
  axis: "both",
  minHeight: "none",
  contained: false,
  containerSize: "lg",
};
