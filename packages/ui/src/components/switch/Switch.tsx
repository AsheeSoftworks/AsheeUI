/**
 * Switch component for AsheeUI.
 * This file provides the main Switch component implementation, which renders
 * a toggle switch with label, description, and validation support. It supports
 * both controlled and uncontrolled usage, and integrates with the FieldShell
 * for consistent layout and validation handling. Visual tokens resolve through
 * the standard AsheeUI cascade system.
 */
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
import { type Color, RADIUS_CLASS, resolveVariantClass } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type { FieldSizeKey, LabelAlign } from "../field/field-config";
import { FALLBACK_SWITCH_CONFIG, type SwitchConfig } from "./switch-config";
import {
  SWITCH_STATUS_BORDER_CLASS,
  SWITCH_THUMB_SIZE_CLASS,
  SWITCH_THUMB_TRANSLATE_CLASS,
  SWITCH_TRACK_SIZE_CLASS,
} from "./switch-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseSwitchProps = SwitchConfig &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "children" | "color"
  >;

/**
 * Configuration options for the Switch component.
 */
export interface SwitchProps extends BaseSwitchProps {
  /**
   * Label text for the switch.
   * Displayed next to the toggle.
   */
  label?: string;

  /**
   * Description text shown below the label.
   * Provides additional context for the switch.
   */
  description?: string;

  /**
   * Validation message shown below the switch.
   * Color is determined by the status prop.
   */
  message?: string;

  /**
   * Whether the field is required.
   * Adds a required indicator to the label.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Whether the switch is in a loading state.
   * Disables interaction and shows loading indication.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Controlled checked state.
   * When provided, the component becomes controlled.
   */
  checked?: boolean;

  /**
   * Uncontrolled initial checked state.
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the switch state changes.
   * Receives the new checked state and the change event.
   */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A toggle switch with label, description, and validation support.
 *
 * Switch renders a toggle input that can be checked or unchecked. It
 * supports controlled and uncontrolled usage, validation states, and
 * the standard AsheeUI cascade for visual tokens. The component
 * integrates with FieldShell for label, description, and message
 * handling.
 *
 * The component automatically handles accessibility attributes including
 * role="switch", aria-checked, aria-invalid, and aria-busy for loading
 * states. It also supports proper focus management through the native
 * input element.
 *
 * @param props - Switch configuration options.
 * @param props.label - Label text for the switch.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.checked - Controlled checked state.
 * @param props.defaultChecked - Uncontrolled initial checked state. Defaults to false.
 * @param props.onChange - Callback fired when the switch state changes.
 * @param props.size - Size scale. Defaults to "md".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.radius - Corner rounding. Defaults to "full".
 * @param props.status - Validation status. Defaults to "default".
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.disabled - Whether the switch is disabled.
 * @param props.className - Extra CSS classes for the switch.
 * @param props.id - Optional ID for the switch.
 *
 * @example
 * ```tsx
 * import { Switch } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [checked, setChecked] = useState(false);
 *
 *   return (
 *     <Switch
 *       label="Enable notifications"
 *       description="Receive email notifications for updates"
 *       checked={checked}
 *       onChange={(checked) => setChecked(checked)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With validation
 * <Switch
 *   label="Terms accepted"
 *   status="error"
 *   message="You must accept the terms to continue"
 *   required
 * />
 * ```
 *
 * @see SwitchConfig - The configuration type for component defaults.
 * @see FieldShell - The wrapper component for label and validation.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
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

    const resolvedColorKey = resolveCascade<Color>(
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

    const checkedColorClass = resolveVariantClass("solid", resolvedColorKey);
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
