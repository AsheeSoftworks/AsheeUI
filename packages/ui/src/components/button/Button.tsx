"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type MouseEvent, type ReactNode } from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { Spinner } from "../spinner/spinner";
import { type ButtonConfig, FALLBACK_BUTTON_CONFIG } from "./button-config";
import { BUTTON_ICON_SIZE_CLASS, BUTTON_SIZE_CLASS } from "./button-styles";

export interface ButtonCommonProps {
  variant?: Variant;
  color?: Color;
  size?: Size;
  radius?: Radius;
  animate?: boolean;
  fullWidth?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

type CleanButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color" | "disabled" | "className" | "children"
>;

type ButtonProps = ButtonCommonProps &
  CleanButtonProps & {
    type?: "button" | "submit" | "reset";
    icon?: boolean;
    children?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant,
      color,
      size,
      radius,
      animate,
      fullWidth,
      isDisabled,
      isLoading,
      icon,
      className,
      children,
      type = "button",
      onClick,
      ...rest
    } = props;

    const config = useAsheeConfig();
    const sectionConfig = config.components?.button as ButtonConfig | undefined;

    const resolvedVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_BUTTON_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_BUTTON_CONFIG.color,
    );

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_BUTTON_CONFIG.size,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_BUTTON_CONFIG.radius,
    );

    const resolvedAnimate = resolveCascade<boolean>(
      animate,
      sectionConfig?.animate,
      FALLBACK_BUTTON_CONFIG.animate,
      FALLBACK_BUTTON_CONFIG.animate,
    );

    const resolvedFullWidth = resolveCascade<boolean>(
      fullWidth,
      sectionConfig?.fullWidth,
      undefined,
      FALLBACK_BUTTON_CONFIG.fullWidth,
    );

    const sizeClasses = icon
      ? BUTTON_ICON_SIZE_CLASS[resolvedSizeKey]
      : BUTTON_SIZE_CLASS[resolvedSizeKey];

    const isInteractionDisabled = isDisabled || isLoading;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isInteractionDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const sharedClassName = cn(
      "inline-flex items-center justify-center font-medium transition-colors select-none shrink-0",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      resolvedFullWidth && "w-full",
      resolvedAnimate &&
        "motion-safe:transition-transform motion-safe:duration-100 motion-safe:active:scale-[0.99]",
      resolveVariantClass(resolvedVariant, resolvedColor),
      sizeClasses,
      resolveClassKey(
        resolvedRadiusKey,
        RADIUS_CLASS,
        FALLBACK_BUTTON_CONFIG.radius,
      ),
      className,
    );

    return (
      <button
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
      </button>
    );
  },
);

Button.displayName = "Button";
