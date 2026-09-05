"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveCascade } from "../../utils/resolve-token";
import {
  FALLBACK_RESIZABLE_SCREEN_CONFIG,
  type ResizableOrientation,
  type ResizableScreenConfig,
} from "./resizable-screen-config";

export interface ResizableScreenProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Exactly two child nodes representing the primary and secondary panels.
   */
  children: [ReactNode, ReactNode];

  /**
   * Initial size of the first panel as a percentage (0-100).
   * Alias for defaultSize.
   */
  left?: number;

  /**
   * Controlled size percentage (0-100) for the primary panel.
   */
  size?: number;

  /**
   * Default size percentage (0-100) for uncontrolled state.
   */
  defaultSize?: number;

  /**
   * Minimum percentage allowed for the primary panel.
   * @default 20
   */
  minSize?: number;

  /**
   * Maximum percentage allowed for the primary panel.
   * @default 80
   */
  maxSize?: number;

  /**
   * Step percentage size when using keyboard arrow keys.
   * @default 2
   */
  step?: number;

  /**
   * Layout direction of the split screen.
   * @default "horizontal"
   */
  orientation?: ResizableOrientation;

  /**
   * Option to completely hide the handle separator.
   * @default false
   */
  hideHandle?: boolean;

  /**
   * Callback fired when pane size changes.
   */
  onSizeChange?: (size: number) => void;

  /**
   * Additional custom styling for the resize handle bar container.
   */
  handleClassName?: string;
}

export const ResizableScreen = forwardRef<HTMLDivElement, ResizableScreenProps>(
  (
    {
      children,
      left,
      size,
      defaultSize,
      minSize: minSizeProp,
      maxSize: maxSizeProp,
      step: stepProp,
      orientation: orientationProp,
      hideHandle: hideHandleProp,
      onSizeChange,
      handleClassName,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.resizableScreen as
      | ResizableScreenConfig
      | undefined;

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const minSize = resolveCascade<number>(
      minSizeProp,
      sectionConfig?.minSize,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.minSize,
    );

    const maxSize = resolveCascade<number>(
      maxSizeProp,
      sectionConfig?.maxSize,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.maxSize,
    );

    const step = resolveCascade<number>(
      stepProp,
      sectionConfig?.step,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.step,
    );

    const orientation = resolveCascade<ResizableOrientation>(
      orientationProp,
      sectionConfig?.orientation,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.orientation,
    );

    const hideHandle = resolveCascade<boolean>(
      hideHandleProp,
      sectionConfig?.hideHandle,
      undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.hideHandle,
    );

    const initialSize =
      size ??
      left ??
      defaultSize ??
      sectionConfig?.defaultSize ??
      FALLBACK_RESIZABLE_SCREEN_CONFIG.defaultSize;

    const [internalSize, setInternalSize] = useState<number>(initialSize);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const isControlled = size !== undefined;
    const currentSize = isControlled ? size : internalSize;

    const clampSize = useCallback(
      (val: number) => Math.min(Math.max(val, minSize), maxSize),
      [minSize, maxSize],
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
      const isHorizontal = orientation === "horizontal";

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
      const isHorizontal = orientation === "horizontal";
      const shrinkKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const expandKey = isHorizontal ? "ArrowRight" : "ArrowDown";

      if (e.key === shrinkKey) {
        e.preventDefault();
        updateSize(currentSize - step);
      } else if (e.key === expandKey) {
        e.preventDefault();
        updateSize(currentSize + step);
      } else if (e.key === "Home") {
        e.preventDefault();
        updateSize(minSize);
      } else if (e.key === "End") {
        e.preventDefault();
        updateSize(maxSize);
      }
    };

    const [child1, child2] = children;
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          "w-full h-full min-h-[200px] min-w-0 min-h-0 relative flex",
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
          ...style,
        }}
        {...props}>
        {/* Primary Panel */}
        <div
          className={cn(
            "h-full w-full min-w-0 min-h-0 overflow-hidden shrink-0",
            isDragging
              ? "transition-none"
              : "transition-[width,height] duration-150 ease-out",
          )}
          style={{
            [isHorizontal ? "width" : "height"]: `${currentSize}%`,
          }}>
          {child1}
        </div>

        {/* Separator / Drag Handle Container */}
        {!hideHandle && (
          // biome-ignore lint/a11y/useSemanticElements: interactive resizable handle requires div styling
          <div
            role="separator"
            tabIndex={0}
            aria-valuenow={Math.round(currentSize)}
            aria-valuemin={minSize}
            aria-valuemax={maxSize}
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
                ? "w-4 h-full cursor-col-resize -mx-2"
                : "h-4 w-full cursor-row-resize -my-2",
            )}>
            {/* 100% Full Height / Width Bar Indicator */}
            <div
              className={cn(
                "transition-colors duration-150",
                isHorizontal ? "w-1 h-full" : "h-1 w-full",
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
            "h-full w-full min-w-0 min-h-0 overflow-hidden shrink-0 flex-1",
            isDragging
              ? "transition-none"
              : "transition-[width,height] duration-150 ease-out",
          )}
          style={{
            [isHorizontal ? "width" : "height"]: `${100 - currentSize}%`,
          }}>
          {child2}
        </div>
      </div>
    );
  },
);

ResizableScreen.displayName = "ResizableScreen";
