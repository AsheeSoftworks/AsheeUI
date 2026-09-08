/**
 * ResizableScreen component for AsheeUI.
 * This file provides the main ResizableScreen component implementation, which
 * renders a split panel layout with a draggable handle for resizing. It supports
 * horizontal and vertical orientations, keyboard controls, and configurable
 * min/max size constraints. Visual tokens resolve through the standard AsheeUI
 * cascade system.
 */
"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
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
  left?: number;

  /**
   * Controlled size percentage (0-100) for the primary panel.
   * When provided, the component becomes controlled.
   */
  size?: number;

  /**
   * Callback fired when pane size changes.
   * Receives the new size percentage of the primary panel.
   */
  onSizeChange?: (size: number) => void;

  /**
   * Additional custom styling for the resize handle bar container.
   */
  handleClassName?: string;

  /**
   * Minimum height of the resizable container in pixels.
   * Used when the container has no explicit height from its parent.
   * @default 200
   */
  minContainerHeight?: number;

  /**
   * Minimum width of the resizable container in pixels.
   * Used when the container has no explicit width from its parent.
   * @default 200
   */
  minContainerWidth?: number;
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
 * @param props.minContainerHeight - Minimum container height in pixels. Defaults to 200.
 * @param props.minContainerWidth - Minimum container width in pixels. Defaults to 200.
 * @param props.className - Extra classes for the container.
 *
 * @example
 * ```tsx
 * import { ResizableScreen } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <ResizableScreen
 *       defaultSize={60}
 *       minSize={30}
 *       maxSize={70}
 *       orientation="horizontal"
 *     >
 *       <div className="bg-blue-100 p-4">Left Panel</div>
 *       <div className="bg-green-100 p-4">Right Panel</div>
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
 *   <div className="bg-red-100 p-4">Top Panel</div>
 *   <div className="bg-blue-100 p-4">Bottom Panel</div>
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
      minContainerHeight = 200,
      minContainerWidth = 200,
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

    const initialSize = size ?? left ?? resolvedDefaultSize;

    const [internalSize, setInternalSize] = useState<number>(initialSize);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const isControlled = size !== undefined;
    const currentSize = isControlled ? size : internalSize;

    // Note: Removed ResizeObserver and runtime measurement. We rely on
    // flexbox `self-stretch` for the handle to grow to the available
    // cross-axis size, and use CSS `minWidth` / `minHeight` as fallbacks.

    const clampSize = useCallback(
      (val: number) =>
        Math.min(Math.max(val, resolvedMinSize), resolvedMaxSize),
      [resolvedMinSize, resolvedMaxSize],
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
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
    };

    const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isHorizontal = resolvedOrientation === "horizontal";

      const totalSize = isHorizontal ? rect.width : rect.height;
      const currentPos = isHorizontal
        ? e.clientX - rect.left
        : e.clientY - rect.top;

      if (totalSize > 0) {
        const calculatedPercentage = (currentPos / totalSize) * 100;
        updateSize(calculatedPercentage);
      }
    };

    const handlePointerUp = (e: ReactPointerEvent<HTMLElement>) => {
      if (isDragging) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore capture release edge cases
        }
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
        updateSize(resolvedMinSize);
      } else if (e.key === "End") {
        e.preventDefault();
        updateSize(resolvedMaxSize);
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
          // ancestor provides a definite size. These are fallbacks only.
          minHeight: `${minContainerHeight}px`,
          minWidth: `${minContainerWidth}px`,
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
            aria-valuemin={resolvedMinSize}
            aria-valuemax={resolvedMaxSize}
            aria-orientation={isHorizontal ? "horizontal" : "vertical"}
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
            [isHorizontal ? "width" : "height"]: `${100 - currentSize}%`,
            flex: 1,
          }}>
          {child2}
        </div>
      </div>
    );
  },
);

ResizableScreen.displayName = "ResizableScreen";
