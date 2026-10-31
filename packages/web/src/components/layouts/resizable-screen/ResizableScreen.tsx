/**
 * ResizableScreen component for AsheeUI.
 * This file provides the main ResizableScreen component implementation, which
 * renders a split panel layout with a draggable handle for resizing. It supports
 * horizontal and vertical orientations, keyboard controls, and configurable
 * min/max size constraints. Visual tokens resolve through the standard AsheeUI
 * cascade system.
 */
"use client";

import { resolveCascade } from "@asheeui/core";
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { cn } from "../../../utils/cn";
import {
  FALLBACK_RESIZABLE_SCREEN_CONFIG,
  type ResizableOrientation,
  type ResizableScreenConfig,
} from "./resizable-screen-config";

type BaseResizableScreenProps = ResizableScreenConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Configuration options for the ResizableScreen component.
 */
export interface ResizableScreenProps extends BaseResizableScreenProps {
  /**
   * Exactly two child nodes representing the primary and secondary panels.
   * The first child is the primary (resizable) panel, the second is the secondary (flex) panel.
   */
  children: [ReactNode, ReactNode];

  /**
   * Initial size of the first panel as a percentage (0-100).
   * Alias for defaultSize for backward compatibility.
   */
  left?: number | undefined;

  /**
   * Controlled size percentage (0-100) for the primary panel.
   * When provided, the component becomes controlled.
   */
  size?: number | undefined;

  /**
   * Callback fired when pane size changes.
   * Receives the new size percentage of the primary panel.
   */
  onSizeChange?: ((size: number) => void) | undefined;

  /**
   * Additional custom styling for the resize handle bar container.
   */
  handleClassName?: string | undefined;
}

