/**
 * MultiSelect component for the native package.
 *
 * The component satisfies the framework's multi-select contract: the same options, the same
 * values, the same change handler and the same field vocabulary as the web multi-select.
 * Four things are deliberately native rather than portable:
 *
 * 1. The trigger announces itself as a combobox and reports whether it is open, which is
 *    where the platform reads a picker's state, instead of the web's listbox markup.
 * 2. The options are one surface at a time, and the surface stays open while the reader
 *    picks, because picking several values in one visit is what a multi-select is for.
 * 3. The chips are drawn from the values the field holds rather than supplied as slots, so a
 *    consumer states the values and not the markup.
 * 4. A value is a string. A key of another type travels as its string form.
 */

import {
  type Color,
  type FieldStatus,
  isFieldInvalid,
  NATIVE_INPUT_BASE_CLASS,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_INVALID_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_SIZE_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/core";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import { PickerSheet, type PickerSheetOption } from "../picker/PickerSheet";
import {
  NATIVE_CHIP_CLASS,
  NATIVE_CHIP_LABEL_CLASS,
  NATIVE_CHIP_REMOVE_CLASS,
  NATIVE_CHIP_ROW_CLASS,
  NATIVE_PICKER_TRIGGER_CLASS,
} from "../picker/picker-styles";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_MULTI_SELECT_CONFIG,
  type NativeMultiSelectConfig,
} from "./multi-select-config";

/**
 * Props for the native MultiSelect.
 */
export interface MultiSelectProps extends NativeMultiSelectConfig {
  /** The options the reader picks from. */
  options: readonly PickerSheetOption[];

  /** The picked values, for a consumer that owns them. */
  value?: readonly string[];

  /** The values picked at first, for a consumer that does not. */
  defaultValue?: readonly string[];

  /** Called with every picked value, in the order they were picked. */
  onChange?: (values: string[]) => void;

  /** What the trigger says while nothing is picked. */
  placeholder?: string;

  /** The field's label, which also names the control. */
  label?: string;

  /** Description shown under the label. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /** Validation status of the field. Defaults to `"default"`. */
  status?: FieldStatus;

  /** Whether the field is waiting for something, which shows a pending marker. */
  isLoading?: boolean;

  /** The heading of the surface the options are picked from. */
  sheetTitle?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Identifier for the trigger, so a test can reach it. */
  testID?: string;

  /** Identifier prefix for the options, so a test can reach one. */
  optionTestID?: string;
}

/**
 * A field that picks several options from a list.
 *
 * The values are controlled by `value` or kept by the field itself, and reported on every
 * change, so a consumer reads one array whichever it asked for.
 *
 * @param props - The field's options.
 * @param props.options - The options the reader picks from.
 * @param props.value - The picked values, for a controlled field.
 * @param props.defaultValue - The values picked at first, for an uncontrolled one.
 * @param props.onChange - Called with every picked value.
 * @param props.placeholder - What the trigger says while nothing is picked.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   label="Tags"
 *   options={[{ value: "urgent", label: "Urgent" }]}
 *   defaultValue={["urgent"]}
 *   onChange={setTags}
 * />
 * ```
 *
 * @see Dropmenu - The field that picks one option from the same surface.
 */
export function MultiSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select options",
  label,
  description,
  message,
  status,
  isLoading,
  sheetTitle,
  size,
  radius,
  variant,
  color,
  isDisabled,
  required,
  className,
  testID,
  optionTestID,
}: MultiSelectProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.multiSelect;
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValues, setUncontrolledValues] = useState<
    readonly string[]
  >(defaultValue ?? []);

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_MULTI_SELECT_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_MULTI_SELECT_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_MULTI_SELECT_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_MULTI_SELECT_CONFIG.color,
  );
  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_MULTI_SELECT_CONFIG.status,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_MULTI_SELECT_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_MULTI_SELECT_CONFIG.required,
  );

  const isControlled = value !== undefined;
  const pickedValues = isControlled ? value : uncontrolledValues;

  const commit = (next: string[]) => {
    if (!isControlled) setUncontrolledValues(next);
    onChange?.(next);
  };

  const isInvalid = isFieldInvalid(resolvedStatus);
  const edgeClass = classNames(
    NATIVE_INPUT_EDGE_WIDTH_CLASS[resolvedVariant],
    isInvalid
      ? NATIVE_INPUT_EDGE_INVALID_CLASS
      : isOpen
        ? NATIVE_INPUT_EDGE_ACCENT_CLASS[resolvedColor]
        : NATIVE_INPUT_EDGE_NEUTRAL_CLASS[resolvedVariant],
  );

  return (
    <FieldShell
      label={label}
      description={description}
      message={message}
      status={resolvedStatus}
      required={resolvedRequired}
      isLoading={isLoading}>
      <Pressable
        testID={testID}
        accessibilityRole="combobox"
        accessibilityLabel={label ?? placeholder}
        accessibilityHint={description}
        aria-invalid={isInvalid}
        accessibilityState={{ expanded: isOpen, disabled: resolvedDisabled }}
        disabled={resolvedDisabled}
        onPress={() => setIsOpen(true)}
        className={classNames(
          NATIVE_INPUT_BASE_CLASS,
          NATIVE_INPUT_SIZE_CLASS[resolvedSize],
          NATIVE_RADIUS_CLASS[resolvedRadius],
          NATIVE_INPUT_VARIANT_CLASS[resolvedVariant],
          NATIVE_PICKER_TRIGGER_CLASS,
          edgeClass,
          resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
          className,
        )}>
        {pickedValues.length === 0 ? (
          <Text role="body-md">{placeholder}</Text>
        ) : (
          <View className={NATIVE_CHIP_ROW_CLASS}>
            {pickedValues.map((picked) => {
              const option = options.find((entry) => entry.value === picked);

              return (
                <View key={picked} className={NATIVE_CHIP_CLASS}>
                  <Text role="body-sm" className={NATIVE_CHIP_LABEL_CLASS}>
                    {option?.label ?? picked}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${option?.label ?? picked}`}
                    onPress={() =>
                      commit(pickedValues.filter((entry) => entry !== picked))
                    }
                    className={NATIVE_CHIP_REMOVE_CLASS}>
                    <Text role="body-sm" accessible={false}>
                      ✕
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
        <Text role="body-md" accessible={false}>
          ⌄
        </Text>
      </Pressable>
      <PickerSheet
        isOpen={isOpen}
        isMultiple
        options={options}
        selected={pickedValues}
        title={sheetTitle ?? label}
        testID={optionTestID}
        onSelect={(next) =>
          commit(
            pickedValues.includes(next)
              ? pickedValues.filter((entry) => entry !== next)
              : [...pickedValues, next],
          )
        }
        onClose={() => setIsOpen(false)}
      />
    </FieldShell>
  );
}
