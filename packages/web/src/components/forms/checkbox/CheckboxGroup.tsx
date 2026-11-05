/**
 * CheckboxGroup component for AsheeUI.
 * This file provides the CheckboxGroup component, which wraps several checkboxes,
 * owns the selected values and gives the set one label, description and message.
 */
"use client";

import type { Color } from "@asheeui/core";
import { resolveCascade } from "@asheeui/core";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { cn } from "../../../utils/cn";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import {
  type CheckboxConfig,
  FALLBACK_CHECKBOX_CONFIG,
} from "./checkbox-config";
import { CheckboxContext } from "./checkbox-context";
import { CHECKBOX_GROUP_CLASS } from "./checkbox-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Configuration options for the CheckboxGroup component.
 */
export interface CheckboxGroupProps {
  /**
   * Checkbox components to render inside the group.
   */
  children: ReactNode;

  /**
   * Name attribute for every checkbox in the group.
   * Auto-generated if not provided.
   */
  name?: string | undefined;

  /**
   * Controlled selected values.
   */
  value?: string[] | undefined;

  /**
   * Uncontrolled initial selected values.
   */
  defaultValue?: string[] | undefined;

  /**
   * Callback fired with the next set of selected values.
   */
  onChange?: ((value: string[]) => void) | undefined;

  /**
   * Size scale for every checkbox in the group.
   * @default "md"
   */
  size?: FieldSizeKey | undefined;

  /**
   * Theme accent colour for every checkbox in the group.
   * @default "primary"
   */
  color?: Color | undefined;

  /**
   * Layout orientation of the group.
   * - `horizontal`: checkboxes are laid out in a row that wraps.
   * - `vertical`: checkboxes are laid out in a column.
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical" | undefined;

  /**
   * Validation status for the group.
   * @default "default"
   */
  status?: FieldStatus | undefined;

  /**
   * Label text for the group.
   */
  label?: string | undefined;

  /**
   * Alignment of the label relative to the group.
   * @default "left"
   */
  labelAlign?: LabelAlign | undefined;

  /**
   * Description text shown below the label.
   */
  description?: string | undefined;

  /**
   * Validation message shown below the group.
   */
  message?: string | undefined;

  /**
   * Whether the field is required.
   * @default false
   */
  required?: boolean | undefined;

  /**
   * Whether every checkbox in the group is disabled.
   * @default false
   */
  disabled?: boolean | undefined;

  /**
   * Extra CSS classes for the group container.
   */
  className?: string | undefined;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A group of checkboxes that manages the selected values and layout.
 *
 * CheckboxGroup wraps multiple Checkbox components and provides a consistent
 * context for the shared name, selected values, size, colour and disabled state.
 * It also handles labelling and validation through the FieldShell component.
 *
 * The group is a `fieldset` — the native group for a set of controls — named by
 * its visible label. Each checkbox remains a native input, so the browser keeps
 * the option's checked state and its place in the form.
 *
 * @param props - CheckboxGroup configuration options.
 * @param props.children - Checkbox components to render.
 * @param props.name - Name attribute shared by the checkboxes.
 * @param props.value - Controlled selected values.
 * @param props.defaultValue - Uncontrolled initial selected values.
 * @param props.onChange - Callback fired with the next selected values.
 * @param props.size - Size scale. Defaults to "md".
 * @param props.color - Theme accent colour.
 * @param props.orientation - Layout orientation. Defaults to "vertical".
 * @param props.status - Validation status.
 * @param props.label - Label text for the group.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required.
 * @param props.disabled - Whether every checkbox is disabled.
 * @param props.className - Extra CSS classes.
 *
 * @example
 * ```tsx
 * import { Checkbox, CheckboxGroup } from "@asheeui/web";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [values, setValues] = useState(["news"]);
 *
 *   return (
 *     <CheckboxGroup
 *       label="Interests"
 *       value={values}
 *       onChange={setValues}
 *       orientation="horizontal">
 *       <Checkbox value="news" label="News" />
 *       <Checkbox value="sport" label="Sport" />
 *       <Checkbox value="culture" label="Culture" />
 *     </CheckboxGroup>
 *   );
 * }
 * ```
 *
 * @see Checkbox - The individual checkbox component.
 * @see CheckboxConfig - The configuration type for component defaults.
 */
export const CheckboxGroup = forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(
  (
    {
      children,
      name,
      value,
      defaultValue,
      onChange,
      size,
      color,
      orientation = "vertical",
      status,
      label,
      labelAlign,
      description,
      message,
      required,
      disabled,
      className,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.checkbox as
      | CheckboxConfig
      | undefined;

    const generatedId = useId();
    const groupName = name ?? generatedId;

    // Controlled and uncontrolled selection: `value` owns the set, and without
    // one the group keeps the selected values itself so an uncontrolled group
    // with a `defaultValue` can still select.
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(
      defaultValue ?? [],
    );
    const isSelectionControlled = value !== undefined;
    const selectedValues = isSelectionControlled ? value : uncontrolledValue;

    const handleValueChange = useCallback(
      (nextValue: string[]) => {
        if (!isSelectionControlled) setUncontrolledValue(nextValue);
        onChange?.(nextValue);
      },
      [isSelectionControlled, onChange],
    );

    const labelId = label ? `${generatedId}-label` : undefined;
    const descriptionId = description
      ? `${generatedId}-description`
      : undefined;
    const messageId = message ? `${generatedId}-message` : undefined;
    const describedBy =
      [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

    const resolvedStatus = status ?? FALLBACK_CHECKBOX_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_CHECKBOX_CONFIG.labelAlign,
    );

    return (
      <FieldShell
        id={generatedId}
        htmlFor={null}
        labelId={labelId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        descriptionId={descriptionId}
        message={message}
        messageId={messageId}
        status={resolvedStatus}
        required={required}>
        <CheckboxContext.Provider
          value={{
            name: groupName,
            value: selectedValues,
            onChange: handleValueChange,
            size,
            color,
            disabled,
            status: resolvedStatus,
          }}>
          {/* A fieldset is the native group for a set of controls, so its
              implicit `group` role does the work `role="group"` would state by
              hand. The field's own label names it through `aria-labelledby`;
              there is no legend because the family's shell draws the label
              above the set. */}
          <fieldset
            ref={ref}
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            className={cn(
              // A fieldset arrives with a border, padding and a min-width; a
              // group of checkboxes is a layout, so those are cleared before
              // the orientation's own classes apply.
              "m-0 min-w-0 border-0 p-0",
              CHECKBOX_GROUP_CLASS[orientation],
              className,
            )}>
            {children}
          </fieldset>
        </CheckboxContext.Provider>
      </FieldShell>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";
