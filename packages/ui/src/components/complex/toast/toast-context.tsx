"use client";

import { useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { AnimatePresence } from "framer-motion";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../../context";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import {
  defaultToastConfig,
  defaultToastSizeScale,
} from "./default-toast-config";
import { flattenToastSizeScale } from "./flatten-toast-size-scale";
import { ToastItem } from "./ToastItem";
import type {
  ToastConfig,
  ToastItemData,
  ToastPlacement,
  ToastSizeKey,
  ToastSizeScale,
  ToastVariant,
} from "./toast-config";

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

// ─── Provider Component ───────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const config = useAsheeConfig();
  const sectionConfig = config.components?.toast as ToastConfig | undefined;

  // Resolve Design Tokens
  const sizeScale = (sectionConfig?.size ??
    defaultToastSizeScale) as ToastSizeScale;
  const resolvedSizeKey = (sectionConfig?.size?.default ??
    "md") as ToastSizeKey;

  const responsiveVars = useMemo(
    () => flattenToastSizeScale(sizeScale),
    [sizeScale],
  );
  useResponsiveVars(
    "ashee-toast-tokens",
    responsiveVars,
    config.theme.breakpoints,
  );

  const placement = resolveValue<ToastPlacement>(
    sectionConfig?.placement,
    defaultToastConfig.placement,
    "top-right",
  );

  const variant = resolveValue<ToastVariant>(
    sectionConfig?.variant,
    defaultToastConfig.variant,
    "flat",
  );

  const maxToasts =
    sectionConfig?.maxToasts ?? defaultToastConfig.maxToasts ?? 5;
  const defaultTimeout =
    sectionConfig?.defaultTimeout ?? defaultToastConfig.defaultTimeout ?? 3500;

  const resolvedRadiusKey =
    typeof sectionConfig?.radius === "string"
      ? sectionConfig.radius
      : undefined;
  const resolvedRadius = resolveScale(
    resolvedRadiusKey,
    "md",
    config.theme.radius.values.md,
    config.theme.radius.values,
  );

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
          ? { id, message: options, timeout: defaultTimeout, type: "info" }
          : {
              ...options,
              id,
              timeout: options.timeout ?? defaultTimeout,
              type: options.type ?? "info",
            };

      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        return [newItem, ...filtered].slice(0, maxToasts);
      });

      return id;
    },
    [defaultTimeout, maxToasts],
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
          placement === "top-right" && "top-0 right-0 items-end",
          placement === "top-left" && "top-0 left-0 items-start",
          placement === "bottom-right" && "bottom-0 right-0 items-end",
          placement === "bottom-left" && "bottom-0 left-0 items-start",
          placement === "top-center" &&
            "top-0 left-1/2 -translate-x-1/2 items-center",
          placement === "bottom-center" &&
            "bottom-0 left-1/2 -translate-x-1/2 items-center",
          sectionConfig?.className,
        )}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toastItem) => (
            <ToastItem
              key={toastItem.id}
              {...toastItem}
              placement={placement}
              sizeKey={resolvedSizeKey}
              variant={variant}
              radiusStyle={resolvedRadius}
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
