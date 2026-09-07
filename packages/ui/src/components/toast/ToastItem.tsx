/**
 * Toast item component for AsheeUI.
 * This file provides the ToastItem component that renders a single toast
 * notification with icon, title, message, action, and dismiss button.
 * It supports pause on hover, enter/exit animations, and configurable
 * styling through the cascade system.
 */
"use client";

import { useCallback, useState } from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { ErrorIcon } from "../../icons/ErrorIcon";
import { InfoIcon } from "../../icons/InfoIcon";
import { WarningIcon } from "../../icons/WarningIcon";
import { useAsheeConfig } from "../../libs/context";
import {
  type Color,
  RADIUS_CLASS,
  type Radius,
  resolveVariantClass,
  type Size,
  type Variant,
} from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import {
  FALLBACK_TOAST_CONFIG,
  type ToastItemData,
  type ToastPlacement,
  type ToastType,
} from "./toast-config";
import {
  TOAST_ANIMATION_STATE,
  TOAST_FONT_CLASS,
  TOAST_PADDING_CLASS,
  TOAST_TITLE_FONT_CLASS,
  TOAST_WIDTH_CLASS,
} from "./toast-styles";
import { usePausableTimeout } from "./use-pausable-timeout";

// ─── Color Resolver ─────────────────────────────────────────────────────────

/**
 * Maps a toast type to a theme color.
 * Used to determine the accent color for the toast.
 */
function mapTypeToColor(type: ToastType = "info"): Color {
  switch (type) {
    case "success":
      return "success";
    case "error":
      return "danger";
    case "warning":
      return "warning";
    case "info":
      return "primary";
    default:
      return "secondary";
  }
}

// ─── Default SVG Icons ───────────────────────────────────────────────────────

/**
 * Returns the default icon for a given toast type.
 * Used when no custom icon is provided.
 */
function getDefaultIcon(type: ToastType = "info", isSolid = false) {
  const iconClass = cn("w-5 h-5", isSolid && "text-current");

  switch (type) {
    case "success":
      return (
        <CheckIcon className={cn(iconClass, !isSolid && "text-success")} />
      );
    case "error":
      return <ErrorIcon className={cn(iconClass, !isSolid && "text-danger")} />;
    case "warning":
      return (
        <WarningIcon className={cn(iconClass, !isSolid && "text-warning")} />
      );
    default:
      return <InfoIcon className={cn(iconClass, !isSolid && "text-primary")} />;
  }
}

// ─── Component Props ──────────────────────────────────────────────────────────

/**
 * Props for the ToastItem component.
 * Extends ToastItemData with additional configuration and callbacks.
 */
export interface ToastItemProps extends ToastItemData {
  /**
   * Callback fired when the toast should be dismissed.
   */
  onDismiss: (id: string) => void;

  /**
   * Placement of the toast container.
   * Determines the animation direction.
   */
  placement: ToastPlacement;

  /**
   * Size scale of the toast.
   */
  size: Size;

  /**
   * Visual style variant of the toast.
   */
  variant: Variant;

  /**
   * Theme color of the toast.
   * Overrides the auto-detected color from the type.
   */
  color?: Color;

  /**
   * Corner rounding of the toast.
   */
  radius: Radius;

  /**
   * Whether the toast has animations.
   */
  animated?: boolean;
}

/**
 * A single toast notification item.
 *
 * ToastItem renders a toast notification with icon, title, message,
 * optional action, and dismiss button. It supports pause on hover,
 * enter/exit animations, and configurable styling. The component uses
 * the usePausableTimeout hook to pause auto-dismissal during hover.
 *
 * @param props - ToastItem configuration options.
 * @param props.id - Unique identifier for the toast.
 * @param props.title - Optional title text.
 * @param props.message - The main message content.
 * @param props.type - Type of toast. Defaults to "info".
 * @param props.timeout - Duration before auto-dismissal. Defaults to 3500.
 * @param props.icon - Custom icon element.
 * @param props.action - Action element rendered below the message.
 * @param props.dismissible - Whether the toast can be dismissed. Defaults to true.
 * @param props.onDismiss - Callback fired when the toast is dismissed.
 * @param props.placement - Placement of the toast container.
 * @param props.size - Size scale of the toast.
 * @param props.variant - Visual style variant.
 * @param props.color - Theme color override.
 * @param props.radius - Corner rounding.
 * @param props.animated - Whether the toast has animations.
 *
 * @see ToastItemData - The data structure for toast notifications.
 * @see usePausableTimeout - Hook for pausing auto-dismissal.
 */
export function ToastItem({
  id,
  title,
  message,
  type = "info",
  timeout = 3500,
  icon,
  action,
  dismissible = true,
  onDismiss,
  placement,
  size,
  variant,
  color,
  radius,
  animated,
}: ToastItemProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.toast;
  const [isExiting, setIsExiting] = useState(false);

  // Resolve animated cascade fallback
  const resolvedAnimated = resolveCascade<boolean>(
    animated,
    sectionConfig?.animated,
    undefined,
    FALLBACK_TOAST_CONFIG.animated,
  );

  // Smooth dismissal handler
  const handleDismiss = useCallback(() => {
    if (resolvedAnimated && !isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss(id);
      }, 150);
    } else {
      onDismiss(id);
    }
  }, [resolvedAnimated, isExiting, onDismiss, id]);

  const { pause, resume } = usePausableTimeout(handleDismiss, timeout);

  // ─── Token Resolvers (4-Tier Cascade) ──────────────────────────────────
  const resolvedColor = color ?? mapTypeToColor(type);
  const isSolid = variant === "solid";

  // ─── Class Maps ────────────────────────────────────────────────────────

  const widthClass = resolveClassKey(
    size,
    TOAST_WIDTH_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const paddingClass = resolveClassKey(
    size,
    TOAST_PADDING_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const fontClass = resolveClassKey(
    size,
    TOAST_FONT_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const titleFontClass = resolveClassKey(
    size,
    TOAST_TITLE_FONT_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const radiusClass = resolveClassKey(
    radius,
    RADIUS_CLASS,
    FALLBACK_TOAST_CONFIG.radius,
  );

  const animState = TOAST_ANIMATION_STATE[placement];
  const animationClass = animated
    ? isExiting
      ? animState.exit
      : animState.enter
    : "";

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      className={cn(
        "pointer-events-auto relative flex gap-3 items-start shadow-lg border backdrop-blur-md select-none overflow-clip transition-all duration-200 active:scale-[0.99]",
        "bg-background",
        widthClass,
        paddingClass,
        radiusClass,
        animationClass,
        resolveVariantClass(variant, resolvedColor),
      )}>
      {/* Toast Icon */}
      <div className="shrink-0 pt-0.5 ps-1">
        {icon ?? getDefaultIcon(type, isSolid)}
      </div>

      {/* Content Body */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        {title && (
          <span
            className={cn(
              "leading-tight truncate text-current",
              titleFontClass,
            )}>
            {title}
          </span>
        )}
        <div
          className={cn(
            "leading-snug wrap-break-word opacity-90 text-current",
            fontClass,
          )}>
          {message}
        </div>
        {action && <div className="mt-2 flex items-center gap-2">{action}</div>}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
          className="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-current">
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

ToastItem.displayName = "ToastItem";
