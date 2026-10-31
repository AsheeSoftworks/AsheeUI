/**
 * The Container's configuration section, shared by both platforms.
 *
 * The maximum width, the gutter and the centring are the framework's questions about a column of
 * content, not a renderer's, so `components.container` means one thing on both platforms and each
 * renderer keeps only the values it lands on.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `container` here is what makes `components.container` a known configuration section on
 * every platform, without each renderer restating it.
 */

import type { ContainerSize } from "../../../shared/section-block";

/**
 * Maximum content width of a container.
 *
 * The widths are shared layout vocabulary rather than a web idea: `@asheeui/core` declares them, so
 * a band's configuration and the container itself name one type on both platforms.
 *
 * - `sm`: a single reading column.
 * - `md`: a narrow application or form column.
 * - `lg`: the default content width.
 * - `xl`: a wide application shell.
 * - `full`: no maximum width.
 */
export type { ContainerSize };

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
  size?: ContainerSize | undefined;

  /**
   * Whether to reserve a horizontal gutter.
   * The gutter widens with the viewport, so content never touches the edge on
   * a phone and never stretches to the full screen on a desktop.
   *
   * @default true
   */
  gutter?: boolean | undefined;

  /**
   * Whether to centre the content horizontally.
   * Leave this on unless the container is nested in another centring
   * element that already does it.
   *
   * @default true
   */
  centered?: boolean | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    container: ContainerConfig;
  }
}
