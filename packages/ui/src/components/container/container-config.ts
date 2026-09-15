/**
 * Container component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Container
 * layout primitive, including its maximum width, gutter and centring
 * behaviour. It registers the default configuration with the component
 * registry and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";

/**
 * Maximum content width of a container.
 *
 * - `sm`: a single reading column.
 * - `md`: a narrow application or form column.
 * - `lg`: the default content width.
 * - `xl`: a wide application shell.
 * - `full`: no maximum width.
 */
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Theme configuration options for the Container component.
 *
 * Set under `components.container` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ContainerConfig {
  /**
   * Maximum content width.
   *
   * @default "lg"
   */
  size?: ContainerSize;

  /**
   * Whether to reserve a horizontal gutter.
   * The gutter widens with the viewport, so content never touches the edge on
   * a phone and never stretches to the full screen on a desktop.
   *
   * @default true
   */
  gutter?: boolean;

  /**
   * Whether to centre the content horizontally.
   * Leave this on unless the container is nested in another centring
   * element that already does it.
   *
   * @default true
   */
  centered?: boolean;
}

/**
 * Default config values registered for the Container component.
 */
export const defaultContainerConfig: ContainerConfig = {
  size: "lg",
  gutter: true,
  centered: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    container: ContainerConfig;
  }
}

registerComponentDefaults("container", defaultContainerConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CONTAINER_CONFIG: Required<ContainerConfig> = {
  size: "lg",
  gutter: true,
  centered: true,
};
