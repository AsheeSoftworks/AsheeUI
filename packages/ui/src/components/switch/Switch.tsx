/**
 * Switch component for AsheeUI.
 * This file provides the main Switch component implementation, which renders
 * a toggle switch with label and description support. It supports
 * both controlled and uncontrolled usage, and integrates with the FieldShell
 * for consistent layout handling. Visual tokens resolve through
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
  SWITCH_THUMB_SIZE_CLASS,
  SWITCH_THUMB_TRANSLATE_CLASS,
  SWITCH_TRACK_SIZE_CLASS,
} from "./switch-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseSwitchProps = Omit<SwitchConfig, "status"> &
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
 * A toggle switch with label and description support.
 *
 * Switch renders a toggle input that can be checked or unchecked. It
 * supports controlled and uncontrolled usage, and the standard AsheeUI
 * cascade for visual tokens. The component integrates with FieldShell for
 * label and description handling.
 *
 * The component automatically handles accessibility attributes including
 * role="switch", aria-checked, and aria-busy for loading states. It also
 * supports proper focus management through the native input element.
 *
 * @param props - Switch configuration options.
 * @param props.label - Label text for the switch.
 * @param props.description - Description text.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.checked - Controlled checked state.
 * @param props.defaultChecked - Uncontrolled initial checked state. Defaults to false.
 * @param props.onChange - Callback fired when the switch state changes.
 * @param props.size - Size scale. Defaults to "md".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.radius - Corner rounding. Defaults to "full".
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
 *     <Switch * checked="{checked}" description="Receive email notifications for updates" label="Enable notifications" onChange="{(checked)"> setChecked(checked)}
 *     />
 *   );
 * }
 * ```
 *
 * @see SwitchConfig - The configuration type for component defaults.
 * @see FieldShell - The wrapper component for label and layout.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size,
      color,
      radius,
      label,
      labelAlign,
      description,
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

    // ─── Token Resolvers (4-Tier Cascade) ──────────────────────────────────

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
              aria-busy={isLoading}
              onChange={handleChange}
              className="sr-only peer"
              {...rest}
            />

            {/* Track Background */}
            <div
              className={cn(
                "absolute inset-0 border border-border/60 transition-colors duration-200 shrink-0",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                radiusClass,
                isChecked ? checkedColorClass : "bg-secondary",
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
