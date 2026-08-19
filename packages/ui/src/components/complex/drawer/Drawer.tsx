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
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../../utils/resolve-token";
import {
  FALLBACK_DRAWER_CONFIG,
  type DrawerAnimation,
  type DrawerConfig,
  type DrawerPlacement,
  type DrawerSizeKey,
} from "./drawer-config";
import { resolveDrawerAnimation } from "./drawer-motion";
import {
  DRAWER_BORDER_PLACEMENT_CLASS,
  DRAWER_CONTAINER_PLACEMENT_CLASS,
  DRAWER_HEIGHT_CLASS,
  DRAWER_RADIUS_CLASS,
  DRAWER_WIDTH_CLASS,
} from "./drawer-styles";

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

  // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

  const resolvedSizeKey = resolveCascade<DrawerSizeKey>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_DRAWER_CONFIG.size,
  );

  const placement = resolveCascade<DrawerPlacement>(
    placementProp,
    sectionConfig?.placement,
    undefined,
    FALLBACK_DRAWER_CONFIG.placement,
  );

  const shouldCloseOnOverlay = resolveCascade<boolean>(
    closeOnOverlayClick,
    sectionConfig?.closeOnOverlayClick,
    undefined,
    FALLBACK_DRAWER_CONFIG.closeOnOverlayClick,
  );

  const shouldCloseOnEsc = resolveCascade<boolean>(
    closeOnEsc,
    sectionConfig?.closeOnEsc,
    undefined,
    FALLBACK_DRAWER_CONFIG.closeOnEsc,
  );

  const resolvedRadiusKey = resolveRadiusKey(
    typeof radius === "string" ? radius : undefined,
    typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
    config.theme.radius?.default,
    FALLBACK_DRAWER_CONFIG.radius,
  );

  const resolvedAnimation =
    animation ?? sectionConfig?.animation ?? FALLBACK_DRAWER_CONFIG.animation;

  // ─── 2. Class Maps ────────────────────────────────────────────────────────

  const isHorizontal = placement === "left" || placement === "right";

  const widthClass = isHorizontal
    ? resolveClassKey(
        resolvedSizeKey,
        DRAWER_WIDTH_CLASS,
        FALLBACK_DRAWER_CONFIG.size,
      )
    : "w-full";

  const heightClass = !isHorizontal
    ? resolveClassKey(
        resolvedSizeKey,
        DRAWER_HEIGHT_CLASS,
        FALLBACK_DRAWER_CONFIG.size,
      )
    : "h-full";

  const radiusClass = resolveClassKey(
    resolvedRadiusKey,
    DRAWER_RADIUS_CLASS,
    FALLBACK_DRAWER_CONFIG.radius,
  );

  const containerPlacementClass =
    DRAWER_CONTAINER_PLACEMENT_CLASS[placement] ??
    DRAWER_CONTAINER_PLACEMENT_CLASS.right;

  const borderPlacementClass =
    DRAWER_BORDER_PLACEMENT_CLASS[placement] ??
    DRAWER_BORDER_PLACEMENT_CLASS.right;

  // Motion resolution
  const drawerMotion = useMemo(
    () =>
      resolveDrawerAnimation(
        resolvedAnimation,
        placement,
      ) as unknown as Partial<HTMLMotionProps<"div">>,
    [resolvedAnimation, placement],
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "fixed inset-0 z-50 flex w-full h-full",
            containerPlacementClass,
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
            style={style}
            className={cn(
              "relative z-10 flex flex-col bg-background text-foreground shadow-2xl border-border overflow-hidden",
              borderPlacementClass,
              widthClass,
              heightClass,
              radiusClass,
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
