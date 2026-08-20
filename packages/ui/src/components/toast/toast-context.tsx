"use client";

import { cn } from "@asheeui/utils";
import { AnimatePresence } from "framer-motion";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Variant } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import {
  FALLBACK_TOAST_CONFIG,
  type ToastConfig,
  type ToastItemData,
  type ToastPlacement,
  type ToastSizeKey,
} from "./toast-config";
import { ToastItem } from "./ToastItem";

// ─── Context Interface ────────────────────────────────────────────────────────

export interface ToastShowOptions extends Omit<ToastItemData, "id"> {
  id?: string;
}

export interface ToastContextType {
  toasts: ToastItemData[];
  toast: (options: ToastShowOptions | string) => string;
  success: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;
  error: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;
  info: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;
  warning: (message: ReactNode, options?: Partial<ToastShowOptions>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// ─── Component Props ──────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: ReactNode;
  size?: ToastSizeKey;
  placement?: ToastPlacement;
  variant?: Variant;
  radius?: keyof Radius;
  defaultTimeout?: number;
  maxToasts?: number;
  className?: string;
}

// ─── Provider Component ───────────────────────────────────────────────────────

export function ToastProvider({
  children,
  size,
  placement,
  variant,
  radius,
  defaultTimeout,
  maxToasts,
  className,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const config = useAsheeConfig();
  const sectionConfig = config.components?.toast as ToastConfig | undefined;

  // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

  const resolvedSizeKey = resolveCascade<ToastSizeKey>(
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

  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    config.theme.defaultVariant,
    FALLBACK_TOAST_CONFIG.variant,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    radius,
    sectionConfig,
    config.theme.radius?.default,
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
          "fixed z-50 flex flex-col gap-3 pointer-events-none p-4 max-h-screen overflow-hidden",
          resolvedPlacement === "top-right" && "top-0 right-0 items-end",
          resolvedPlacement === "top-left" && "top-0 left-0 items-start",
          resolvedPlacement === "bottom-right" && "bottom-0 right-0 items-end",
          resolvedPlacement === "bottom-left" && "bottom-0 left-0 items-start",
          resolvedPlacement === "top-center" &&
            "top-0 left-1/2 -translate-x-1/2 items-center",
          resolvedPlacement === "bottom-center" &&
            "bottom-0 left-1/2 -translate-x-1/2 items-center",
          sectionConfig?.className,
          className,
        )}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toastItem) => (
            <ToastItem
              key={toastItem.id}
              {...toastItem}
              placement={resolvedPlacement}
              sizeKey={resolvedSizeKey}
              variant={resolvedVariant}
              radius={resolvedRadiusKey}
              onDismiss={removeToast}
              className={sectionConfig?.itemClassName}
            />
          ))}
        </AnimatePresence>
      </section>
    </ToastContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────

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
