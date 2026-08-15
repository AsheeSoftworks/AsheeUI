"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, type MotionProps, motion } from "framer-motion";
import { type CSSProperties, forwardRef, type ReactNode, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../../shared/variant";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { Spinner } from "../spinner/spinner";
import type {
  ButtonAnimationPreset,
  ButtonConfig,
  ButtonSizeKey,
} from "./button-config";
import { defaultButtonSizeScale } from "./default-button-config";
import { flattenButtonSizeScale } from "./flatten-button-size-scale";

// ─── Base Props & Cleaned Types ──────────────────────────────────────────────

export interface ButtonCommonProps {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp<ButtonAnimationPreset>;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  style?: CSSProperties;
}

type CleanMotionButtonProps = Omit<
  HTMLMotionProps<"button">,
  keyof MotionProps | "children" | "color" | "disabled" | "style" | "className"
>;

type BaseButtonProps = ButtonCommonProps &
  CleanMotionButtonProps & {
    type?: "button" | "submit" | "reset";
  };

export type ButtonProps =
  | (BaseButtonProps & { icon?: false; children: ReactNode })
  | (BaseButtonProps & {
      icon: true;
      "aria-label": string;
      children: ReactNode;
    });

// ─── Component Implementation ─────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant,
      color,
      size,
      radius,
      animation,
      isDisabled,
      isLoading,
      icon,
      className,
      children,
      style,
      type = "button",
      onClick,
      ...rest
    } = props;

    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.button as ButtonConfig | undefined;

    const resolvedVariant = resolveValue(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant ?? "bordered",
    );
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
    const motionProps = resolveAnimation(
      animation ?? sectionConfig?.animation,
      settings.enableAnimations,
    );
    const isInteractionDisabled = isDisabled || isLoading;

    const sizeScale = sectionConfig?.size ?? defaultButtonSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenButtonSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-button-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const sharedClassName = cn(
      "inline-flex items-center justify-center font-medium transition-colors select-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      resolveVariantClass(resolvedVariant, resolvedColor),
      sectionConfig?.className,
      className,
    );

    const sharedStyle = {
      borderRadius: resolvedRadius,
      paddingInline: icon
        ? `var(--ashee-button-${resolvedSizeKey}-padding-y)`
        : `var(--ashee-button-${resolvedSizeKey}-padding-x)`,
      paddingBlock: `var(--ashee-button-${resolvedSizeKey}-padding-y)`,
      fontSize: `var(--ashee-button-${resolvedSizeKey}-font-size)`,
      gap: `var(--ashee-button-${resolvedSizeKey}-gap)`,
      ...style,
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isInteractionDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isInteractionDisabled}
        aria-disabled={isInteractionDisabled}
        aria-busy={isLoading}
        onClick={handleClick}
        className={sharedClassName}
        style={sharedStyle}
        {...(motionProps as HTMLMotionProps<"button">)}
        {...rest}>
        {isLoading && <Spinner className={resolvedSizeKey} />}
        {isLoading && <span className="sr-only">Loading</span>}
        {isLoading && icon ? null : children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
