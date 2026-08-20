"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  FALLBACK_RESIZABLE_SCREEN_CONFIG,
  type ResizableOrientation,
  type ResizableScreenConfig,
} from "./resizable-screen-config";
import { RESIZABLE_SCREEN_RADIUS_CLASS } from "./resizable-screen-styles";

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
   * Visual variant for the notch indicator, matching Button styling.
   */
  handleVariant?: Variant;

  /**
   * Color theme for the notch indicator, matching Button styling.
   */
  handleColor?: Color;

  /**
   * Border radius for the notch indicator.
   */
  handleRadius?: keyof Radius;

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
      handleVariant: handleVariantProp,
      handleColor: handleColorProp,
      handleRadius: handleRadiusProp,
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

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

    const resolvedHandleVariant = resolveCascade<Variant>(
      handleVariantProp,
      sectionConfig?.handleVariant,
      config.theme.defaultVariant,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.handleVariant,
    );

    const resolvedHandleColor = resolveCascade<Color>(
      handleColorProp,
      sectionConfig?.handleColor,
      config.theme.defaultColor as Color | undefined,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.handleColor,
    );

    const resolvedHandleRadiusKey = resolveRadiusKey(
      handleRadiusProp,
      sectionConfig?.handleRadius
        ? { radius: sectionConfig.handleRadius }
        : undefined,
      config.theme.radius?.default,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.handleRadius,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const handleRadiusClass = resolveClassKey(
      resolvedHandleRadiusKey,
      RESIZABLE_SCREEN_RADIUS_CLASS,
      FALLBACK_RESIZABLE_SCREEN_CONFIG.handleRadius,
    );

    const initialSize =
      size ??
      left ??
      defaultSize ??
      sectionConfig?.defaultSize ??
      FALLBACK_RESIZABLE_SCREEN_CONFIG.defaultSize;

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
        e.currentTarget.releasePointerCapture(e.pointerId);
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
              "relative z-10 shrink-0 flex items-center justify-center outline-none group transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 select-none",
              isHorizontal
                ? "w-2.5 h-full cursor-col-resize -mx-1"
                : "h-2.5 w-full cursor-row-resize -my-1",
              sectionConfig?.handleClassName,
              handleClassName,
            )}>
            {/* Visual Divider Notch styled like Button */}
            <div
              className={cn(
                "transition-all duration-200",
                isHorizontal ? "w-1 h-10" : "h-1 w-10",
                resolveVariantClass(resolvedHandleVariant, resolvedHandleColor),
                handleRadiusClass,
                isDragging && "scale-110",
              )}
            />
          </div>
        )}

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
