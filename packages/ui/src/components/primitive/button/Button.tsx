import { type AnimationProp, resolveAnimation } from "@ashee/motion";
import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, type ReactNode, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
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

interface ButtonBaseProps
  extends Omit<HTMLMotionProps<"button">, "children" | "color"> {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export type ButtonProps =
  | (ButtonBaseProps & { icon?: false; children: ReactNode })
  | (ButtonBaseProps & {
      icon: true;
      "aria-label": string;
      children: ReactNode;
    });

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      color,
      size,
      radius,
      animation,
      isDisabled,
      isLoading,
      icon,
      type = "button",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.button as ButtonConfig;

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

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isInteractionDisabled}
        aria-disabled={isInteractionDisabled}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          resolveVariantClass(resolvedVariant, resolvedColor),
          sectionConfig?.className,
          className,
        )}
        style={{
          borderRadius: resolvedRadius,
          paddingInline: icon
            ? `var(--ashee-button-${resolvedSizeKey}-padding-y)`
            : `var(--ashee-button-${resolvedSizeKey}-padding-x)`,
          paddingBlock: `var(--ashee-button-${resolvedSizeKey}-padding-y)`,
          fontSize: `var(--ashee-button-${resolvedSizeKey}-font-size)`,
          gap: `var(--ashee-button-${resolvedSizeKey}-gap)`,
        }}
        {...motionProps}
        {...rest}>
        {isLoading && <Spinner className={resolvedSizeKey} />}
        {isLoading && <span className="sr-only">Loading</span>}
        {isLoading && icon ? null : children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
