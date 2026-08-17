"use client";

import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { useMemo } from "react";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../../shared/variant";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { ErrorIcon } from "../../icons/ErrorIcon";
import { InfoIcon } from "../../icons/InfoIcon";
import { WarningIcon } from "../../icons/WarningIcon";
import type {
  ToastItemData,
  ToastPlacement,
  ToastSizeKey,
  ToastType,
} from "./toast-config";
import { getToastMotionVariants } from "./toast-motion";
import { usePausableTimeout } from "./use-pausable-timeout";

// ─── Color Resolver ─────────────────────────────────────────────────────────

/**
 * Maps toast status state to design system Color tokens used by Button.
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
  placement: ToastPlacement;
  sizeKey: ToastSizeKey;
  variant?: Variant;
  color?: Color;
  radiusStyle?: string;
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
  variant = "solid",
  color,
  radiusStyle,
  className,
}: ToastItemProps) {
  const { pause, resume } = usePausableTimeout(() => onDismiss(id), timeout);

  // Map state type to Button color token unless explicitly overridden
  const resolvedColor = color ?? mapTypeToColor(type);
  const isSolid = variant === "solid";

  const motionVariants = useMemo(
    () => getToastMotionVariants(placement),
    [placement],
  );

  return (
    <motion.div
      layout
      {...(motionVariants as HTMLMotionProps<"div">)}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      style={{
        width: `var(--ashee-toast-${sizeKey}-width, 24rem)`,
        padding: `var(--ashee-toast-${sizeKey}-padding, 1rem)`,
        borderRadius: radiusStyle,
      }}
      className={cn(
        "pointer-events-auto relative flex gap-3 items-start shadow-lg border backdrop-blur-md select-none overflow-hidden transition-colors",
        resolveVariantClass(variant, resolvedColor),
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
            className="font-semibold leading-tight truncate text-current"
            style={{ fontSize: `var(--ashee-toast-${sizeKey}-title-font-s)` }}>
            {title}
          </span>
        )}
        <div
          className="leading-snug wrap-break-word opacity-90 text-current"
          style={{ fontSize: `var(--ashee-toast-${sizeKey}-font-s)` }}>
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
