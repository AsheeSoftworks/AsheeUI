/**
 * Modal component configuration for AsheeUI.
 * This file registers the values the Modal component defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`: they
 * are the framework's modal contract rather than a web renderer's, and the native
 * renderer reads the same ones from the same place.
 */

import { type ModalConfig, registerComponentDefaults } from "@asheeui/core";

export type { ModalConfig, ModalPosition, ModalSizeKey } from "@asheeui/core";

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

registerComponentDefaults("modal", defaultModalConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_MODAL_CONFIG: Required<ModalConfig> = {
  size: "md",
  position: "center",
  radius: "lg",
  animated: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
} as const;
