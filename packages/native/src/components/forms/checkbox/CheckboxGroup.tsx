/**
 * CheckboxGroup component for the native package.
 *
 * The group is what makes a set of checkboxes one control: it owns the selected
 * values, holds the options that all of them share, and shows the label, the
 * description and the message the family's shell draws. Two things are
 * deliberately native rather than portable:
 *
 * 1. The options announce their own state through `accessibilityRole="checkbox"`
 *    and `accessibilityState`; the group itself is a plain `View`, because the
 *    platform has no group role the web's `role="group"` maps to. Its visible
 *    label and description come from the family's shell.
 * 2. The options are children rather than a list of values, because a native
 *    option carries its own label and description where a web one reads them
 *    from markup.
 */

import {
  type Color,
  type FieldSizeKey,
  type FieldStatus,
  resolveCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { View, type ViewProps } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import { NATIVE_CHECKBOX_GROUP_CLASS } from "../../../styles/checkbox";
import { cn } from "../../../utils/cn";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_NATIVE_CHECKBOX_CONFIG,
  type NativeCheckboxConfig,
} from "./checkbox-config";
import { CheckboxContext } from "./checkbox-context";

/**
 * Props for the native CheckboxGroup.
 */
export interface CheckboxGroupProps
  extends Omit<ViewProps, "children" | "style" | "onChange"> {
  /** The checkboxes the reader ticks. */
  children: ReactNode;

  /** The selected values, for a consumer that owns the selection. */
  value?: string[];

  /** The values selected at first, for a consumer that does not. */
  defaultValue?: string[];

  /** Called with the next set of selected values. */
  onChange?: (value: string[]) => void;

  /** Density of every option. Defaults to the configured value. */
  size?: FieldSizeKey;

  /** Accent colour of every option. Defaults to the configured value. */
  color?: Color;

  /**
   * How the options are arranged.
   * A list of options is read top to bottom, so the column is the default.
   *
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";

  /** Validation status of the group. Defaults to the configured value. */
  status?: FieldStatus;

  /** The group's label, shown above the options. */
  label?: string;

  /** Description shown under the label. */
  description?: string;

  /** Validation message shown under the options. */
  message?: string;

  /** Whether the group must be answered before the form is submitted. */
  required?: boolean;

  /** Whether every option in the group is unavailable. */
  isDisabled?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;
}

/**
 * A set of options a reader ticks any number of.
 *
 * The selection is controlled by `value` or kept by the group itself through
 * `defaultValue`, so an uncontrolled group can still select.
 *
 * @param props - The group's options and the platform's view props.
 * @param props.children - The checkboxes to render.
 * @param props.value - The selected values, for a controlled group.
 * @param props.onChange - Called with the next set of selected values.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <CheckboxGroup label="Interests" defaultValue={["news"]}>
 *   <Checkbox value="news" label="News" />
 *   <Checkbox value="sport" label="Sport" />
 * </CheckboxGroup>
 * ```
 *
 * @see Checkbox - The option the group arranges.
 */
export function CheckboxGroup({
  children,
  value,
  defaultValue,
  onChange,
  size,
  color,
  orientation = "vertical",
  status,
  label,
  description,
  message,
  required,
  isDisabled,
  className,
  ...rest
}: CheckboxGroupProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.checkbox as
    | NativeCheckboxConfig
    | undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(
    defaultValue ?? [],
  );

  const isSelectionControlled = value !== undefined;
  const selectedValues = isSelectionControlled ? value : uncontrolledValue;

  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_CHECKBOX_CONFIG.status,
  );

  const handleValueChange = useCallback(
    (nextValue: string[]) => {
      if (!isSelectionControlled) setUncontrolledValue(nextValue);
      onChange?.(nextValue);
    },
    [isSelectionControlled, onChange],
  );

  return (
    <FieldShell
      label={label}
      description={description}
      message={message}
      status={resolvedStatus}
      required={required}>
      <CheckboxContext.Provider
        value={{
          value: selectedValues,
          onChange: handleValueChange,
          size,
          color,
          isDisabled,
          status: resolvedStatus,
        }}>
        <View
          {...rest}
          role="group"
          accessibilityLabel={label}
          accessibilityHint={description}
          className={cn(NATIVE_CHECKBOX_GROUP_CLASS[orientation], className)}>
          {children}
        </View>
      </CheckboxContext.Provider>
    </FieldShell>
  );
}
