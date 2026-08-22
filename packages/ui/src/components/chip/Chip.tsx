"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { CloseIcon } from "../../icons/CloseIcon";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimation } from "../../motion/resolve-animation";
import type { AnimationProp } from "../../motion/types";
import { type Color, resolveVariantClass } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type ChipConfig,
  type ChipSizeKey,
  type ChipVariant,
  FALLBACK_CHIP_CONFIG,
} from "./chip-config";
import {
  CHIP_FONT_CLASS,
  CHIP_GAP_CLASS,
  CHIP_HEIGHT_CLASS,
  CHIP_ICON_SIZE_CLASS,
  CHIP_PADDING_CLASS,
  CHIP_RADIUS_CLASS,
} from "./chip-styles";

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "size"> {
  variant?: ChipVariant;
  color?: Color;
  size?: ChipSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
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
      animation,
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const rawVariant = resolveCascade<string>(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant,
      FALLBACK_CHIP_CONFIG.variant,
    );

    // Fallback 'underlined' to 'bordered'
    const resolvedVariant: ChipVariant =
      rawVariant === "underlined" ? "bordered" : (rawVariant as ChipVariant);

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.theme.defaultColor as Color | undefined,
      FALLBACK_CHIP_CONFIG.color,
    );

    const resolvedSizeKey = resolveCascade<ChipSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CHIP_CONFIG.size,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
      config.theme.radius?.default,
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
      resolvedRadiusKey,
      CHIP_RADIUS_CLASS,
      FALLBACK_CHIP_CONFIG.radius,
    );

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    );

    const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (isDisabled) return;
      onClose?.(e);
    };

    return (
      <motion.div
        ref={ref}
        aria-disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        className={cn(
          "inline-flex items-center font-medium transition-colors select-none shrink-0",
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
        {...(motionProps as HTMLMotionProps<"div">)}
        {...(props as HTMLMotionProps<"div">)}>
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
        <span className="truncate">{children}</span>

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
      </motion.div>
    );
  },
);

Chip.displayName = "Chip";
