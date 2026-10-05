/**
 * The Modal's configuration face, shared by both platforms.
 *
 * A modal is a surface that takes the screen until the reader has dealt with it, and both
 * platforms ask it the same questions: how wide it is, where it sits vertically, how round
 * its corners are, whether it moves when it appears, and which of the platform's ways of
 * dismissing it are allowed. Those are named here, once, so `components.modal` means the same
 * thing in a web application and in a native one.
 *
 * Two of the questions are answered by the platform rather than by a preference, and the
 * vocabulary says so instead of hiding it. Dismissing by pressing outside the surface is the
 * web's backdrop click and the platform's press on the dimmed area around it. Dismissing with
 * a key is the web's Escape and the platform's own back gesture or button, `closeOnEscape`
 * naming the platform's equivalent of "there is a way out that is not a control".
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `modal` here is what makes `components.modal` a known configuration
 * section without either renderer restating it.
 */

import type { Radius } from "../shared/radius";

/**
 * Where the modal sits vertically.
 *
 * - `center`: centred, which is where a dialog belongs.
 * - `top`: aligned to the top, for a short message that should not cover the screen.
 * - `bottom`: aligned to the bottom, where the platform's own sheets live.
 */
export type ModalPosition = "center" | "top" | "bottom";

/**
 * How wide the modal is.
 *
 * The scale is the modal's own rather than the framework's three densities: a dialog
 * measures how much of the screen it is allowed, and `full` is a size a button or a field has
 * no use for.
 */
export type ModalSizeKey = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Configuration options for the Modal.
 *
 * Set under `components.modal` in the AsheeUI config. Values feed the component-level fallback
 * tier of the theme cascade.
 */
export interface ModalConfig {
  /**
   * How wide the modal is.
   *
   * @default "md"
   */
  size?: ModalSizeKey;

  /**
   * Where the modal sits vertically.
   *
   * @default "center"
   */
  position?: ModalPosition;

  /**
   * Corner rounding.
   *
   * @default "lg"
   */
  radius?: Radius;

  /**
   * Whether the modal moves when it appears and disappears.
   *
   * @default true
   */
  animated?: boolean;

  /**
   * Whether pressing the dimmed area around the modal dismisses it.
   *
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether the platform's own way out dismisses the modal.
   *
   * @default true
   */
  closeOnEscape?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    modal: ModalConfig;
  }
}
