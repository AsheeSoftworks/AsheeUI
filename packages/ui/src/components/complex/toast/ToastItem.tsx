"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { useMemo } from "react";
import { useAsheeConfig } from "../../../libs/context";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../../utils/resolve-token";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { ErrorIcon } from "../../icons/ErrorIcon";
import { InfoIcon } from "../../icons/InfoIcon";
import { WarningIcon } from "../../icons/WarningIcon";
import {
  FALLBACK_TOAST_CONFIG,
  type ToastConfig,
  type ToastItemData,
  type ToastPlacement,
  type ToastSizeKey,
  type ToastType,
} from "./toast-config";
import { getToastMotionVariants } from "./toast-motion";
import {
  TOAST_FONT_CLASS,
  TOAST_PADDING_CLASS,
  TOAST_RADIUS_CLASS,
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
  radius?: keyof Radius;
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
    config.theme.defaultVariant,
    FALLBACK_TOAST_CONFIG.variant,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    radius,
    sectionConfig,
    config.theme.radius?.default,
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
    TOAST_RADIUS_CLASS,
    FALLBACK_TOAST_CONFIG.radius,
  );

  const motionVariants = useMemo(
    () => getToastMotionVariants(resolvedPlacement),
    [resolvedPlacement],
  );

  return (
    <motion.div
      layout
      {...(motionVariants as HTMLMotionProps<"div">)}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      className={cn(
        "pointer-events-auto relative flex gap-3 items-start shadow-lg border backdrop-blur-md select-none overflow-hidden transition-colors",
        widthClass,
        paddingClass,
        radiusClass,
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
    </motion.div>
  );
}

ToastItem.displayName = "ToastItem";
