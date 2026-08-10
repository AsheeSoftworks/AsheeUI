"use client";

import { useSettings } from "@ashee/settings";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { useMemo } from "react";
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
  ToastVariant,
} from "./toast-config";
import { getToastMotionVariants } from "./toast-motion";
import { usePausableTimeout } from "./use-pausable-timeout";

// ─── Default SVG Icons ───────────────────────────────────────────────────────

function getDefaultIcon(type?: ToastType) {
  switch (type) {
    case "success":
      return (
        <CheckIcon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
      );
    case "error":
      return <ErrorIcon className="w-5 h-5 text-destructive" />;
    case "warning":
      return (
        <WarningIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
      );
    default:
      return <InfoIcon className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
  }
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface ToastItemProps extends ToastItemData {
  onDismiss: (id: string) => void;
  placement: ToastPlacement;
  sizeKey: ToastSizeKey;
  variant: ToastVariant;
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
  variant,
  radiusStyle,
  className,
}: ToastItemProps) {
  const { settings } = useSettings();

  const { pause, resume } = usePausableTimeout(() => onDismiss(id), timeout);

  const motionVariants = useMemo(
    () => getToastMotionVariants(placement),
    [placement],
  );

  const motionProps = (
    settings.enableAnimations
      ? motionVariants
      : { initial: false, animate: false, exit: false }
  ) as HTMLMotionProps<"div">;

  return (
    <motion.div
      layout
      {...motionProps}
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
        // Variants
        variant === "flat" &&
          "bg-card/95 text-card-foreground border-border/80",
        variant === "solid" &&
          type === "success" &&
          "bg-emerald-600 text-white border-emerald-500",
        variant === "solid" &&
          type === "error" &&
          "bg-destructive text-destructive-foreground border-destructive",
        variant === "solid" &&
          type === "info" &&
          "bg-sky-600 text-white border-sky-500",
        variant === "solid" &&
          type === "warning" &&
          "bg-amber-600 text-white border-amber-500",
        variant === "bordered" &&
          "bg-background border-2 border-primary text-foreground",
        className,
      )}>
      {/* Toast Icon */}
      <div className="shrink-0 pt-0.5">{icon ?? getDefaultIcon(type)}</div>

      {/* Content Body */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        {title && (
          <span
            className="font-semibold leading-tight truncate text-foreground"
            style={{ fontSize: `var(--ashee-toast-${sizeKey}-title-font-s)` }}>
            {title}
          </span>
        )}
        <div
          className="text-muted-foreground leading-snug wrap-break-word"
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
          className="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-muted/60 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