/**
 * A split panel layout with a draggable handle for resizing the primary panel.
 *
 * ResizableScreen renders two panels separated by a resizable handle. The primary
 * panel (first child) can be resized by dragging the handle or using keyboard
 * controls (arrow keys, Home, End). It supports horizontal and vertical
 * orientations, configurable min/max sizes, and step increments for keyboard
 * resizing. Visual tokens resolve through the standard AsheeUI cascade.
 *
 * The component automatically handles accessibility attributes including
 * role="separator", aria-valuenow, aria-valuemin, aria-valuemax, and
 * aria-orientation for the resize handle.
 *
 * @param props - ResizableScreen configuration options.
 * @param props.children - Exactly two React nodes for the primary and secondary panels.
 * @param props.left - Initial size of the primary panel (alias for defaultSize).
 * @param props.size - Controlled size percentage for the primary panel.
 * @param props.onSizeChange - Callback fired when pane size changes.
 * @param props.defaultSize - Default size of the primary panel. Defaults to 50.
 * @param props.minSize - Minimum size of the primary panel. Defaults to 20.
 * @param props.maxSize - Maximum size of the primary panel. Defaults to 80.
 * @param props.step - Step size for keyboard resizing. Defaults to 2.
 * @param props.orientation - Layout orientation. Defaults to "horizontal".
 * @param props.hideHandle - Whether to hide the resize handle. Defaults to false.
 * @param props.handleClassName - Extra classes for the handle bar.
 * @param props.minContainerHeight - Minimum container height in pixels. Resolved
 * through the cascade and defaulting to 200.
 * @param props.minContainerWidth - Minimum container width in pixels. Resolved
 * through the cascade and defaulting to 200.
 * @param props.className - Extra classes for the container.
 *
 * @example
 * ```tsx
 * import { ResizableScreen } from "@asheeui/web";
 *
 * export function Example() {
 *   return (
 *     <ResizableScreen
 *       defaultSize={60}
 *       minSize={30}
 *       maxSize={70}
 *       orientation="horizontal"
 *     >
 *       <div className="bg-primary/10 p-4">Left Panel</div>
 *       <div className="bg-success/10 p-4">Right Panel</div>
 *     </ResizableScreen>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Vertical orientation with controlled size
 * const [size, setSize] = useState(50);
 *
 * <ResizableScreen
 *   size={size}
 *   onSizeChange={setSize}
 *   orientation="vertical"
 *   minSize={25}
 *   maxSize={75}
 * >
 *   <div className="bg-danger/10 p-4">Top Panel</div>
 *   <div className="bg-primary/10 p-4">Bottom Panel</div>
 * </ResizableScreen>
 * ```
 *
 * @see ResizableScreenConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const ResizableScreen = forwardRef<HTMLDivElement, ResizableScreenProps>(
  (
    {
      children,
      left,
      size,
      defaultSize,
      minSize,
      maxSize,
      step,
      orientation,
      hideHandle,
      onSizeChange,
      handleClassName,
      minContainerHeight,
      minContainerWidth,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.resizableScreen;

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const resolvedMinSize = resolveCascade<number>(
      minSize,
      sectionConfig?.minSize,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.minSize,
    );

    const resolvedMaxSize = resolveCascade<number>(
      maxSize,
      sectionConfig?.maxSize,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.maxSize,
    );

    const resolvedStep = resolveCascade<number>(
      step,
      sectionConfig?.step,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.step,
    );

    const resolvedOrientation = resolveCascade<ResizableOrientation>(
      orientation,
      sectionConfig?.orientation,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.orientation,
    );

    const resolvedHideHandle = resolveCascade<boolean>(
      hideHandle,
      sectionConfig?.hideHandle,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.hideHandle,
    );

    const resolvedDefaultSize = resolveCascade<number>(
      defaultSize,
      sectionConfig?.defaultSize,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.defaultSize,
    );

    const resolvedMinContainerWidth = resolveCascade<number>(
      minContainerWidth,
      sectionConfig?.minContainerWidth,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.minContainerWidth,
    );

    const resolvedMinContainerHeight = resolveCascade<number>(
      minContainerHeight,
      sectionConfig?.minContainerHeight,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.minContainerHeight,
    );

    // An inverted pair cannot be honoured: `min > max` would clamp every value to
    // `max`, which reads as a stuck handle rather than as the mistake it is. The
    // bounds are stated in the order a separator needs (`aria-valuemin` below
    // `aria-valuemax`) and a development warning names the mistake.
    const lowerBound = Math.min(resolvedMinSize, resolvedMaxSize);
    const upperBound = Math.max(resolvedMinSize, resolvedMaxSize);

    useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      if (resolvedMinSize > resolvedMaxSize) {
        console.warn(
          `[AsheeUI] ResizableScreen: minSize (${resolvedMinSize}) is greater than maxSize (${resolvedMaxSize}). The bounds are treated as ${lowerBound}–${upperBound} so the panel stays resizable.`,
        );
      }
    }, [resolvedMinSize, resolvedMaxSize, lowerBound, upperBound]);

    const initialSize = size ?? left ?? resolvedDefaultSize;

    const [internalSize, setInternalSize] = useState<number>(initialSize);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragOriginRef = useRef<{ pointer: number; size: number } | null>(
      null,
    );

    const isControlled = size !== undefined;
    const currentSize = isControlled ? size : internalSize;

    // Note: Removed ResizeObserver and runtime measurement. We rely on
    // flexbox `self-stretch` for the handle to grow to the available
    // cross-axis size, and use CSS `minWidth` / `minHeight` as fallbacks.

    const clampSize = useCallback(
      (val: number) => Math.min(Math.max(val, lowerBound), upperBound),
      [lowerBound, upperBound],
    );

    const updateSize = useCallback(
      (newSize: number) => {
        const clamped = clampSize(newSize);
        if (!isControlled) {
          setInternalSize(clamped);
        }
        onSizeChange?.(clamped);
      },
      [clampSize, isControlled, onSizeChange],
    );

    // ─── Pointer Drag Management ──────────────────────────────────────────────

    const handlePointerDown = (e: ReactPointerEvent<HTMLElement>) => {
      e.preventDefault();
      // Pointer capture is an enhancement; a test environment or an older
      // engine may not implement it.
      e.currentTarget.setPointerCapture?.(e.pointerId);
      dragOriginRef.current = {
        pointer: resolvedOrientation === "horizontal" ? e.clientX : e.clientY,
        size: currentSize,
      };
      setIsDragging(true);
    };

    const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
      const dragOrigin = dragOriginRef.current;
      if (!isDragging || !dragOrigin || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isHorizontal = resolvedOrientation === "horizontal";

      const totalSize = isHorizontal ? rect.width : rect.height;
      const pointer = isHorizontal ? e.clientX : e.clientY;

      if (totalSize > 0) {
        // Measure the pointer's travel from where the drag began rather than the
        // pointer's offset from the container's edge. The handle is the boundary
        // between the panes, and its own width — as well as the point inside it
        // that the drag started from — belongs to the handle, not to the size, so
        // it must not be counted into the panel's percentage.
        const deltaPercentage =
          ((pointer - dragOrigin.pointer) / totalSize) * 100;
        updateSize(dragOrigin.size + deltaPercentage);
      }
    };

    const handlePointerUp = (e: ReactPointerEvent<HTMLElement>) => {
      if (isDragging) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore capture release edge cases
        }
        dragOriginRef.current = null;
        setIsDragging(false);
      }
    };

    // ─── Keyboard Accessibility ───────────────────────────────────────────────

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      const isHorizontal = resolvedOrientation === "horizontal";
      const shrinkKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const expandKey = isHorizontal ? "ArrowRight" : "ArrowDown";

      if (e.key === shrinkKey) {
        e.preventDefault();
        updateSize(currentSize - resolvedStep);
      } else if (e.key === expandKey) {
        e.preventDefault();
        updateSize(currentSize + resolvedStep);
      } else if (e.key === "Home") {
        e.preventDefault();
        updateSize(lowerBound);
      } else if (e.key === "End") {
        e.preventDefault();
        updateSize(upperBound);
      }
    };

    const [child1, child2] = children;
    const isHorizontal = resolvedOrientation === "horizontal";

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          "flex relative",
          isDragging && "select-none",
          isHorizontal ? "flex-row" : "flex-col",
          className,
        )}
        style={{
          cursor: isDragging
            ? isHorizontal
              ? "col-resize"
              : "row-resize"
            : "default",
          // Ensure sensible minimums so the component works even when no
          // ancestor provides a definite size. These are fallbacks only, and
          // resolve through the cascade like every other visual token.
          minHeight: `${resolvedMinContainerHeight}px`,
          minWidth: `${resolvedMinContainerWidth}px`,
          ...style,
        }}
        {...props}>
        {/* Primary Panel */}
        <div
          className={cn(
            "min-w-0 min-h-0 overflow-auto",
            isDragging
              ? "transition-none"
              : "transition-[width,height] duration-150 ease-out",
          )}
          style={{
            [isHorizontal ? "width" : "height"]: `${currentSize}%`,
            flexShrink: 0,
            flexGrow: 0,
          }}>
          {child1}
        </div>

        {/* Separator / Drag Handle Container */}
        {!resolvedHideHandle && (
          // biome-ignore lint/a11y/useSemanticElements: interactive resizable handle requires div styling
          <div
            role="separator"
            tabIndex={0}
            aria-valuenow={Math.round(currentSize)}
            aria-valuemin={lowerBound}
            aria-valuemax={upperBound}
            // A side-by-side split is divided by a vertical separator; a stacked
            // split by a horizontal one. The orientation describes the separator,
            // not the axis the panes are laid out on.
            aria-orientation={isHorizontal ? "vertical" : "horizontal"}
            aria-label="Resize panel split"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            className={cn(
              "relative z-20 shrink-0 flex items-center justify-center outline-none select-none group touch-none",
              isHorizontal
                ? "w-4 self-stretch cursor-col-resize -mx-2"
                : "h-4 self-stretch w-full cursor-row-resize -my-2",
            )}>
            {/* 100% Full Height / Width Bar Indicator */}
            <div
              className={cn(
                "transition-colors duration-150",
                isHorizontal ? "w-1 self-stretch" : "h-1 self-stretch w-full",
                handleClassName
                  ? handleClassName
                  : isDragging
                    ? "bg-primary"
                    : "bg-border group-hover:bg-primary/70 group-focus-visible:bg-primary",
              )}
            />
          </div>
        )}

        {/* Secondary Panel */}
        <div
          className={cn(
            "min-w-0 min-h-0 overflow-auto",
            isDragging
              ? "transition-none"
              : "transition-[width,height] duration-150 ease-out",
          )}
          style={{
            // The secondary panel takes the room the primary panel leaves, so it
            // states only its growth; a width here would be dead with `flex: 1`.
            flex: 1,
          }}>
          {child2}
        </div>
      </div>
    );
  },
);

ResizableScreen.displayName = "ResizableScreen";
