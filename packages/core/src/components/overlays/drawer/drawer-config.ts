/**
 * The Drawer's configuration face, shared by both platforms.
 *
 * A drawer is a panel that comes in from an edge and takes part of the screen until the
 * reader is done with it, and both platforms ask it the same questions: how big it is, which
 * edge it comes from, whether it moves, and which of the platform's ways of dismissing it are
 * allowed. Those are named here, once, so `components.drawer` means the same thing in a web
 * application and in a native one.
 *
 * What the platform does with the edge is its own decision and is recorded rather than hidden:
 * a web drawer is a panel at the side of the page, and a platform drawer is the sheet the
 * platform already uses for this, which comes from an edge a thumb can reach. The vocabulary
 * is shared; the shape of the panel is the platform's.
 *
 * The drawer's two dismissal switches are named the way the modal names them:
 * `closeOnBackdropClick` and `closeOnEscape`. The drawer used to spell them
 * `closeOnOverlayClick` and `closeOnEsc`, and those remain as deprecated aliases so existing
 * code keeps working. `DrawerConfig` itself keeps the old spelling because the native
 * renderer still reads (and registers) it; `DrawerConfigOptions` adds the canonical names,
 * which is the shape `components.drawer` accepts on the web.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `drawer` here is what makes `components.drawer` a known
 * configuration section without either renderer restating it.
 */

import type { Size } from "../../../shared/radius";

/**
 * The edge a drawer comes from.
 */
export type DrawerPlacement = "right" | "left" | "top" | "bottom";

/**
 * How much of the screen a drawer takes.
 *
 * The framework's three densities, plus the whole screen, which is a size a drawer has a use
 * for and a field does not.
 */
export type DrawerSize = Size | "full";

/**
 * Configuration options for the Drawer.
 *
 * Set under `components.drawer` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface DrawerConfig {
  /**
   * How much of the screen the drawer takes.
   *
   * @default "md"
   */
  size?: DrawerSize | undefined;

  /**
   * The edge the drawer comes from.
   *
   * @default "right"
   */
  placement?: DrawerPlacement | undefined;

  /**
   * Whether the drawer moves when it appears and disappears.
   *
   * @default true
   */
  animated?: boolean | undefined;

  /**
   * Whether pressing the dimmed area around the drawer dismisses it.
   *
   * Deprecated alias of `closeOnBackdropClick`, the canonical name the drawer
   * shares with the modal. Kept because the native renderer still registers and
   * reads this spelling; prefer the canonical name in new code.
   *
   * @default true
   * @deprecated Use `closeOnBackdropClick`.
   */
  closeOnOverlayClick?: boolean | undefined;

  /**
   * Whether the platform's own way out dismisses the drawer.
   *
   * Deprecated alias of `closeOnEscape`, the canonical name the drawer shares
   * with the modal. Kept because the native renderer still registers and reads
   * this spelling; prefer the canonical name in new code.
   *
   * @default true
   * @deprecated Use `closeOnEscape`.
   */
  closeOnEsc?: boolean | undefined;
}

/**
 * The drawer options `components.drawer` accepts on the web.
 *
 * This is `DrawerConfig` plus the canonical dismissal names, which both layers
 * now spell the same way. The deprecated aliases on `DrawerConfig` stay valid,
 * so either spelling configures the web drawer.
 */
export interface DrawerConfigOptions extends DrawerConfig {
  /**
   * Whether pressing the dimmed area around the drawer dismisses it.
   *
   * The canonical spelling, shared with the modal; prefer it over the
   * deprecated `closeOnOverlayClick` alias.
   *
   * @default true
   */
  closeOnBackdropClick?: boolean | undefined;

  /**
   * Whether the platform's own way out dismisses the drawer.
   *
   * The canonical spelling, shared with the modal; prefer it over the
   * deprecated `closeOnEsc` alias.
   *
   * @default true
   */
  closeOnEscape?: boolean | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    drawer: DrawerConfigOptions;
  }
}
