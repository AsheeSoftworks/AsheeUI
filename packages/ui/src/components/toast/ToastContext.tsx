/**
 * Toast context and hook for AsheeUI.
 * This file provides the ToastContext and useToast hook for accessing
 * toast functionality throughout the application.
 */

import { createContext, type ReactNode, useContext } from "react";
import type { Radius, Size, Variant } from "../../shared";
import type {
  ToastItemData,
  ToastPlacement,
  ToastShowOptions,
} from "./toast-config";

// ─── Context Interface ──────────────────────────────────────────────────────

/**
 * Context type for the toast system.
 * Provides methods for showing and managing toast notifications.
 */
export interface ToastContextType {
  /**
   * Array of currently active toast items.
   */
  toasts: ToastItemData[];

  /**
   * Show a toast with the given options.
   * Returns the toast ID.
   */
  toast: (options: ToastShowOptions | string) => string;

  /**
   * Show a success toast.
   * Returns the toast ID.
   */
  success: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /**
   * Show an error toast.
   * Returns the toast ID.
   */
  error: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /**
   * Show an info toast.
   * Returns the toast ID.
   */
  info: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /**
   * Show a warning toast.
   * Returns the toast ID.
   */
  warning: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;

  /**
   * Remove a toast by ID.
   */
  removeToast: (id: string) => void;

  /**
   * Clear all active toasts.
   */
  clearToasts: () => void;

  /**
   * The portal target element for toast rendering.
   * When portal is enabled, toasts are rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;

  /**
   * The default placement for toasts.
   */
  defaultPlacement: ToastPlacement;

  /**
   * The default size for toasts.
   */
  defaultSize: Size;

  /**
   * The default variant for toasts.
   */
  defaultVariant: Variant;

  /**
   * The default radius for toasts.
   */
  defaultRadius: Radius;

  /**
   * Whether toasts are animated by default.
   */
  defaultAnimated: boolean;
}

// ─── Context ────────────────────────────────────────────────────────────────

export const ToastContext = createContext<ToastContextType | null>(null);

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Hook for accessing the toast system.
 *
 * useToast returns methods for showing toast notifications with
 * different types (success, error, info, warning). Each toast can be
 * customized with its own size, placement, variant, radius, and animation
 * settings. Must be used within a ToastProvider component.
 *
 * @returns The toast context with methods for showing and managing toasts.
 *         If used outside a ToastProvider, returns safe fallback methods.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleClick = () => {
 *     toast.success("Saved successfully!");
 *   };
 *
 *   return <button onClick={handleClick}>Save</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Customize individual toast appearance
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const showCustomToast = () => {
 *     toast.info("Custom notification", {
 *       placement: "bottom-left",
 *       size: "lg",
 *       variant: "solid",
 *       radius: "full",
 *       animated: false,
 *       timeout: 5000,
 *     });
 *   };
 *
 *   return <button onClick={showCustomToast}>Show Custom Toast</button>;
 * }
 * ```
 *
 * @see ToastProvider - The provider component that enables the toast system.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      toast: () => "",
      success: () => "",
      error: () => "",
      info: () => "",
      warning: () => "",
      removeToast: () => {},
      clearToasts: () => {},
      portalTarget: null,
      defaultPlacement: "top-right" as ToastPlacement,
      defaultSize: "md" as Size,
      defaultVariant: "bordered" as Variant,
      defaultRadius: "md" as Radius,
      defaultAnimated: true,
    };
  }
  return context;
}
