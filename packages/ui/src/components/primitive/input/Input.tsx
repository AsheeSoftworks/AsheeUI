"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useId, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { defaultFieldSizeScale } from "../field/default-field-size-scale";
import type {
  FieldSizeKey,
  FieldSizeScale,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import { FieldShell } from "../field/field-shell";
import { flattenFieldSizeScale } from "../field/flatten-field-size-scale";

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border focus:border-primary",
  error: "border-danger focus:border-danger",
  warning: "border-warning focus:border-warning",
  success: "border-success focus:border-success",
};

export interface InputProps
  extends Omit<HTMLMotionProps<"input">, "size" | "children"> {
  size?: FieldSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  isLoading?: boolean;
  description?: string;
  message?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
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
      ...rest
    },
    ref,
  ) => {
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
        <motion.input
          ref={ref}
          id={fieldId}
          disabled={disabled}
          required={required}
          autoComplete="off"
          aria-invalid={resolvedStatus === "error"}
          aria-describedby={describedBy}
          aria-busy={isLoading}
          className={cn(
            "border bg-background text-foreground outline-none transition-colors",
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
      </FieldShell>
    );
  },
);
Input.displayName = "Input";
