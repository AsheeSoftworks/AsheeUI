/**
 * Dropmenu component for the native package.
 *
 * The component satisfies the framework's select contract: the same options, the same
 * value, the same change handler, the same placeholder and the same field vocabulary as the
 * web select. Four things are deliberately native rather than portable:
 *
 * 1. The trigger announces itself as a combobox and reports whether it is open, which is
 *    where the platform reads a picker's state, instead of the web's listbox markup.
 * 2. The options are one surface at a time, because the platform has no floating layer to
 *    place beside the trigger.
 * 3. The search the web offers inside its list is absent: the surface scrolls, and a search
 *    control inside a modal is a second field rather than part of the first.
 * 4. The value is a string. A key of another type travels as its string form.
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
import { Pressable } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import { PickerSheet, type PickerSheetOption } from "../picker/PickerSheet";
import { NATIVE_PICKER_TRIGGER_CLASS } from "../picker/picker-styles";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_DROPMENU_CONFIG,
  type NativeDropmenuConfig,
} from "./dropmenu-config";

/**
 * Props for the native Dropmenu.
 */
export interface DropmenuProps extends NativeDropmenuConfig {
  /** The options the reader picks from. */
  options: readonly PickerSheetOption[];

  /** The picked value, for a consumer that owns it. */
  value?: string;

  /** The value picked at first, for a consumer that does not. */
  initialValue?: string;

  /** Called with the value the reader picked. */
  onValueChange?: (value: string) => void;

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
 * A field that picks one option from a list.
 *
 * @param props - The field's options.
 * @param props.options - The options the reader picks from.
 * @param props.value - The picked value, for a controlled field.
 * @param props.initialValue - The value picked at first, for an uncontrolled one.
 * @param props.onValueChange - Called with the value the reader picked.
 * @param props.placeholder - What the trigger says while nothing is picked.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <Dropmenu
 *   label="Country"
 *   placeholder="Pick a country"
 *   options={[{ value: "ke", label: "Kenya" }]}
 *   onValueChange={setCountry}
 * />
 * ```
 *
 * @see MultiSelect - The field that picks several options from the same surface.
 * @see Input - The field a consumer types into instead of picking.
 */
export function Dropmenu({
  options,
  value,
  initialValue,
  onValueChange,
  placeholder = "Select an option",
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
}: DropmenuProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.dropmenu;
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_DROPMENU_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_DROPMENU_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_DROPMENU_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_DROPMENU_CONFIG.color,
  );
  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_DROPMENU_CONFIG.status,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_DROPMENU_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_DROPMENU_CONFIG.required,
  );

  const isControlled = value !== undefined;
  const picked = isControlled ? value : uncontrolledValue;
  const pickedOption = options.find((option) => option.value === picked);

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
        accessibilityState={{
          expanded: isOpen,
          disabled: resolvedDisabled,
        }}
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
        <Text role="body-md">{pickedOption?.label ?? placeholder}</Text>
        <Text role="body-md" accessible={false}>
          ⌄
        </Text>
      </Pressable>
      <PickerSheet
        isOpen={isOpen}
        options={options}
        selected={picked ? [picked] : []}
        title={sheetTitle ?? label}
        testID={optionTestID}
        onSelect={(next) => {
          if (!isControlled) setUncontrolledValue(next);
          onValueChange?.(next);
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    </FieldShell>
  );
}
