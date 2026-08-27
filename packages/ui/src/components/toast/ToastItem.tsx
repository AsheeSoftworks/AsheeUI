"use client";

import { cn } from "@asheeui/utils";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { ErrorIcon } from "../../icons/ErrorIcon";
import { InfoIcon } from "../../icons/InfoIcon";
import { WarningIcon } from "../../icons/WarningIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  FALLBACK_TOAST_CONFIG,
  type ToastConfig,
  type ToastItemData,
  type ToastPlacement,
  type ToastSizeKey,
  type ToastType,
} from "./toast-config";
import {
  TOAST_ANIMATION_CLASS,
  TOAST_FONT_CLASS,
  TOAST_PADDING_CLASS,
  TOAST_TITLE_FONT_CLASS,
  TOAST_WIDTH_CLASS,
} from "./toast-styles";
import { usePausableTimeout } from "./use-pausable-timeout";

// ─── Color Resolver ─────────────────────────────────────────────────────────

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

export interface ToastItemProps extends ToastItemData {
  onDismiss: (id: string) => void;
  placement?: ToastPlacement;
  sizeKey?: ToastSizeKey;
  size?: ToastSizeKey;
  variant?: Variant;
  color?: Color;
  radius?: Radius;
  className?: string;
}

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
  sizeKey,
  size,
  variant,
  color,
  radius,
  className,
}: ToastItemProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.toast as ToastConfig | undefined;
  const { pause, resume } = usePausableTimeout(() => onDismiss(id), timeout);

  // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

  const resolvedSizeKey = resolveCascade<ToastSizeKey>(
    sizeKey ?? size,
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
    config.defaultVariant as Variant | undefined,
    FALLBACK_TOAST_CONFIG.variant,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    radius,
    sectionConfig?.radius,
    config.defaultRadius as Radius,
    FALLBACK_TOAST_CONFIG.radius,
  );

  const resolvedColor = color ?? mapTypeToColor(type);
  const isSolid = resolvedVariant === "solid";

  // ─── 2. Class Maps ────────────────────────────────────────────────────────

  const widthClass = resolveClassKey(
    resolvedSizeKey,
    TOAST_WIDTH_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const paddingClass = resolveClassKey(
    resolvedSizeKey,
    TOAST_PADDING_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const fontClass = resolveClassKey(
    resolvedSizeKey,
    TOAST_FONT_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const titleFontClass = resolveClassKey(
    resolvedSizeKey,
    TOAST_TITLE_FONT_CLASS,
    FALLBACK_TOAST_CONFIG.size,
  );

  const radiusClass = resolveClassKey(
    resolvedRadiusKey,
    RADIUS_CLASS,
    FALLBACK_TOAST_CONFIG.radius,
  );

  const animationClass = resolveClassKey(
    resolvedPlacement,
    TOAST_ANIMATION_CLASS,
    FALLBACK_TOAST_CONFIG.placement,
  );

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      className={cn(
        "pointer-events-auto relative flex gap-3 items-start shadow-lg border backdrop-blur-md select-none overflow-hidden transition-all duration-200 active:scale-[0.99]",
        widthClass,
        paddingClass,
        radiusClass,
        animationClass,
        resolveVariantClass(resolvedVariant, resolvedColor),
        sectionConfig?.itemClassName,
        className,
      )}>
      {/* Toast Icon */}
      <div className="shrink-0 pt-0.5">
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
