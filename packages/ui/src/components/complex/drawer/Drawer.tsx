"use client";
import { cn } from "@asheeui/utils";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import type { Radius } from "../../../theme/token/radius/radius-config";
import { useResponsiveVars } from "../../../theme/token/responsive/use-responsive-vars";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { defaultDrawerSizeScale } from "./default-drawer-config";
import type {
  DrawerAnimation,
  DrawerConfig,
  DrawerPlacement,
  DrawerSizeKey,
  DrawerSizeScale,
} from "./drawer-config";
import { resolveDrawerAnimation } from "./drawer-motion";
import { flattenDrawerSizeScale } from "./flatten-drawer-size-scale";

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  /** Controls open visibility state. */
  isOpen: boolean;

  /** Callback fired when backdrop overlay is clicked or Esc key is pressed. */
  onClose?: () => void;

  /** Edge position where drawer slides in from. */
  placement?: DrawerPlacement;

  /** Density/size scale key. */
  size?: DrawerSizeKey;

  /** Radius scale token for drawer edges. */
  radius?: keyof Radius;

  /** Animation preset or custom motion configuration. */
  animation?: DrawerAnimation;

  /** Whether clicking overlay fires onClose. */
  closeOnOverlayClick?: boolean;

  /** Whether pressing Escape key fires onClose. */
  closeOnEsc?: boolean;

  /** Custom styling for backdrop overlay. */
  overlayClassName?: string;

  /** Custom styling for content surface container. */
  contentClassName?: string;

  /** Content area inside the drawer surface. */
  children: ReactNode;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export function Drawer({
  isOpen,
  onClose,
  placement: placementProp,
  size,
  radius,
  animation,
  closeOnOverlayClick,
  closeOnEsc,
  overlayClassName,
  contentClassName,
  className,
  children,
  style,
  ...props
}: DrawerProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.drawer as DrawerConfig | undefined;

  // Resolve Design Tokens
  const sizeScale = (sectionConfig?.size ??
    defaultDrawerSizeScale) as DrawerSizeScale;
  const resolvedSizeKey = size ?? sizeScale.default;
  const responsiveVars = useMemo(
    () => flattenDrawerSizeScale(sizeScale),
    [sizeScale],
  );
  useResponsiveVars(
    "ashee-drawer-tokens",
    responsiveVars,
    config.theme.breakpoints,
  );

  const placement = resolveValue<DrawerPlacement>(
    placementProp,
    sectionConfig?.placement,
    "right",
  );

  const shouldCloseOnOverlay =
    closeOnOverlayClick ?? sectionConfig?.closeOnOverlayClick ?? true;
  const shouldCloseOnEsc = closeOnEsc ?? sectionConfig?.closeOnEsc ?? true;

  const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
  const resolvedSectionRadiusKey =
    typeof sectionConfig?.radius === "string"
      ? sectionConfig.radius
      : undefined;
  const resolvedRadius = resolveScale(
    resolvedRadiusKey,
    resolvedSectionRadiusKey,
    config.theme.radius.default,
    config.theme.radius.values,
  );

  // Motion resolution via @asheeui/motion
  const drawerMotion = useMemo(
    () =>
      resolveDrawerAnimation(
        animation ?? sectionConfig?.animation,
        placement,
      ) as unknown as Partial<HTMLMotionProps<"div">>,
    [animation, sectionConfig?.animation, placement],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (shouldCloseOnEsc && e.key === "Escape" && onClose) {
        onClose();
      }
    },
    [shouldCloseOnEsc, onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const isHorizontal = placement === "left" || placement === "right";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "fixed inset-0 z-50 flex w-full h-full",
            placement === "right" && "justify-end items-stretch",
            placement === "left" && "justify-start items-stretch",
            placement === "top" && "flex-col justify-start items-stretch",
            placement === "bottom" && "flex-col justify-end items-stretch",
            className,
          )}
          {...props}>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
            }}
            onClick={shouldCloseOnOverlay ? onClose : undefined}
            className={cn(
              "absolute inset-0 bg-black/40 backdrop-blur-xs",
              sectionConfig?.overlayClassName,
              overlayClassName,
            )}
          />

          {/* Drawer Surface */}
          <motion.div
            {...drawerMotion}
            style={{
              borderRadius: resolvedRadius,
              width: isHorizontal
                ? `var(--ashee-drawer-${resolvedSizeKey}-width)`
                : "100%",
              height: !isHorizontal
                ? `var(--ashee-drawer-${resolvedSizeKey}-height)`
                : "100%",
              ...style,
            }}
            className={cn(
              "relative z-10 flex flex-col bg-background text-foreground shadow-2xl border-border overflow-hidden",
              placement === "right" && "border-l",
              placement === "left" && "border-r",
              placement === "top" && "border-b",
              placement === "bottom" && "border-t",
              sectionConfig?.contentClassName,
              contentClassName,
            )}>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

Drawer.displayName = "Drawer";
