import type { Radius } from "@ashee/config";
import { type AnimationProp, resolveAnimation } from "@ashee/motion";
import { useSettings } from "@ashee/settings";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import type { ButtonConfig, ButtonSize, ButtonVariant } from "./button-config";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-secondary",
  secondary: "bg-secondary text-foreground border border-border",
  danger: "bg-danger text-secondary",
  success: "bg-success text-secondary",
  ghost: "bg-transparent text-foreground hover:bg-border/20",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-md",
  lg: "px-6 py-3 text-lg",
};

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: keyof Radius;
  animation?: AnimationProp;
  isDisabled?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      radius,
      animation,
      isDisabled,
      type = "button",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.button as ButtonConfig | undefined;

    const resolvedVariant = resolveValue(
      variant,
      sectionConfig?.variant,
      "primary",
    );
    const resolvedSize = resolveValue(size, sectionConfig?.size, "md");
    const resolvedRadius = resolveScale(
      radius,
      sectionConfig?.radius,
      config.theme.radius.default,
      config.theme.radius.values,
    );
    const motionProps = resolveAnimation(
      animation ?? sectionConfig?.animation,
      settings.enableAnimations,
    );

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          VARIANT_CLASS[resolvedVariant as ButtonVariant],
          SIZE_CLASS[resolvedSize as ButtonSize],
          "font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
          sectionConfig?.className,
          className,
        )}
        style={{ borderRadius: resolvedRadius }}
        {...motionProps}
        {...rest}>
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
