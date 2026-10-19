/**
 * Toast context and hook for the native package.
 *
 * The context is the same one the web exposes, with one omission: the platform has no
 * document, so there is no portal target to hand out. Everything else a consumer
 * relies on is here — the queue, the four conveniences, removal, clearing, and the
 * defaults the provider resolved — so a screen that shows a message is written the
 * same way on either platform.
 *
 * The hook answers outside a provider rather than throwing, which is what the web hook
 * does: a component that shows a message is often shared with an application that has
 * not wrapped its tree in a provider, and a screen that fails because a message could
 * not be shown would be a worse answer than a message that is quietly dropped.
 */

import type { Radius, Size, Variant } from "@asheeui/core";
import { createContext, type ReactNode, useContext } from "react";
import type {
  ToastItemData,
  ToastPlacement,
  ToastShowOptions,
} from "./toast-config";

/**
 * Context type for the toast system.
 * Provides methods for showing and managing toast notifications.
 */
export interface ToastContextType {
  /** The messages currently waiting. */
  toasts: ToastItemData[];

  /** Show a message with the given options. Returns its identifier. */
  toast: (options: ToastShowOptions | string) => string;

  /** Show a success message. */
  success: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /** Show a failure message. */
  error: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /** Show an informational message. */
  info: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /** Show a warning message. */
  warning: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /** Remove a message by its identifier. */
  removeToast: (id: string) => void;

  /** Remove every message. */
  clearToasts: () => void;

  /** The placement the provider resolved. */
  defaultPlacement: ToastPlacement;

  /** The density the provider resolved. */
  defaultSize: Size;

  /** The treatment the provider resolved. */
  defaultVariant: Variant;

  /** The corner rounding the provider resolved. */
  defaultRadius: Radius;

  /** Whether messages animate by default. */
  defaultAnimated: boolean;
}

/**
 * The context itself. `null` means no provider, which the hook answers rather than
 * throwing.
 */
export const ToastContext = createContext<ToastContextType | null>(null);

/**
 * Read the toast system.
 *
 * @returns The toast context, or a set of methods that do nothing when there is no
 * provider above the component.
 *
 * @example
 * ```tsx
 * function SaveInvoice() {
 *   const toast = useToast();
 *
 *   return <Button onPress={() => toast.success("Invoice saved")}>Save</Button>;
 * }
 * ```
 *
 * @see ToastProvider - The provider that makes the system work.
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);

  if (context) {
    return context;
  }

  return {
    toasts: [],
    toast: () => "",
    success: () => "",
    error: () => "",
    info: () => "",
    warning: () => "",
    removeToast: () => {},
    clearToasts: () => {},
    defaultPlacement: "bottom-center",
    defaultSize: "md",
    defaultVariant: "bordered",
    defaultRadius: "md",
    defaultAnimated: true,
  };
}
