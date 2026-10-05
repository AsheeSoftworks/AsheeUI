/**
 * Toast configuration for the native package.
 *
 * The options are the ones the framework's toast contract names, so
 * `components.toast` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the registration
 * that puts it in the native registry.
 *
 * `portal` is the one option left out: the web renders its messages into the document
 * through a portal, and the platform has no document to render into. Leaving it out is
 * what keeps a native configuration from stating something that could not mean
 * anything here.
 */

import {
  TOAST_FALLBACK_MAX_TOASTS,
  TOAST_FALLBACK_TIMEOUT_MS,
  type ToastConfig,
} from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  ToastConfig,
  ToastItemData,
  ToastPlacement,
  ToastShowOptions,
  ToastType,
} from "@asheeui/core";

/**
 * Configuration options for the native Toast system.
 */
export type NativeToastConfig = Omit<ToastConfig, "portal">;

/**
 * The defaults the Toast registers with the native registry.
 *
 * The placement is pinned to the bottom centre, which is where the platform itself
 * puts a transient notice and where a thumb already is, rather than inherited from the
 * web's top-right: a default is a statement about the platform, and this is the
 * platform's answer.
 */
export const defaultNativeToastConfig: NativeToastConfig = {
  size: "md",
  placement: "bottom-center",
  variant: "bordered",
  radius: "md",
  animated: true,
  defaultTimeout: TOAST_FALLBACK_TIMEOUT_MS,
  maxToasts: TOAST_FALLBACK_MAX_TOASTS,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    toast: NativeToastConfig;
  }
}

registerNativeComponentDefaults("toast", defaultNativeToastConfig);

/**
 * The values the system falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_TOAST_CONFIG: Required<NativeToastConfig> = {
  size: "md",
  placement: "bottom-center",
  variant: "bordered",
  radius: "md",
  animated: true,
  defaultTimeout: TOAST_FALLBACK_TIMEOUT_MS,
  maxToasts: TOAST_FALLBACK_MAX_TOASTS,
};
