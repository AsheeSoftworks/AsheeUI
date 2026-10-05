/**
 * RadioGroup component for the native package.
 *
 * The group is what makes a set of radios one control: it owns the selection, holds the
 * options that all of them share, and shows the label, the description and the message
 * the family's shell draws. Two things are deliberately native rather than portable:
 *
 * 1. The group announces itself with `accessibilityRole="radiogroup"` and reads its name
 *    from `accessibilityLabel`, which is where the platform expects a group's name,
 *    instead of the web's `aria-labelledby` reference.
 * 2. The options are children rather than a list of values, because a native option
 *    carries its own label and description where a web one reads them from markup.
 */

import {
  type Color,
  type FieldSizeKey,
  type FieldStatus,
  NATIVE_RADIO_GROUP_CLASS,
  type RadioVariant,
  resolveCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { View, type ViewProps } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_NATIVE_RADIO_CONFIG,
  type NativeRadioConfig,
} from "./radio-config";
import { RadioContext } from "./radio-context";

/**
 * Props for the native RadioGroup.
 */
export interface RadioGroupProps
  extends Omit<ViewProps, "children" | "style" | "onChange"> {
  /** The radios the reader picks from. */
  children: ReactNode;

  /** The picked value, for a consumer that owns the selection. */
  value?: string;

  /** The value picked at first, for a consumer that does not. */
  defaultValue?: string;

  /** Called with the value the reader picked. */
  onChange?: (value: string) => void;

  /** Density of every option. Defaults to the configured value. */
  size?: FieldSizeKey;

  /** Accent colour of every option. Defaults to the configured value. */
  color?: Color;

  /** Whether the options are drawn as circles or as cards. */
  variant?: RadioVariant;

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
 * A set of options a reader picks one from.
 *
 * The selection is controlled by `value` or kept by the group itself through
 * `defaultValue`, so an uncontrolled group can still select.
 *
 * @param props - The group's options and the platform's view props.
 * @param props.children - The radios to render.
 * @param props.value - The picked value, for a controlled group.
 * @param props.onChange - Called with the value the reader picked.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <RadioGroup label="Plan" defaultValue="growth">
 *   <Radio value="starter" label="Starter" />
 *   <Radio value="growth" label="Growth" />
 * </RadioGroup>
 * ```
 *
 * @see Radio - The option the group arranges.
 */
export function RadioGroup({
  children,
  value,
  defaultValue,
  onChange,
  size,
  color,
  variant,
  orientation = "vertical",
  status,
  label,
  description,
  message,
  required,
  isDisabled,
  className,
  ...rest
}: RadioGroupProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.radio as
    | NativeRadioConfig
    | undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isSelectionControlled = value !== undefined;
  const groupValue = isSelectionControlled ? value : uncontrolledValue;

  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_RADIO_CONFIG.status,
  );

  const handleValueChange = useCallback(
    (nextValue: string) => {
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
      <RadioContext.Provider
        value={{
          value: groupValue,
          onChange: handleValueChange,
          size,
          color,
          variant,
          isDisabled,
          status: resolvedStatus,
        }}>
        <View
          {...rest}
          accessibilityRole="radiogroup"
          accessibilityLabel={label}
          accessibilityHint={description}
          className={classNames(
            NATIVE_RADIO_GROUP_CLASS[orientation],
            className,
          )}>
          {children}
        </View>
      </RadioContext.Provider>
    </FieldShell>
  );
}
