"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, type ReactNode, useMemo } from "react";
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
import type { ButtonConfig, ButtonSizeKey } from "./button-config";
import { defaultButtonSizeScale } from "./default-button-config";
import { flattenButtonSizeScale } from "./flatten-button-size-scale";

// ─── Base Props & Polymorphic Types ──────────────────────────────────────────

export interface ButtonCommonProps {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  isDisabled?: boolean;
  isLoading?: boolean;
  isExternal?: boolean;
}

type MotionButtonProps = Omit<
  HTMLMotionProps<"button">,
  "children" | "color" | "disabled"
>;
type MotionAnchorProps = Omit<HTMLMotionProps<"a">, "children" | "color">;

type ButtonAsButton = ButtonCommonProps &
  MotionButtonProps & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsLink = ButtonCommonProps &
  MotionAnchorProps & {
    href: string;
    type?: undefined;
  };

type ButtonElementProps = ButtonAsButton | ButtonAsLink;

export type ButtonProps =
  | (ButtonElementProps & { icon?: false; children: ReactNode })
  | (ButtonElementProps & {
      icon: true;
      "aria-label": string;
      children: ReactNode;
    });

// ─── Component Implementation ─────────────────────────────────────────────────

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    variant,
    color,
    size,
    radius,
    animation,
    isDisabled,
    isLoading,
    isExternal,
    icon,
    className,
    children,
    style,
    href,
    type = href ? undefined : "button",
    target,
    rel,
    onClick,
    ...rest
  } = props as ButtonProps & {
    href?: string;
    target?: string;
    rel?: string;
    onClick?: (e: React.MouseEvent) => void;
  };

  const config = useAsheeConfig();
  const { settings } = useSettings();
  const sectionConfig = config.components?.button as ButtonConfig | undefined;

  const resolvedVariant = resolveValue(
    variant,
    sectionConfig?.variant,
    config.theme.defaultVariant ?? "solid",
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
  const resolvedIsExternal = isExternal ?? sectionConfig?.isExternal ?? false;

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

  const handleClick = (e: React.MouseEvent) => {
    if (isInteractionDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const content = (
    <>
      {isLoading && <Spinner className={resolvedSizeKey} />}
      {isLoading && <span className="sr-only">Loading</span>}
      {isLoading && icon ? null : children}
    </>
  );

  // Render Link (motion.a) if href is passed
  if (href !== undefined) {
    const targetAttr = target ?? (resolvedIsExternal ? "_blank" : undefined);
    const relAttr =
      rel ??
      (resolvedIsExternal || targetAttr === "_blank"
        ? "noopener noreferrer"
        : undefined);

    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={isInteractionDisabled ? undefined : href}
        target={targetAttr}
        rel={relAttr}
        aria-disabled={isInteractionDisabled}
        onClick={handleClick}
        className={sharedClassName}
        style={sharedStyle}
        {...(motionProps as HTMLMotionProps<"a">)}
        {...(rest as Omit<HTMLMotionProps<"a">, "children" | "color">)}>
        {content}
      </motion.a>
    );
  }

  // Render Button (motion.button)
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type ?? "button"}
      disabled={isInteractionDisabled}
      aria-disabled={isInteractionDisabled}
      aria-busy={isLoading}
      onClick={handleClick}
      className={sharedClassName}
      style={sharedStyle}
      {...(motionProps as HTMLMotionProps<"button">)}
      {...(rest as Omit<HTMLMotionProps<"button">, "children" | "color">)}>
      {content}
    </motion.button>
  );
});

Button.displayName = "Button";
