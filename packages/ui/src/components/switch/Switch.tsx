"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  useCallback,
  useId,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimation } from "../../motion/resolve-animation";
import type { AnimationProp } from "../../motion/types";
import { type Color, resolveVariantClass } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import { FALLBACK_SWITCH_CONFIG, type SwitchConfig } from "./switch-config";
import {
  SWITCH_RADIUS_CLASS,
  SWITCH_STATUS_BORDER_CLASS,
  SWITCH_THUMB_SIZE_CLASS,
  SWITCH_THUMB_TRANSLATE_X,
  SWITCH_TRACK_SIZE_CLASS,
} from "./switch-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "children" | "color"
  > {
  size?: FieldSizeKey;
  color?: Color;
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

// ─── Component Implementation ─────────────────────────────────────────────────

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
      style,
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

    // Controlled / Uncontrolled State Handling
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isChecked = controlledChecked ?? uncontrolledChecked;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_SWITCH_CONFIG.size,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.theme.defaultColor,
      FALLBACK_SWITCH_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
      config.theme.radius?.default,
      FALLBACK_SWITCH_CONFIG.radius,
    );

    const resolvedStatus = status ?? FALLBACK_SWITCH_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_SWITCH_CONFIG.labelAlign,
    );

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const trackSizeClass = resolveClassKey(
      resolvedSizeKey,
      SWITCH_TRACK_SIZE_CLASS,
      FALLBACK_SWITCH_CONFIG.size,
    );

    const thumbSizeClass = resolveClassKey(
      resolvedSizeKey,
      SWITCH_THUMB_SIZE_CLASS,
      FALLBACK_SWITCH_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      SWITCH_RADIUS_CLASS,
      FALLBACK_SWITCH_CONFIG.radius,
    );

    const statusBorderClass =
      SWITCH_STATUS_BORDER_CLASS[resolvedStatus] ??
      SWITCH_STATUS_BORDER_CLASS.default;

    const checkedColorClass = resolveVariantClass("solid", resolvedColor);
    const translateX = SWITCH_THUMB_TRANSLATE_X[resolvedSizeKey] ?? 20;
    const isInteractionDisabled = disabled || isLoading;

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (isInteractionDisabled) return;
        const nextChecked = e.target.checked;
        if (controlledChecked === undefined) {
          setUncontrolledChecked(nextChecked);
        }
        onChange?.(nextChecked, e);
      },
      [controlledChecked, isInteractionDisabled, onChange],
    );

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
        <label
          htmlFor={fieldId}
          className={cn(
            "inline-flex items-center gap-3 select-none cursor-pointer shrink-0",
            isInteractionDisabled &&
              "opacity-50 pointer-events-none cursor-not-allowed",
          )}>
          <div
            className={cn(
              "relative shrink-0 inline-flex items-center",
              trackSizeClass,
            )}>
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
              {...rest}
            />

            {/* Track Background */}
            <div
              className={cn(
                "absolute inset-0 border transition-colors duration-200 shrink-0",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                statusBorderClass,
                radiusClass,
                isChecked ? checkedColorClass : "bg-muted/60",
                sectionConfig?.className,
                className,
              )}
              style={style}
            />

            {/* Framer Motion Animated Thumb */}
            <motion.span
              className={cn(
                "relative z-10 bg-background shadow-sm rounded-full pointer-events-none shrink-0",
                thumbSizeClass,
              )}
              animate={{
                x: isChecked ? translateX : 0,
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
