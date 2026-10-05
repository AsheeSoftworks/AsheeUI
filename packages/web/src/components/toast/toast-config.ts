/**
 * Toast component configuration for AsheeUI.
 * This file registers the values the toast system defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`:
 * they are the framework's toast contract rather than a web renderer's, and the
 * native renderer reads the same ones from the same place. So does the patience of
 * the queue: how long a message waits and how many may wait at once are shared
 * values, because they are decisions about a reader's attention.
 */

import {
  registerComponentDefaults,
  TOAST_FALLBACK_MAX_TOASTS,
  TOAST_FALLBACK_TIMEOUT_MS,
  type ToastConfig,
} from "@asheeui/core";

export type {
  ToastConfig,
  ToastItemData,
  ToastPlacement,
  ToastShowOptions,
  ToastType,
} from "@asheeui/core";

/**
 * Default config values registered for the Toast component.
 */
export const defaultToastConfig: ToastConfig = {
  size: "md",
  placement: "top-right",
  variant: "bordered",
  radius: "md",
  animated: true,
  defaultTimeout: TOAST_FALLBACK_TIMEOUT_MS,
  maxToasts: TOAST_FALLBACK_MAX_TOASTS,
  portal: true,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_TOAST_CONFIG = {
  size: "md",
  placement: "top-right",
  variant: "solid",
  radius: "md",
  animated: true,
  defaultTimeout: TOAST_FALLBACK_TIMEOUT_MS,
  maxToasts: TOAST_FALLBACK_MAX_TOASTS,
  portal: true,
} as const;

registerComponentDefaults("toast", defaultToastConfig);
