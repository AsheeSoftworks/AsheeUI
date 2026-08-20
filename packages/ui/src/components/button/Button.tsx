"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, type MotionProps, motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { AnimationProp } from "../../motion/types";
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
import { Spinner } from "../spinner/spinner";
import type {
  ButtonAnimationPreset,
  ButtonConfig,
  ButtonSizeKey,
} from "./button-config";
import {
  BUTTON_ICON_SIZE_CLASS,
  BUTTON_RADIUS_CLASS,
  BUTTON_SIZE_CLASS,
} from "./button-styles";

// ─── Base Props ───────────────────────────────────────────────────────────────

export interface ButtonCommonProps {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp<ButtonAnimationPreset>;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

type CleanMotionButtonProps = Omit<
  HTMLMotionProps<"button">,
  keyof MotionProps | "children" | "color" | "disabled" | "className"
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
      type = "button",
      onClick,
      ...rest
    } = props;

    // Inside Button.tsx component body
    const config = useAsheeConfig();
    const sectionConfig = config.components?.button as ButtonConfig | undefined;

    // 1. Variant (Instance -> Section -> Theme Global -> Hard Fallback)
    const resolvedVariant = resolveCascade(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant,
      "bordered",
    );

    // 2. Color (Instance -> Section -> Theme Global -> Hard Fallback)
    const resolvedColor = resolveCascade(
      color,
      sectionConfig?.color,
      config.theme.defaultColor,
      "primary",
    );

    // 3. Size (Instance -> Section -> Hard Fallback)
    const resolvedSizeKey = resolveCascade<ButtonSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      "md",
    );

    // 4. Radius Key (Instance -> Section -> Theme Global -> Hard Fallback)
    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
      config.theme.radius?.default,
      "md",
    );

    const sizeClasses = icon
      ? BUTTON_ICON_SIZE_CLASS[resolvedSizeKey]
      : BUTTON_SIZE_CLASS[resolvedSizeKey];

    const sharedClassName = cn(
      "inline-flex items-center justify-center font-medium transition-colors select-none shrink-0",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      resolveVariantClass(resolvedVariant, resolvedColor),
      sizeClasses,
      resolveClassKey(resolvedRadiusKey, BUTTON_RADIUS_CLASS, "md"),
      className,
    );

    const isInteractionDisabled = isDisabled || isLoading;

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
        {...rest}>
        {isLoading && <Spinner className={resolvedSizeKey} />}
        {isLoading && <span className="sr-only">Loading</span>}
        {isLoading && icon ? null : children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
