/**
 * RadioGroup component for AsheeUI.
 * This file provides the RadioGroup component that wraps multiple Radio
 * components and manages shared state through context. It provides
 * consistent labeling, validation, and layout for a group of radio options.
 */
"use client";

import { forwardRef, type ReactNode, useId } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import {
  FALLBACK_RADIO_CONFIG,
  type RadioConfig,
  type RadioVariant,
} from "./radio-config";
import { RadioContext } from "./radio-context";

// ─── Component Interface ──────────────────────────────────────────────────────

/**
 * Configuration options for the RadioGroup component.
 */
export interface RadioGroupProps {
  /**
   * Radio components to render inside the group.
   */
  children: ReactNode;

  /**
   * Name attribute for all radio inputs in the group.
   * Auto-generated if not provided.
   */
  name?: string;

  /**
   * Controlled selected value.
   */
  value?: string;

  /**
   * Uncontrolled initial selected value.
   */
  defaultValue?: string;

  /**
   * Callback fired when the selection changes.
   * Receives the new selected value.
   */
  onChange?: (value: string) => void;

  /**
   * Size scale for all radios in the group.
   * @default "md"
   */
  size?: FieldSizeKey;

  /**
   * Theme accent color for all radios in the group.
   * @default "primary"
   */
  color?: Color;

  /**
   * Visual style variant for all radios in the group.
   * @default "default"
   */
  variant?: RadioVariant;

  /**
   * Layout orientation of the radio group.
   * - `horizontal`: Radios are laid out in a row.
   * - `vertical`: Radios are laid out in a column.
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Validation status for the group.
   * @default "default"
   */
  status?: FieldStatus;

  /**
   * Label text for the group.
   */
  label?: string;

  /**
   * Alignment of the label relative to the group.
   * @default "left"
   */
  labelAlign?: LabelAlign;

  /**
   * Description text shown below the label.
   */
  description?: string;

  /**
   * Validation message shown below the group.
   */
  message?: string;

  /**
   * Whether the field is required.
   * @default false
   */
  required?: boolean;

  /**
   * Whether all radios in the group are disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Extra CSS classes for the group container.
   */
  className?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A group of radio buttons that manages shared state and layout.
 *
 * RadioGroup wraps multiple Radio components and provides a consistent
 * context for shared props like name, value, size, color, and disabled
 * state. It also handles labeling, validation, and layout through the
 * FieldShell component.
 *
 * @param props - RadioGroup configuration options.
 * @param props.children - Radio components to render.
 * @param props.name - Name attribute for all radios.
 * @param props.value - Controlled selected value.
 * @param props.defaultValue - Uncontrolled initial selected value.
 * @param props.onChange - Callback fired when selection changes.
 * @param props.size - Size scale for all radios. Defaults to "md".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.variant - Visual style variant. Defaults to "default".
 * @param props.orientation - Layout orientation. Defaults to "vertical".
 * @param props.status - Validation status. Defaults to "default".
 * @param props.label - Label text for the group.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required.
 * @param props.disabled - Whether all radios are disabled.
 * @param props.className - Extra CSS classes.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [value, setValue] = useState("option-1");
 *
 *   return (
 *     <RadioGroup
 *       label="Choose an option"
 *       value={value}
 *       onChange={setValue}
 *       orientation="horizontal"
 *     >
 *       <Radio value="option-1" label="Option 1" />
 *       <Radio value="option-2" label="Option 2" />
 *       <Radio value="option-3" label="Option 3" disabled />
 *     </RadioGroup>
 *   );
 * }
 * ```
 *
 * @see Radio - The individual radio component.
 * @see RadioConfig - The configuration type for component defaults.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      children,
      name,
      value,
      onChange,
      size,
      color,
      variant,
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
    const sectionConfig = config.components?.radio as RadioConfig | undefined;

    const generatedId = useId();
    const groupName = name ?? generatedId;

    const resolvedStatus = status ?? FALLBACK_RADIO_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_RADIO_CONFIG.labelAlign,
    );

    return (
      <FieldShell
        id={generatedId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}>
        <RadioContext.Provider
          value={{
            name: groupName,
            value,
            onChange,
            size,
            color,
            variant,
            disabled,
            status: resolvedStatus,
          }}>
          <div
            ref={ref}
            role="radiogroup"
            className={cn(
              "flex",
              orientation === "vertical"
                ? "flex-col gap-2"
                : "flex-row flex-wrap gap-4",
              className,
            )}>
            {children}
          </div>
        </RadioContext.Provider>
      </FieldShell>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
