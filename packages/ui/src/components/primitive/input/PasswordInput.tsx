"use client";

import { useSettings } from "@ashee/settings";
import { useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useId, useMemo, useState } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { EyeIcon } from "../../icons/EyeIcon";
import { EyeOffIcon } from "../../icons/EyeOffIcon";
import { defaultFieldSizeScale } from "../field/default-field-size-scale";
import type { FieldSizeScale, FieldStatus } from "../field/field-config";
import { FieldShell } from "../field/field-shell";
import { flattenFieldSizeScale } from "../field/flatten-field-size-scale";
import type { InputProps } from "./Input";

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border focus:border-primary",
  error: "border-danger focus:border-danger",
  warning: "border-warning focus:border-warning",
  success: "border-success focus:border-success",
};

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  toggleAriaLabel?: (show: boolean) => string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      size,
      radius,
      animation,
      status,
      label,
      labelAlign,
      description,
      message,
      required,
      isLoading,
      id,
      className,
      disabled,
      toggleAriaLabel,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.input;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const messageId = message ? `${fieldId}-message` : undefined;
    const describedBy =
      [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

    const sizeScale = (sectionConfig?.size ??
      defaultFieldSizeScale) as FieldSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenFieldSizeScale("input", sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-input-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const resolvedRadius = resolveScale(
      radius,
      sectionConfig?.radius,
      config.theme.radius.default,
      config.theme.radius.values,
    );
    const resolvedStatus = status ?? "default";
    const resolvedLabelAlign = resolveValue(
      labelAlign,
      sectionConfig?.labelAlign,
      "left",
    );
    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
    );

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        descriptionId={descriptionId}
        message={message}
        messageId={messageId}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
        <div className="relative flex items-center w-full">
          <motion.input
            ref={ref}
            id={fieldId}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            required={required}
            autoComplete="current-password"
            aria-invalid={resolvedStatus === "error"}
            aria-describedby={describedBy}
            aria-busy={isLoading}
            className={cn(
              "w-full border bg-background text-foreground outline-none transition-colors pr-10",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              STATUS_BORDER_CLASS[resolvedStatus],
              sectionConfig?.className,
              className,
            )}
            style={{
              borderRadius: resolvedRadius,
              paddingInline: `var(--ashee-input-${resolvedSizeKey}-padding-x)`,
              paddingBlock: `var(--ashee-input-${resolvedSizeKey}-padding-y)`,
              fontSize: `var(--ashee-input-${resolvedSizeKey}-font-size)`,
            }}
            {...(motionProps as HTMLMotionProps<"input">)}
            {...rest}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              toggleAriaLabel
                ? toggleAriaLabel(showPassword)
                : showPassword
                  ? "Hide password"
                  : "Show password"
            }
            className={cn(
              "absolute right-3 p-1 rounded text-muted-foreground hover:text-foreground transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              disabled && "pointer-events-none opacity-50",
            )}>
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </FieldShell>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
