/**
 * Toast provider and hook for AsheeUI.
 * This file provides the ToastProvider component and useToast hook
 * for managing toast notifications throughout the application. The
 * provider manages the toast queue, rendering, and dismissal logic,
 * while the hook provides methods for showing toasts with different
 * types and configurations.
 */
"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Size, Variant } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import { ToastItem } from "./ToastItem";
import {
  FALLBACK_TOAST_CONFIG,
  type ToastConfig,
  type ToastItemData,
  type ToastPlacement,
} from "./toast-config";

// ─── Context Interface ────────────────────────────────────────────────────────

/**
 * Options for showing a toast notification.
 * Extends ToastItemData but makes id optional.
 */
export interface ToastShowOptions extends Omit<ToastItemData, "id"> {
  /**
   * Optional unique identifier for the toast.
   * If not provided, a random ID is generated.
   */
  id?: string;
}

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
}

const ToastContext = createContext<ToastContextType | null>(null);

// ─── Component Props ──────────────────────────────────────────────────────────

/**
 * Props for the ToastProvider component.
 * Extends ToastConfig with children and className.
 */
export interface ToastProviderProps extends ToastConfig {
  /**
   * Child components to render.
   */
  children: ReactNode;

  /**
   * Extra classes for the toast container.
   */
  className?: string;
}

// ─── Provider Component ───────────────────────────────────────────────────────

/**
 * Provider component for the toast notification system.
 *
 * ToastProvider wraps your application and provides toast notification
 * functionality through the useToast hook. It manages the toast queue,
 * rendering, and dismissal logic, and automatically positions toasts
 * based on the configured placement.
 *
 * @param props - ToastProvider configuration options.
 * @param props.children - Child components.
 * @param props.size - Size scale of toasts. Defaults to "md".
 * @param props.placement - Placement of toasts. Defaults to "top-right".
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.defaultTimeout - Default timeout in ms. Defaults to 3500.
 * @param props.maxToasts - Maximum number of toasts. Defaults to 5.
 * @param props.animated - Whether toasts have animations. Defaults to true.
 * @param props.className - Extra classes for the toast container.
 *
 * @example
 * ```tsx
 * import { ToastProvider, useToast } from "asheeui";
 *
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <MyComponent />
 *     </ToastProvider>
 *   );
 * }
 *
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   return (
 *     <button onClick={() => toast.success("Operation successful!")}>
 *       Show Toast
 *     </button>
 *   );
 * }
 * ```
 *
 * @see useToast - Hook for showing toast notifications.
 * @see ToastConfig - The configuration type for the toast system.
 */
export function ToastProvider({
  children,
  size,
  placement,
  variant,
  radius,
  defaultTimeout,
  maxToasts,
  animated,
  className,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const config = useAsheeConfig();
  const sectionConfig = config.components?.toast;

  // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

  const resolvedSizeKey = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_TOAST_CONFIG.size,
  );

  const resolvedPlacement = resolveCascade<ToastPlacement>(
    placement,
    sectionConfig?.placement,
    undefined,
    FALLBACK_TOAST_CONFIG.placement,
  );

  const resolvedVariantKey = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant,
    FALLBACK_TOAST_CONFIG.variant,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_TOAST_CONFIG.radius,
  );

  const resolvedMaxToasts = resolveCascade<number>(
    maxToasts,
    sectionConfig?.maxToasts,
    undefined,
    FALLBACK_TOAST_CONFIG.maxToasts,
  );

  const resolvedDefaultTimeout = resolveCascade<number>(
    defaultTimeout,
    sectionConfig?.defaultTimeout,
    undefined,
    FALLBACK_TOAST_CONFIG.defaultTimeout,
  );

  const resolvedAnimated = resolveCascade<boolean>(
    animated,
    sectionConfig?.animated,
    undefined,
    FALLBACK_TOAST_CONFIG.animated,
  );

  // ─── 2. Toast State Handlers ──────────────────────────────────────────────

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (options: ToastShowOptions | string) => {
      const id =
        typeof options === "object" && options.id
          ? options.id
          : typeof window !== "undefined" && window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : String(Date.now());

      const newItem: ToastItemData =
        typeof options === "string"
          ? {
              id,
              message: options,
              timeout: resolvedDefaultTimeout,
              type: "info",
            }
          : {
              ...options,
              id,
              timeout: options.timeout ?? resolvedDefaultTimeout,
              type: options.type ?? "info",
            };

      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        return [newItem, ...filtered].slice(0, resolvedMaxToasts);
      });

      return id;
    },
    [resolvedDefaultTimeout, resolvedMaxToasts],
  );

  const success = useCallback(
    (message: ReactNode, options?: Partial<ToastShowOptions>) =>
      toast({ ...options, message, type: "success" }),
    [toast],
  );

  const error = useCallback(
    (message: ReactNode, options?: Partial<ToastShowOptions>) =>
      toast({ ...options, message, type: "error" }),
    [toast],
  );

  const info = useCallback(
    (message: ReactNode, options?: Partial<ToastShowOptions>) =>
      toast({ ...options, message, type: "info" }),
    [toast],
  );

  const warning = useCallback(
    (message: ReactNode, options?: Partial<ToastShowOptions>) =>
      toast({ ...options, message, type: "warning" }),
    [toast],
  );

  const contextValue = useMemo(
    () => ({
      toasts,
      toast,
      success,
      error,
      info,
      warning,
      removeToast,
      clearToasts,
    }),
    [toasts, toast, success, error, info, warning, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Floating Toast Portal Container */}
      <section
        aria-label="Notifications"
        className={cn(
          "fixed z-50 flex flex-col gap-3 pointer-events-none p-4 max-h-screen overflow-clip",
          resolvedPlacement === "top-right" && "top-0 right-0 items-end",
          resolvedPlacement === "top-left" && "top-0 left-0 items-start",
          resolvedPlacement === "bottom-right" && "bottom-0 right-0 items-end",
          resolvedPlacement === "bottom-left" && "bottom-0 left-0 items-start",
          resolvedPlacement === "top-center" &&
            "top-0 left-1/2 -translate-x-1/2 items-center",
          resolvedPlacement === "bottom-center" &&
            "bottom-0 left-1/2 -translate-x-1/2 items-center",
          className,
        )}>
        {toasts.map((toastItem) => (
          <ToastItem
            key={toastItem.id}
            {...toastItem}
            placement={resolvedPlacement}
            size={resolvedSizeKey}
            variant={resolvedVariantKey}
            radius={resolvedRadiusKey}
            onDismiss={removeToast}
            animated={resolvedAnimated}
          />
        ))}
      </section>
    </ToastContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────

/**
 * Hook for accessing the toast system.
 *
 * useToast returns methods for showing toast notifications with
 * different types (success, error, info, warning). It must be used
 * within a ToastProvider component.
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
    };
  }
  return context;
}
