/**
 * Modal component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Modal
 * component, including size, position, radius, animation, and behavior
 * options. It registers the default configuration with the component
 * registry and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared";

/**
 * Position of the modal on the screen.
 * - `center`: Vertically and horizontally centered.
 * - `top`: Aligned to the top of the viewport.
 * - `bottom`: Aligned to the bottom of the viewport.
 */
export type ModalPosition = "center" | "top" | "bottom";

/**
 * Size key for the modal.
 * Controls the width of the modal dialog.
 */
export type ModalSizeKey = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Theme configuration options for the Modal component.
 *
 * Set under `components.modal` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ModalConfig {
  /**
   * Size of the modal.
   * Controls the width of the modal dialog.
   *
   * @default "md"
   */
  size?: ModalSizeKey;

  /**
   * Position of the modal on the screen.
   * Controls where the modal appears vertically.
   *
   * @default "center"
   */
  position?: ModalPosition;

  /**
   * Corner rounding of the modal.
   * Controls the border-radius of the modal content.
   *
   * @default "lg"
   */
  radius?: Radius;

  /**
   * Whether the modal has entrance and exit animations.
   * When false, the modal appears and disappears instantly.
   *
   * @default true
   */
  animated?: boolean;

  /**
   * Whether clicking on the backdrop closes the modal.
   *
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing the Escape key closes the modal.
   *
   * @default true
   */
  closeOnEscape?: boolean;
}

/**
 * Default config values registered for the Modal component.
 */
export const defaultModalConfig: ModalConfig = {
  size: "md",
  position: "center",
  animated: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_MODAL_CONFIG: Required<ModalConfig> = {
  size: "md",
  position: "center",
  radius: "lg",
  animated: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    modal: ModalConfig;
  }
}

registerComponentDefaults("modal", defaultModalConfig);
