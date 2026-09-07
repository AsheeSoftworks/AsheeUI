"use client";

import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  useCallback,
  useId,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import { type Color, resolveVariantClass } from "../../shared/variant";
import { cn } from "../../utils";
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
  SWITCH_STATUS_BORDER_CLASS,
  SWITCH_THUMB_SIZE_CLASS,
  SWITCH_THUMB_TRANSLATE_CLASS,
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
  radius?: Radius;
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
      config.defaultColor,
      FALLBACK_SWITCH_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      undefined,
      FALLBACK_SWITCH_CONFIG.radius,
    );

    const resolvedStatus = status ?? FALLBACK_SWITCH_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_SWITCH_CONFIG.labelAlign,
    );

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

    const translateClass = resolveClassKey(
      resolvedSizeKey,
      SWITCH_THUMB_TRANSLATE_CLASS,
      FALLBACK_SWITCH_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_SWITCH_CONFIG.radius,
    );

    const statusBorderClass =
      SWITCH_STATUS_BORDER_CLASS[resolvedStatus] ??
      SWITCH_STATUS_BORDER_CLASS.default;

    const checkedColorClass = resolveVariantClass("solid", resolvedColor);
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
        isLoading={isLoading}>
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
                isChecked ? checkedColorClass : "bg-secondary/60",
                className,
              )}
              style={style}
            />

            {/* Thumb */}
            <span
              className={cn(
                "relative z-10 bg-background shadow-sm pointer-events-none shrink-0",
                "transition-transform duration-200 ease-in-out transform-gpu",
                radiusClass,
                thumbSizeClass,
                isChecked ? translateClass : "translate-x-0",
              )}
            />
          </div>
        </label>
      </FieldShell>
    );
  },
);

Switch.displayName = "Switch";
