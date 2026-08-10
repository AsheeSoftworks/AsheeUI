"use client";

import { cn } from "@ashee/utils";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../context";
import { defaultResizableScreenConfig } from "./default-resizable-screen-config";
import type {
  ResizableOrientation,
  ResizableScreenConfig,
} from "./resizable-screen-config";

export interface ResizableScreenProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
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
   * Callback fired when pane size changes.
   */
  onSizeChange?: (size: number) => void;

  /**
   * Additional custom styling for the resize handle bar.
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

    const minSize =
      minSizeProp ??
      sectionConfig?.minSize ??
      (defaultResizableScreenConfig.minSize as number);
    const maxSize =
      maxSizeProp ??
      sectionConfig?.maxSize ??
      (defaultResizableScreenConfig.maxSize as number);
    const step =
      stepProp ??
      sectionConfig?.step ??
      (defaultResizableScreenConfig.step as number);
    const orientation =
      orientationProp ??
      sectionConfig?.orientation ??
      (defaultResizableScreenConfig.orientation as number | undefined);

    const initialSize =
      size ??
      left ??
      defaultSize ??
      sectionConfig?.defaultSize ??
      (defaultResizableScreenConfig.defaultSize as number);

    const [internalSize, setInternalSize] = useState<number>(initialSize);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
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

    const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
      if (isDragging) {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDragging(false);
      }
    };

    // ─── Keyboard Accessibility ───────────────────────────────────────────────

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
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
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        className={cn(
          "w-full h-full min-h-0 relative select-none flex",
          isHorizontal ? "flex-row" : "flex-col",
          isDragging &&
            (isHorizontal ? "cursor-col-resize" : "cursor-row-resize"),
          sectionConfig?.className,
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
          className="h-full w-full overflow-hidden shrink-0 transition-[width,height] duration-75 ease-linear"
          style={{
            [isHorizontal ? "width" : "height"]: `${currentSize}%`,
          }}>
          {child1}
        </div>

        {/* Separator / Drag Handle */}
        {/* biome-ignore lint/a11y/useSemanticElements: interactive resizable handle requires div styling */}
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
            "relative z-10 shrink-0 flex items-center justify-center outline-none group transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
            isHorizontal
              ? "w-2.5 h-full cursor-col-resize -mx-1"
              : "h-2.5 w-full cursor-row-resize -my-1",
            sectionConfig?.handleClassName,
            handleClassName,
          )}>
          {/* Visual Divider Notch */}
          <div
            className={cn(
              "rounded-full bg-border group-hover:bg-primary group-focus-visible:bg-primary transition-colors duration-200",
              isDragging && "bg-primary scale-105",
              isHorizontal ? "w-1 h-10" : "h-1 w-10",
            )}
          />
        </div>

        {/* Secondary Panel */}
        <div
          className="h-full w-full overflow-hidden shrink-0 flex-1"
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
