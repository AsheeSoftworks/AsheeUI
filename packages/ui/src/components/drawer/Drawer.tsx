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
  type DrawerConfig,
  type DrawerPlacement,
  type DrawerSize,
  FALLBACK_DRAWER_CONFIG,
} from "./drawer-config";
import {
  DRAWER_ANIMATION_STATE,
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
  animated?: boolean;
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
      animated: animatedProp,
      closeOnOverlayClick: closeOnOverlayClickProp,
      closeOnEsc: closeOnEscProp,
      overlayClassName: overlayClassNameProp,
      contentClassName: contentClassNameProp,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.drawer as DrawerConfig | undefined;

    // Use explicit animation status states to avoid flash transitions
    const [renderState, setRenderState] = useState<
      "unmounted" | "opening" | "open" | "closing"
    >(isOpen ? "open" : "unmounted");

    useEffect(() => {
      if (isOpen) {
        setRenderState("opening");
        const timer = requestAnimationFrame(() => {
          setRenderState("open");
        });
        return () => cancelAnimationFrame(timer);
      } else if (renderState !== "unmounted") {
        setRenderState("closing");
        const timer = setTimeout(() => {
          setRenderState("unmounted");
        }, 250); // Matches CSS keyframe duration (250ms)
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
      closeOnOverlayClickProp,
      sectionConfig?.closeOnOverlayClick,
      undefined,
      FALLBACK_DRAWER_CONFIG.closeOnOverlayClick,
    );

    const shouldCloseOnEsc = resolveCascade<boolean>(
      closeOnEscProp,
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

    const animated = resolveCascade<boolean>(
      animatedProp,
      sectionConfig?.animated,
      undefined,
      FALLBACK_DRAWER_CONFIG.animated,
    );

    const overlayClassName =
      overlayClassNameProp ?? "bg-black/70 backdrop-blur-md";

    const contentClassName = contentClassNameProp ?? "bg-secondary";

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

    // Animation state class mapping
    const animState = DRAWER_ANIMATION_STATE[placement];
    const isVisible = renderState === "open" || renderState === "opening";

    const animationClass = animated
      ? isVisible
        ? animState.open
        : animState.closed
      : "";

    const backdropAnimationClass = animated
      ? isVisible
        ? "drawer-backdrop-in"
        : "drawer-backdrop-out"
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
      if (renderState === "unmounted") return;
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [renderState, handleKeyDown]);

    if (renderState === "unmounted") return null;

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
            "absolute inset-0",
            overlayClassName,
            backdropAnimationClass,
          )}
        />

        {/* Drawer Content */}
        <div
          style={style}
          className={cn(
            "relative z-10 flex flex-col text-foreground shadow-2xl border-border overflow-hidden",
            borderPlacementClass,
            widthClass,
            heightClass,
            radiusClass,
            contentClassName,
            animationClass,
          )}>
          {children}
        </div>
      </div>
    );
  },
);

Drawer.displayName = "Drawer";
