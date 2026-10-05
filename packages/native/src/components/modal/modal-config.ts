/**
 * Modal configuration for the native package.
 *
 * The options are the ones the framework's modal contract names, so `components.modal` is
 * configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to
 * on the platform, and the registration that puts it in the native registry.
 *
 * The defaults are the web's, which is worth stating: a dialog is centred, as wide as the
 * middle of the modal scale, and animated, on either platform. What the platform decides is
 * what "dismissing" means, which is the platform's own way out rather than a key.
 */

import type { ModalConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  ModalConfig,
  ModalPosition,
  ModalSizeKey,
} from "@asheeui/core";

/**
 * Configuration options for the native Modal.
 */
export type NativeModalConfig = ModalConfig;

/**
 * The defaults the Modal registers with the native registry.
 */
export const defaultNativeModalConfig: NativeModalConfig = {
  size: "md",
  position: "center",
  animated: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    modal: NativeModalConfig;
  }
}

registerNativeComponentDefaults("modal", defaultNativeModalConfig);

/**
 * The values the modal falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_MODAL_CONFIG: Required<NativeModalConfig> = {
  size: "md",
  position: "center",
  radius: "lg",
  animated: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
};
