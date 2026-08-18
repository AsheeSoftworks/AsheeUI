"use client";
import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  useId,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { type Color, resolveVariantClass } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
import { useResponsiveVars } from "../../../theme/token/responsive/use-responsive-vars";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import { defaultSwitchSizeScale } from "./default-switch-config";
import { flattenSwitchSizeScale } from "./flatten-switch-size-scale";
import type { SwitchConfig, SwitchSizeScale } from "./switch-config";

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border",
  error: "border-danger",
  warning: "border-warning",
  success: "border-success",
};

export interface SwitchProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "children"
  > {
  size?: FieldSizeKey;
  color?: string;
  radius?: keyof Radius;
  animation?: AnimationProp;
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  description?: string;
  message?: string;
  required?: boolean;
  isLoading?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size,
      color,
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
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.switch as SwitchConfig | undefined;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const messageId = message ? `${fieldId}-message` : undefined;

    // Controlled / Uncontrolled state handling
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isChecked = controlledChecked ?? uncontrolledChecked;

    // Responsive Size Scale Engine
    const sizeScale = (sectionConfig?.size ??
      defaultSwitchSizeScale) as SwitchSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenSwitchSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-switch-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    // Token Resolvers
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
    const resolvedStatus = status ?? "default";
    const resolvedLabelAlign = resolveValue(
      labelAlign,
      sectionConfig?.labelAlign,
      "left",
    );
    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    );

    const isInteractionDisabled = disabled || isLoading;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (isInteractionDisabled) return;
      const nextChecked = e.target.checked;
      if (controlledChecked === undefined) {
        setUncontrolledChecked(nextChecked);
      }
      onChange?.(nextChecked, e);
    };

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
        <label
          htmlFor={fieldId}
          className={cn(
            "inline-flex items-center gap-3 select-none cursor-pointer",
            isInteractionDisabled &&
              "opacity-50 pointer-events-none cursor-not-allowed",
          )}>
          <div
            className="relative shrink-0 inline-flex items-center"
            style={{
              width: `var(--ashee-switch-${resolvedSizeKey}-track-w)`,
              height: `var(--ashee-switch-${resolvedSizeKey}-track-h)`,
            }}>
            {/* Native Accessible Input */}
            <input
              ref={ref}
              id={fieldId}
              type="checkbox"
              role="switch"
              checked={isChecked}
              disabled={isInteractionDisabled}
              required={required}
              aria-checked={isChecked}
              aria-invalid={resolvedStatus === "error"}
              aria-busy={isLoading}
              onChange={handleChange}
              className="sr-only peer"
              {...(rest as unknown as InputHTMLAttributes<HTMLInputElement>)}
            />

            {/* Track Background */}
            <div
              className={cn(
                "absolute inset-0 border transition-colors duration-200",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                STATUS_BORDER_CLASS[resolvedStatus],
                isChecked
                  ? resolveVariantClass("solid", resolvedColor as Color)
                  : "bg-border/60",
                sectionConfig?.className,
                className,
              )}
              style={{ borderRadius: resolvedRadius }}
            />

            {/* Framer Motion Animated Thumb */}
            <motion.span
              className="absolute left-1 bg-white shadow-sm rounded-full pointer-events-none"
              style={{
                width: `var(--ashee-switch-${resolvedSizeKey}-thumb-s)`,
                height: `var(--ashee-switch-${resolvedSizeKey}-thumb-s)`,
              }}
              animate={{
                x: isChecked
                  ? `var(--ashee-switch-${resolvedSizeKey}-thumb-t)`
                  : "0px",
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              {...(motionProps as HTMLMotionProps<"span">)}
            />
          </div>
        </label>
      </FieldShell>
    );
  },
);
Switch.displayName = "Switch";
