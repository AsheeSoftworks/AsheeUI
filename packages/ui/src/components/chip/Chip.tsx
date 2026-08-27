"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { CloseIcon } from "../../icons/CloseIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import { type Color, resolveVariantClass } from "../../shared/variant";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type ChipConfig,
  type ChipVariant,
  FALLBACK_CHIP_CONFIG,
} from "./chip-config";
import {
  CHIP_FONT_CLASS,
  CHIP_GAP_CLASS,
  CHIP_HEIGHT_CLASS,
  CHIP_ICON_SIZE_CLASS,
  CHIP_PADDING_CLASS,
} from "./chip-styles";

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "size"> {
  variant?: ChipVariant;
  color?: Color;
  size?: Size;
  radius?: Radius;
  isDisabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  avatar?: ReactNode;
  dot?: boolean | string;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  closeIcon?: ReactNode;
  children?: ReactNode;
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant,
      color,
      size,
      radius,
      isDisabled = false,
      startIcon,
      endIcon,
      avatar,
      dot,
      onClose,
      closeIcon,
      children,
      className,
      style,
      onClick,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.chip as ChipConfig | undefined;

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const rawVariant = resolveCascade<string>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant as ChipVariant | undefined,
      FALLBACK_CHIP_CONFIG.variant,
    );

    // Fallback 'underlined' to 'bordered'
    const resolvedVariant: ChipVariant =
      rawVariant === "underlined" ? "bordered" : (rawVariant as ChipVariant);

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor as Color | undefined,
      FALLBACK_CHIP_CONFIG.color,
    );

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CHIP_CONFIG.size,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius as Radius,
      FALLBACK_CHIP_CONFIG.radius,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const heightClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_HEIGHT_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const paddingClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_PADDING_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_FONT_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const gapClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_GAP_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const iconSizeClass = resolveClassKey(
      resolvedSizeKey,
      CHIP_ICON_SIZE_CLASS,
      FALLBACK_CHIP_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_CHIP_CONFIG.radius,
    );

    const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (isDisabled) return;
      onClose?.(e);
    };

    // Handle click events (mouse)
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      onClick?.(e);
    };

    // Handle keyboard events (enter/space)
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (isDisabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Create a synthetic mouse event or call onClick directly
        // We'll simulate a mouse event by creating a new object
        const syntheticMouseEvent = {
          ...e,
          button: 0,
          buttons: 1,
          clientX: 0,
          clientY: 0,
          pageX: 0,
          pageY: 0,
          screenX: 0,
          screenY: 0,
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          type: "click",
        } as unknown as MouseEvent<HTMLDivElement>;

        onClick?.(syntheticMouseEvent);
      }
    };

    return (
      <div
        ref={ref}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center font-medium transition-all duration-200 select-none shrink-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          resolveVariantClass(resolvedVariant, resolvedColor),
          heightClass,
          paddingClass,
          fontClass,
          gapClass,
          radiusClass,
          isDisabled && "opacity-50 pointer-events-none cursor-not-allowed",
          onClick &&
            !isDisabled &&
            "cursor-pointer hover:opacity-90 active:scale-[0.98]",
          sectionConfig?.className,
          className,
        )}
        style={style}
        {...props}>
        {/* Status Dot */}
        {dot && (
          <span
            className="shrink-0 rounded-full"
            style={{
              width: "0.5em",
              height: "0.5em",
              backgroundColor: typeof dot === "string" ? dot : "currentColor",
            }}
          />
        )}

        {/* Avatar */}
        {avatar && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full",
              iconSizeClass,
            )}>
            {avatar}
          </span>
        )}

        {/* Start Icon */}
        {startIcon && !avatar && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass,
            )}>
            {startIcon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* End Icon */}
        {endIcon && !onClose && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass,
            )}>
            {endIcon}
          </span>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            aria-label="Remove chip"
            disabled={isDisabled}
            onClick={handleClose}
            className={cn(
              "inline-flex items-center justify-center shrink-0 rounded-full transition-opacity",
              "hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current",
              "opacity-80 -mr-1",
              iconSizeClass,
            )}>
            {closeIcon ?? <CloseIcon className="w-full h-full" />}
          </button>
        )}
      </div>
    );
  },
);

Chip.displayName = "Chip";
