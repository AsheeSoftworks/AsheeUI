/**
 * Toast provider component for AsheeUI.
 * This file provides the ToastProvider component that manages the toast
 * queue, rendering, and dismissal logic. Each toast can have its own
 * size, placement, variant, radius, and animation settings.
 */
"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAsheeConfig } from "../../libs/context";
import type { Size, Variant } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import { ToastContext } from "./ToastContext";
import { ToastItem } from "./ToastItem";
import {
  FALLBACK_TOAST_CONFIG,
  type ToastConfig,
  type ToastItemData,
  type ToastPlacement,
  type ToastShowOptions,
} from "./toast-config";

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

  /**
   * Custom portal target element.
   * When portal is enabled, toasts are rendered into this element.
   * Defaults to document.body.
   */
  portalTarget?: HTMLElement | null;
}

// ─── Provider Component ───────────────────────────────────────────────────────

/**
 * Provider component for the toast notification system.
 *
 * ToastProvider wraps your application and provides toast notification
 * functionality through the useToast hook. It manages the toast queue,
 * rendering, and dismissal logic. Each toast can be customized with its
 * own size, placement, variant, radius, and animation settings via the
 * toast options.
 *
 * The provider uses React's createPortal to render toasts at the document
 * body level by default. This ensures toasts escape CSS containment,
 * stacking context, and overflow issues. Portaling can be disabled via
 * the `portal` config option if the toasts need to stay within a specific
 * parent container.
 *
 * @param props - ToastProvider configuration options.
 * @param props.children - Child components.
 * @param props.size - Default size scale of toasts. Defaults to "md".
 * @param props.placement - Default placement of toasts. Defaults to "top-right".
 * @param props.variant - Default visual style variant. Defaults to "bordered".
 * @param props.radius - Default corner rounding. Defaults to "md".
 * @param props.defaultTimeout - Default timeout in ms. Defaults to 3500.
 * @param props.maxToasts - Maximum number of toasts. Defaults to 5.
 * @param props.animated - Whether toasts have animations by default. Defaults to true.
 * @param props.portal - Whether to render toasts in a portal. Defaults to true.
 * @param props.portalTarget - Custom portal target element. Defaults to document.body.
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
 * @example
 * ```tsx
 * // Customizing individual toasts
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const showCustomToast = () => {
 *     toast.success("Custom toast!", {
 *       placement: "bottom-center",
 *       size: "lg",
 *       variant: "solid",
 *       radius: "full",
 *       animated: false,
 *     });
 *   };
 *
 *   return <button onClick={showCustomToast}>Show Custom Toast</button>;
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
  portal: portalProp,
  portalTarget: portalTargetProp,
  className,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const config = useAsheeConfig();
  const sectionConfig = config.components?.toast;

  // ─── Token Resolvers ──────────────────────────────────────────────────

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

  const resolvedPortal = resolveCascade<boolean>(
    portalProp,
    sectionConfig?.portal,
    undefined,
    FALLBACK_TOAST_CONFIG.portal,
  );

  // Resolve portal target - defaults to document.body when available
  const portalTarget =
    portalTargetProp ??
    (typeof document !== "undefined" ? document.body : null);

  // ─── Toast State Handlers ──────────────────────────────────────────────

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

      // Resolve toast-specific values with provider defaults as fallback
      const resolvedToastPlacement =
        typeof options === "object" && options.placement
          ? options.placement
          : resolvedPlacement;

      const resolvedToastSize =
        typeof options === "object" && options.size
          ? options.size
          : resolvedSizeKey;

      const resolvedToastVariant =
        typeof options === "object" && options.variant
          ? options.variant
          : resolvedVariantKey;

      const resolvedToastRadius =
        typeof options === "object" && options.radius
          ? options.radius
          : resolvedRadiusKey;

      const resolvedToastAnimated =
        typeof options === "object" && options.animated !== undefined
          ? options.animated
          : resolvedAnimated;

      const newItem: ToastItemData =
        typeof options === "string"
          ? {
              id,
              message: options,
              timeout: resolvedDefaultTimeout,
              type: "info",
              placement: resolvedToastPlacement,
              size: resolvedToastSize,
              variant: resolvedToastVariant,
              radius: resolvedToastRadius,
              animated: resolvedToastAnimated,
            }
          : {
              ...options,
              id,
              timeout: options.timeout ?? resolvedDefaultTimeout,
              type: options.type ?? "info",
              placement: options.placement ?? resolvedToastPlacement,
              size: options.size ?? resolvedToastSize,
              variant: options.variant ?? resolvedToastVariant,
              radius: options.radius ?? resolvedToastRadius,
              animated:
                options.animated !== undefined
                  ? options.animated
                  : resolvedToastAnimated,
            };

      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        return [newItem, ...filtered].slice(0, resolvedMaxToasts);
      });

      return id;
    },
    [
      resolvedDefaultTimeout,
      resolvedMaxToasts,
      resolvedPlacement,
      resolvedSizeKey,
      resolvedVariantKey,
      resolvedRadiusKey,
      resolvedAnimated,
    ],
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
      portalTarget,
      defaultPlacement: resolvedPlacement,
      defaultSize: resolvedSizeKey,
      defaultVariant: resolvedVariantKey,
      defaultRadius: resolvedRadiusKey,
      defaultAnimated: resolvedAnimated,
    }),
    [
      toasts,
      toast,
      success,
      error,
      info,
      warning,
      removeToast,
      clearToasts,
      portalTarget,
      resolvedPlacement,
      resolvedSizeKey,
      resolvedVariantKey,
      resolvedRadiusKey,
      resolvedAnimated,
    ],
  );

  // ─── Render Toast Container ───────────────────────────────────────────────

  const toastContainer = (
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
          onDismiss={removeToast}
          placement={toastItem.placement ?? resolvedPlacement}
          size={toastItem.size ?? resolvedSizeKey}
          variant={toastItem.variant ?? resolvedVariantKey}
          radius={toastItem.radius ?? resolvedRadiusKey}
          animated={toastItem.animated ?? resolvedAnimated}
        />
      ))}
    </section>
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {resolvedPortal && portalTarget
        ? createPortal(toastContainer, portalTarget)
        : toastContainer}
    </ToastContext.Provider>
  );
}
