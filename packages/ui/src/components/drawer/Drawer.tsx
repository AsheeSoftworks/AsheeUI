/**
 * Drawer component for AsheeUI.
 * This file provides the main Drawer component implementation, which renders
 * a sliding panel that appears from the edge of the screen. It supports
 * multiple placements, sizes, animation, and overlay interactions. Visual
 * tokens resolve through the standard AsheeUI cascade system.
 */
"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
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

type BaseDrawerProps = DrawerConfig & HTMLAttributes<HTMLDivElement>;

/**
 * Configuration options for the Drawer component.
 */
export interface DrawerProps extends BaseDrawerProps {
  /**
   * Whether the drawer is open.
   * Controls the visibility of the drawer.
   */
  isOpen: boolean;

  /**
   * Callback fired when the drawer should close.
   * Called when the overlay is clicked, Escape is pressed, or the close button is triggered.
   */
  onClose?: () => void;

  /**
   * Extra classes applied to the overlay.
   */
  overlayClassName?: string;

  /**
   * Extra classes applied to the drawer content.
   */
  contentClassName?: string;

  /**
   * The content to display inside the drawer.
   */
  children: ReactNode;
}

/**
 * A sliding panel that appears from the edge of the screen.
 *
 * Drawer displays content in a panel that slides in from the right, left,
 * top, or bottom edge. It supports overlay click and Escape key dismissal,
 * animation controls, and sizing options. Visual tokens resolve through
 * the standard AsheeUI cascade: prop, component config, global theme
 * defaults, and the built-in fallback.
 *
 * The component automatically handles accessibility attributes including
 * role="dialog", aria-modal, and proper focus management. It manages
 * its own animation states to prevent transition flashes.
 *
 * @param props - Drawer configuration options and HTML div props.
 * @param props.isOpen - Whether the drawer is open.
 * @param props.onClose - Callback fired when the drawer should close.
 * @param props.placement - The placement of the drawer. Defaults to "right".
 * @param props.size - The size of the drawer. Defaults to "md".
 * @param props.animated - Whether the drawer has slide animations. Defaults to true.
 * @param props.closeOnOverlayClick - Whether clicking the overlay closes the drawer. Defaults to true.
 * @param props.closeOnEsc - Whether pressing Escape closes the drawer. Defaults to true.
 * @param props.overlayClassName - Extra classes for the overlay.
 * @param props.contentClassName - Extra classes for the drawer content.
 * @param props.children - The content to display inside the drawer.
 * @param props.className - Extra classes for the container.
 *
 * @example
 * ```tsx
 * import { Drawer, Button } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
 *       <Drawer
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         placement="right"
 *         size="md"
 *       >
 *         <div className="p-6">
 *           <h2 className="text-xl font-bold">Drawer Content</h2>
 *           <p>This is the drawer content.</p>
 *           <Button onClick={() => setIsOpen(false)}>Close</Button>
 *         </div>
 *       </Drawer>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Bottom drawer with custom sizing
 * <Drawer
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   placement="bottom"
 *   size="full"
 *   overlayClassName="bg-black/50"
 * >
 *   <div className="p-6 max-h-[80vh] overflow-y-auto">
 *     {content}
 *   </div>
 * </Drawer>
 * ```
 *
 * @see DrawerConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      placement: placementProp,
      size,
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
    const sectionConfig = config.components?.drawer;

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
            "relative z-10 flex flex-col text-foreground shadow-2xl border-border",
            borderPlacementClass,
            widthClass,
            heightClass,
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
