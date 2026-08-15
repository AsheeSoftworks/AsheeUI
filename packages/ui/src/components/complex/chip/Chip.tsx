"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, type ReactNode, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { type Color, resolveVariantClass } from "../../../shared/variant";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { CloseIcon } from "../../icons/CloseIcon";
import type {
  ChipConfig,
  ChipSizeKey,
  ChipSizeScale,
  ChipVariant,
} from "./chip-config";
import { defaultChipSizeScale } from "./default-chip-config";
import { flattenChipSizeScale } from "./flatten-chip-size-scale";

export interface ChipProps
  extends Omit<React.SelectHTMLAttributes<HTMLDivElement>, "color" | "size"> {
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
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
    const { settings } = useSettings();
    const sectionConfig = config.components?.chip as ChipConfig | undefined;

    // Design Token Resolvers
    const rawVariant = resolveValue(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant ?? "bordered",
    );

    // Fallback 'underlined' (e.g. from global theme) to 'bordered'
    const resolvedVariant: ChipVariant =
      rawVariant === "underlined" ? "bordered" : (rawVariant as ChipVariant);

    const resolvedColor = resolveValue(
      color,
      sectionConfig?.color,
      config.theme.defaultColor ?? "primary",
    );
    const resolvedRadiusKey = typeof radius === "string" ? radius : undefined;
    const resolvedSectionRadiusKey =
      typeof sectionConfig?.radius === "string"
        ? sectionConfig.radius
        : undefined;
    const resolvedRadius = resolveScale(
      resolvedRadiusKey,
      resolvedSectionRadiusKey,
      config.theme.radius.default,
      config.theme.radius.values,
    );

    const sizeScale = (sectionConfig?.size ??
      defaultChipSizeScale) as ChipSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;

    const responsiveVars = useMemo(
      () => flattenChipSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-chip-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
    );

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
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
          isDisabled && "opacity-50 pointer-events-none cursor-not-allowed",
          onClick &&
            !isDisabled &&
            "cursor-pointer hover:opacity-90 active:scale-[0.98]",
          sectionConfig?.className,
          className,
        )}
        style={{
          height: `var(--ashee-chip-${resolvedSizeKey}-h)`,
          paddingInline: `var(--ashee-chip-${resolvedSizeKey}-px)`,
          fontSize: `var(--ashee-chip-${resolvedSizeKey}-font-s)`,
          gap: `var(--ashee-chip-${resolvedSizeKey}-gap)`,
          borderRadius: resolvedRadius,
          ...style,
        }}
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
            className="inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full"
            style={{
              width: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
              height: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
            }}>
            {avatar}
          </span>
        )}

        {/* Start Icon */}
        {startIcon && !avatar && (
          <span
            className="inline-flex items-center justify-center shrink-0"
            style={{
              width: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
              height: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
            }}>
            {startIcon}
          </span>
        )}

        {/* Content */}
        <span className="truncate">{children}</span>

        {/* End Icon */}
        {endIcon && !onClose && (
          <span
            className="inline-flex items-center justify-center shrink-0"
            style={{
              width: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
              height: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
            }}>
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
            )}
            style={{
              width: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
              height: `var(--ashee-chip-${resolvedSizeKey}-icon-s)`,
            }}>
            {closeIcon ?? (
              <CloseIcon
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </button>
        )}
      </motion.div>
    );
  },
);

Chip.displayName = "Chip";
