"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type DrawerAnimation,
  type DrawerConfig,
  type DrawerPlacement,
  type DrawerSize,
  FALLBACK_DRAWER_CONFIG,
} from "./drawer-config";
import {
  DRAWER_ANIMATION_CLASSES,
  DRAWER_BORDER_PLACEMENT_CLASS,
  DRAWER_CONTAINER_PLACEMENT_CLASS,
  DRAWER_HEIGHT_CLASS,
  DRAWER_WIDTH_CLASS,
} from "./drawer-styles";

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose?: () => void;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  radius?: Radius;
  animation?: DrawerAnimation;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  overlayClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
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
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.drawer as DrawerConfig | undefined;

    // Mounting & CSS animation state
    const [isMounted, setIsMounted] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setIsMounted(true);
        const timer = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(timer);
      } else {
        setIsVisible(false);
        const timer = setTimeout(() => {
          setIsMounted(false);
        }, 250);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<DrawerSize>(
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
      radius,
      sectionConfig?.radius,
      config.defaultRadius as Radius,
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
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_DRAWER_CONFIG.radius,
    );

    const containerPlacementClass =
      DRAWER_CONTAINER_PLACEMENT_CLASS[placement] ??
      DRAWER_CONTAINER_PLACEMENT_CLASS.right;

    const borderPlacementClass =
      DRAWER_BORDER_PLACEMENT_CLASS[placement] ??
      DRAWER_BORDER_PLACEMENT_CLASS.right;

    // Animation resolution
    const animPreset =
      typeof resolvedAnimation === "string" &&
      resolvedAnimation in DRAWER_ANIMATION_CLASSES
        ? (resolvedAnimation as "slide" | "zoom" | "fade")
        : "slide";

    const isAnimEnabled = resolvedAnimation !== false;
    const animState = DRAWER_ANIMATION_CLASSES[animPreset][placement];

    const transitionClasses = isAnimEnabled
      ? isVisible
        ? animState.open
        : animState.closed
      : "";

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (shouldCloseOnEsc && e.key === "Escape" && onClose) {
          onClose();
        }
      },
      [shouldCloseOnEsc, onClose],
    );

    useEffect(() => {
      if (!isMounted) return;
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMounted, handleKeyDown]);

    if (!isMounted) return null;

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed inset-0 z-50 flex w-full h-full",
          containerPlacementClass,
          className,
        )}
        {...props}>
        {/* Backdrop Overlay */}
        <button
          type="button"
          onClick={shouldCloseOnOverlay ? onClose : undefined}
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-250 ease-out",
            isVisible ? "opacity-100" : "opacity-0",
            sectionConfig?.overlayClassName,
            overlayClassName,
          )}
        />

        {/* Drawer Content */}
        <div
          style={style}
          className={cn(
            "relative z-10 flex flex-col bg-background text-foreground shadow-2xl border-border overflow-hidden",
            "transition-all duration-250 ease-out transform-gpu",
            borderPlacementClass,
            widthClass,
            heightClass,
            radiusClass,
            transitionClasses,
            sectionConfig?.contentClassName,
            contentClassName,
          )}>
          {children}
        </div>
      </div>
    );
  },
);

Drawer.displayName = "Drawer";
