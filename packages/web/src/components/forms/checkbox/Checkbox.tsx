/**
 * Checkbox component for AsheeUI.
 * This file provides the individual Checkbox component: a square a reader ticks,
 * with an optional label and description. It can be used standalone or inside a
 * CheckboxGroup, where the group owns the selected values.
 */
"use client";

import type { Color } from "@asheeui/core";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "@asheeui/core";
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import { CheckIcon } from "../../../icons/CheckIcon";
import { useAsheeConfig } from "../../../libs/context";
import { RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";
import { type FieldSizeKey, isFieldInvalid } from "../field/field-config";
import {
  type CheckboxConfig,
  FALLBACK_CHECKBOX_CONFIG,
} from "./checkbox-config";
import { useCheckboxGroupContext } from "./checkbox-context";
import {
  CHECKBOX_COLOR_CLASS,
  CHECKBOX_DISABLED_CLASS,
  CHECKBOX_FONT_SIZE_CLASS,
  CHECKBOX_GAP_CLASS,
  CHECKBOX_ICON_SIZE_CLASS,
  CHECKBOX_OUTER_SIZE_CLASS,
  CHECKBOX_STATUS_BORDER_CLASS,
} from "./checkbox-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseCheckboxProps = CheckboxConfig &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "children" | "color" | "type"
  >;

/**
 * Configuration options for the Checkbox component.
 */
export interface CheckboxProps extends BaseCheckboxProps {
  /**
   * The value this checkbox stands for.
   *
   * It identifies the box inside a `CheckboxGroup`, which reports the selected
   * values, and it is the `value` a form submits for the field.
   */
  value: string;

  /**
   * Label text for the checkbox.
   * Displayed next to the square.
   */
  label?: ReactNode | undefined;

  /**
   * Description text shown below the label.
   * Provides additional context for the option.
   */
  description?: ReactNode | undefined;

  /**
   * Whether the checkbox is checked.
   * For controlled usage, or for one that stands outside a group.
   */
  checked?: boolean | undefined;

  /**
   * Whether the checkbox is initially checked.
   * For uncontrolled usage outside a group.
   * @default false
   */
  defaultChecked?: boolean | undefined;

  /**
   * Callback fired when the checkbox state changes.
   * Receives the checked state, the value and the change event.
   */
  onChange?: (
    checked: boolean,
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Called when the option is pressed, under the name the platform package uses.
   *
   * The checkbox's own press is what toggles it, so this is the press rather than
   * the change: the browser runs it before `onChange`, and it says nothing about
   * the next state.
   */
  onClick?: MouseEventHandler<HTMLInputElement> | undefined;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A square a reader ticks, with an optional label and description.
 *
 * Checkbox renders a hidden native checkbox input and draws the square from its
 * state, so the browser keeps its keyboard behaviour, form submission and
 * accessible role. It supports controlled and uncontrolled usage and the
 * standard AsheeUI cascade for visual tokens. Inside a `CheckboxGroup` it reads
 * the selection, the shared options and the disabled state from the group.
 *
 * @param props - Checkbox configuration options.
 * @param props.value - The value this checkbox stands for.
 * @param props.label - Label text for the checkbox.
 * @param props.description - Description shown below the label.
 * @param props.checked - Whether the checkbox is checked (controlled).
 * @param props.defaultChecked - Whether it starts checked (uncontrolled).
 * @param props.onChange - Callback fired when the state changes.
 * @param props.size - Size scale. Defaults to "md".
 * @param props.color - Theme accent colour. Defaults to the application's colour.
 * @param props.radius - Corner rounding. Defaults to "sm".
 * @param props.status - Validation status.
 * @param props.disabled - Whether the checkbox is disabled.
 *
 * @example
 * ```tsx
 * import { Checkbox } from "@asheeui/web";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [checked, setChecked] = useState(false);
 *
 *   return (
 *     <Checkbox
 *       value="terms"
 *       label="I accept the terms"
 *       checked={checked}
 *       onChange={(next) => setChecked(next)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Inside a group, the group owns the selected values.
 * <CheckboxGroup label="Interests" defaultValue={["news"]}>
 *   <Checkbox value="news" label="News" />
 *   <Checkbox value="sport" label="Sport" />
 * </CheckboxGroup>
 * ```
 *
 * @see CheckboxGroup - The parent component that manages a set of checkboxes.
 * @see CheckboxConfig - The configuration type for component defaults.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      value,
      size,
      color,
      radius,
      status,
      label,
      description,
      id,
      name: directName,
      className,
      style,
      disabled: directDisabled,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const group = useCheckboxGroupContext();
    const sectionConfig = config.components?.checkbox as
      | CheckboxConfig
      | undefined;

    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    // Derived properties from the group context or direct props.
    const resolvedName = directName ?? group?.name;
    const isDisabled = directDisabled ?? group?.disabled ?? false;

    // Controlled / uncontrolled state evaluation. A group always owns the
    // selection, so the checkbox never keeps a second copy of it.
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isChecked = group
      ? group.value.includes(value)
      : (controlledChecked ?? uncontrolledChecked);

    // ─── 1. Token Resolvers (4-Tier Cascade: Prop -> Group -> Section -> Fallback)

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size ?? group?.size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CHECKBOX_CONFIG.size,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color ?? group?.color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_CHECKBOX_CONFIG.color,
    );

    const resolvedStatus =
      status ?? group?.status ?? FALLBACK_CHECKBOX_CONFIG.status;

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      undefined,
      FALLBACK_CHECKBOX_CONFIG.radius,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const outerSizeClass = resolveClassKey(
      resolvedSizeKey,
      CHECKBOX_OUTER_SIZE_CLASS,
      FALLBACK_CHECKBOX_CONFIG.size,
    );

    const iconSizeClass = resolveClassKey(
      resolvedSizeKey,
      CHECKBOX_ICON_SIZE_CLASS,
      FALLBACK_CHECKBOX_CONFIG.size,
    );

    const fontSizeClass = resolveClassKey(
      resolvedSizeKey,
      CHECKBOX_FONT_SIZE_CLASS,
      FALLBACK_CHECKBOX_CONFIG.size,
    );

    const gapClass = resolveClassKey(
      resolvedSizeKey,
      CHECKBOX_GAP_CLASS,
      FALLBACK_CHECKBOX_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_CHECKBOX_CONFIG.radius,
    );

    const colorClasses =
      CHECKBOX_COLOR_CLASS[resolvedColorKey] ?? CHECKBOX_COLOR_CLASS.primary;

    const statusBorderClass =
      CHECKBOX_STATUS_BORDER_CLASS[resolvedStatus] ??
      CHECKBOX_STATUS_BORDER_CLASS.default;

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (isDisabled) return;

        const nextChecked = event.target.checked;

        if (group) {
          const nextValues = nextChecked
            ? [...group.value, value]
            : group.value.filter((selected) => selected !== value);
          group.onChange?.(nextValues);
        } else if (controlledChecked === undefined) {
          setUncontrolledChecked(nextChecked);
        }

        onChange?.(nextChecked, value, event);
      },
      [controlledChecked, group, isDisabled, onChange, value],
    );

    return (
      <label
        className={cn(
          "relative inline-flex items-start select-none cursor-pointer transition-all duration-150 shrink-0",
          gapClass,
          isDisabled && CHECKBOX_DISABLED_CLASS,
          className,
        )}
        style={style}>
        {/* Native checkbox input, which keeps the browser's role, keyboard
            behaviour and form value. */}
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          name={resolvedName}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          aria-invalid={isFieldInvalid(resolvedStatus)}
          onChange={handleChange}
          onClick={onClick}
          className="sr-only peer"
          {...rest}
        />

        {/* The square, drawn from the input's state. */}
        <div
          className={cn(
            "shrink-0 flex items-center justify-center border-2 transition-all duration-150 mt-0.5",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
            outerSizeClass,
            radiusClass,
            isChecked
              ? cn(colorClasses.border, colorClasses.bg)
              : cn("bg-background", statusBorderClass),
          )}>
          <CheckIcon
            strokeWidth={3}
            className={cn(
              iconSizeClass,
              colorClasses.check,
              "transition-all duration-200 ease-in-out transform-gpu",
              isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0",
            )}
          />
        </div>

        {/* Text container */}
        {(label || description) && (
          <div className="flex flex-col min-w-0">
            {label && (
              <span
                className={cn(
                  "font-medium text-foreground leading-snug",
                  fontSizeClass,
                )}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs sm:text-sm text-foreground/70 leading-snug mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
