/**
 * Toast provider for the native package.
 *
 * The provider wraps the application, holds the queue of messages, and draws them in a
 * layer above what the reader is doing. It is the same system the web exposes — the
 * same methods, the same options, the same conveniences — and the one difference is the
 * platform's: the web renders its messages into the document through a portal, and the
 * platform positions a layer against its parent instead, so the provider wraps the
 * application in one full-height view and stacks the messages inside it.
 *
 * A message that has waited longer than the queue allows is dropped rather than queued
 * behind the ones a reader is already reading: a queue deeper than a screen is a queue
 * that hides messages, and the limit is configured by the consumer.
 */

import {
  NATIVE_TOAST_CONTAINER_CLASS,
  NATIVE_TOAST_PLACEMENT_CLASS,
  type Radius,
  resolveCascade,
  type Size,
  type ToastItemData,
  type ToastPlacement,
  type ToastShowOptions,
  type Variant,
} from "@asheeui/core";
import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { ToastContext } from "./ToastContext";
import { ToastItem } from "./ToastItem";
import {
  FALLBACK_NATIVE_TOAST_CONFIG,
  type NativeToastConfig,
} from "./toast-config";

/**
 * Props for the native Toast provider.
 */
export interface ToastProviderProps extends NativeToastConfig {
  /** The application's tree, which the provider wraps. */
  children: ReactNode;
}

/**
 * Wrap an application so it can show messages.
 *
 * @param props - The system's defaults and the application's tree.
 * @param props.children - The application's tree.
 * @param props.placement - Where messages appear. Defaults to the configured value.
 * @param props.size - Density of messages. Defaults to the configured value.
 * @param props.variant - Treatment of messages. Defaults to the configured value.
 * @param props.radius - Corner rounding of messages. Defaults to the configured value.
 * @param props.animated - Whether messages animate. Defaults to the configured value.
 * @param props.defaultTimeout - How long a message waits. Defaults to the configured value.
 * @param props.maxToasts - How many messages may wait at once. Defaults to the configured value.
 * @returns The provider element.
 *
 * @example
 * ```tsx
 * <AsheeNativeProvider>
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 * </AsheeNativeProvider>
 * ```
 *
 * @see useToast - How a screen shows a message.
 */
export function ToastProvider({
  children,
  size,
  placement,
  variant,
  radius,
  animated,
  defaultTimeout,
  maxToasts,
}: ToastProviderProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.toast;

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_TOAST_CONFIG.size,
  );
  const resolvedPlacement = resolveCascade<ToastPlacement>(
    placement,
    sectionConfig?.placement,
    undefined,
    FALLBACK_NATIVE_TOAST_CONFIG.placement,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_TOAST_CONFIG.variant,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_TOAST_CONFIG.radius,
  );
  const resolvedAnimated = resolveCascade<boolean>(
    animated,
    sectionConfig?.animated,
    undefined,
    FALLBACK_NATIVE_TOAST_CONFIG.animated,
  );
  const resolvedTimeout = resolveCascade<number>(
    defaultTimeout,
    sectionConfig?.defaultTimeout,
    undefined,
    FALLBACK_NATIVE_TOAST_CONFIG.defaultTimeout,
  );
  const resolvedMaxToasts = resolveCascade<number>(
    maxToasts,
    sectionConfig?.maxToasts,
    undefined,
    FALLBACK_NATIVE_TOAST_CONFIG.maxToasts,
  );

  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const lastId = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => setToasts([]), []);

  const toast = useCallback(
    (options: ToastShowOptions | string) => {
      const stated =
        typeof options === "string" ? { message: options } : options;

      lastId.current += 1;
      const id = stated.id ?? `toast-${lastId.current}`;

      setToasts((current) => {
        const next = [...current, { ...stated, id }];

        // The queue keeps the messages a reader is about to read: the oldest leaves
        // when one more would be more than the limit allows.
        return next.slice(Math.max(0, next.length - resolvedMaxToasts));
      });

      return id;
    },
    [resolvedMaxToasts],
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
      defaultPlacement: resolvedPlacement,
      defaultSize: resolvedSize,
      defaultVariant: resolvedVariant,
      defaultRadius: resolvedRadius,
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
      resolvedPlacement,
      resolvedSize,
      resolvedVariant,
      resolvedRadius,
      resolvedAnimated,
    ],
  );

  const toastsByPlacement = useMemo(() => {
    const groups: Partial<Record<ToastPlacement, ToastItemData[]>> = {};

    for (const item of toasts) {
      const group = item.placement ?? resolvedPlacement;

      groups[group] = [...(groups[group] ?? []), item];
    }

    return groups;
  }, [toasts, resolvedPlacement]);

  return (
    <ToastContext.Provider value={contextValue}>
      {/* The layer is positioned against this view, which is the platform's answer to
          the web's portal: a message has to be able to sit above the screen it belongs
          to without the screen having to know about it. */}
      <View className="flex-1">
        {children}

        {(
          Object.entries(toastsByPlacement) as [
            ToastPlacement,
            ToastItemData[],
          ][]
        ).map(([groupPlacement, items]) => (
          <View
            key={groupPlacement}
            accessibilityLabel="Notifications"
            className={classNames(
              NATIVE_TOAST_CONTAINER_CLASS,
              NATIVE_TOAST_PLACEMENT_CLASS[groupPlacement],
            )}
            // The layer passes presses through to the screen underneath, so a message
            // never makes what it covers unreachable.
            pointerEvents="box-none">
            {items.map((item) => (
              <ToastItem
                key={item.id}
                {...item}
                onDismiss={removeToast}
                placement={groupPlacement}
                size={item.size ?? resolvedSize}
                variant={item.variant ?? resolvedVariant}
                radius={item.radius ?? resolvedRadius}
                animated={item.animated ?? resolvedAnimated}
                timeout={item.timeout ?? resolvedTimeout}
              />
            ))}
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}
