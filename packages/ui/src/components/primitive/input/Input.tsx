"use client";

import { useSettings } from "@ashee/settings";
import { type Radius, useResponsiveVars } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useMemo,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { resolveAnimation } from "../../../libs/motion/resolve-animation";
import type { AnimationProp } from "../../../libs/motion/types";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../../shared/variant";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { defaultFieldSizeScale } from "../field/default-field-size-scale";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldSizeScale,
  FieldStatus,
  InputAnimationPreset,
  LabelAlign,
} from "../field/field-config";
import { flattenFieldSizeScale } from "../field/flatten-field-size-scale";

// ─── Status Class Override ───────────────────────────────────────────────────

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "",
  error:
    "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
  warning:
    "border-warning focus-visible:border-warning focus-visible:ring-warning/20",
  success:
    "border-success focus-visible:border-success focus-visible:ring-success/20",
};

// ─── Component Interface ──────────────────────────────────────────────────────

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "children"
  > {
  size?: FieldSizeKey;
  radius?: keyof Radius;
  variant?: Variant;
  color?: Color;
  animation?: AnimationProp<InputAnimationPreset>;
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  isLoading?: boolean;
  description?: string;
  message?: string;
  required?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      radius,
      variant,
      color,
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
      startContent,
      endContent,
      style,
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

    // ─── Token Resolvers ──────────────────────────────────────────────────────

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

    const resolvedVariant = resolveValue<Variant>(
      variant,
      sectionConfig?.variant,
      (config.theme.defaultVariant as Variant) ?? "bordered",
    );

    const resolvedColor = resolveValue<Color>(
      color,
      sectionConfig?.color,
      (config.theme.defaultColor as Color) ?? "primary",
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

    // Apply global variant/color styling & active status override
    const variantClass = resolveVariantClass(resolvedVariant, resolvedColor);
    const statusClass =
      resolvedStatus !== "default" ? STATUS_BORDER_CLASS[resolvedStatus] : "";

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
          {startContent}
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
              "w-full text-foreground outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              variantClass,
              statusClass,
              sectionConfig?.className,
              className,
            )}
            style={{
              borderRadius:
                resolvedVariant === "underlined" ? "0px" : resolvedRadius,
              paddingInline: `var(--ashee-input-${resolvedSizeKey}-padding-x)`,
              paddingBlock: `var(--ashee-input-${resolvedSizeKey}-padding-y)`,
              fontSize: `var(--ashee-input-${resolvedSizeKey}-font-size)`,
              ...style,
            }}
            {...(motionProps as HTMLMotionProps<"input">)}
            {...(rest as HTMLMotionProps<"input">)}
          />
          {endContent}
        </div>
      </FieldShell>
    );
  },
);

Input.displayName = "Input";
