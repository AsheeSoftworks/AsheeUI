/**
 * Autocomplete component for the native package.
 *
 * The component satisfies the framework's autocomplete contract: the same options, the same
 * value, the same change handlers and the same field vocabulary as the web autocomplete.
 * Four things are deliberately native rather than portable:
 *
 * 1. The suggestions are part of the field's own layout rather than a floating list, because
 *    the platform has no hover and no pointer: a reader comparing what they typed against
 *    what it matches has to see both at once.
 * 2. The value is reported when an option is picked, and the text is reported separately as
 *    the reader types, so a consumer can drive a remote lookup from the text and a form
 *    value from the pick.
 * 3. A value is a string. A key of another type travels as its string form.
 * 4. There is no change event. Picking reports the value and the option it came from, and
 *    the platform's event object stays with the platform.
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
import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import type { PickerSheetOption } from "../picker/PickerSheet";
import {
  NATIVE_SUGGESTION_CLASS,
  NATIVE_SUGGESTION_EMPTY_CLASS,
  NATIVE_SUGGESTION_LIST_CLASS,
} from "../picker/picker-styles";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG,
  type NativeAutocompleteConfig,
} from "./autocomplete-config";

/**
 * Props for the native Autocomplete.
 */
export interface AutocompleteProps extends NativeAutocompleteConfig {
  /** The options the reader picks from. */
  options: readonly PickerSheetOption[];

  /** The picked value, for a consumer that owns it. */
  value?: string;

  /** Called with the picked value and the option it came from. */
  onValueChange?: (value: string, option?: PickerSheetOption) => void;

  /** Called with the text as the reader types, which is what a remote lookup follows. */
  onInputChange?: (inputValue: string) => void;

  /** Whether the text the reader typed may stand as the value. Defaults to false. */
  allowCustomValue?: boolean;

  /** Hint text shown while the field is empty. */
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

  /** What the suggestions say when nothing matches. */
  noResultsLabel?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Identifier for the text field, so a test can reach it. */
  testID?: string;

  /** Identifier prefix for the suggestions, so a test can reach one. */
  optionTestID?: string;
}

/**
 * A field that suggests options as the reader types.
 *
 * @param props - The field's options.
 * @param props.options - The options the reader picks from.
 * @param props.value - The picked value, for a consumer that owns it.
 * @param props.onValueChange - Called with the picked value and its option.
 * @param props.onInputChange - Called with the text as the reader types.
 * @param props.allowCustomValue - Let the typed text stand as the value.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   label="City"
 *   placeholder="Start typing"
 *   options={[{ value: "nbo", label: "Nairobi" }]}
 *   onValueChange={setCity}
 * />
 * ```
 *
 * @see Dropmenu - The field that picks from a fixed list.
 * @see Input - The field that takes any text.
 */
export function Autocomplete({
  options,
  value,
  onValueChange,
  onInputChange,
  allowCustomValue = false,
  placeholder,
  label,
  description,
  message,
  status,
  isLoading,
  noResultsLabel = "No matches",
  size,
  radius,
  variant,
  color,
  isDisabled,
  required,
  className,
  testID,
  optionTestID,
}: AutocompleteProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.autocomplete;
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG.color,
  );
  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG.status,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_AUTOCOMPLETE_CONFIG.required,
  );

  // The field shows the label of the value it was given, so a controlled field opens with
  // the option's own text rather than with its key.
  useEffect(() => {
    if (value === undefined) return;

    const selected = options.find((option) => option.value === value);
    setText(selected?.label ?? value);
  }, [value, options]);

  const query = text.trim().toLowerCase();
  const matches =
    query.length === 0
      ? []
      : options.filter((option) => option.label.toLowerCase().includes(query));
  const isListOpen = isFocused && !resolvedDisabled && query.length > 0;

  const isInvalid = isFieldInvalid(resolvedStatus);
  const edgeClass = classNames(
    NATIVE_INPUT_EDGE_WIDTH_CLASS[resolvedVariant],
    isInvalid
      ? NATIVE_INPUT_EDGE_INVALID_CLASS
      : isFocused
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
      <TextInput
        testID={testID}
        accessibilityLabel={label}
        accessibilityHint={description}
        aria-invalid={isInvalid}
        aria-expanded={isListOpen}
        editable={!resolvedDisabled}
        placeholder={placeholder}
        value={text}
        onChangeText={(next) => {
          setText(next);
          onInputChange?.(next);
          if (allowCustomValue) onValueChange?.(next);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(
          NATIVE_INPUT_BASE_CLASS,
          NATIVE_INPUT_SIZE_CLASS[resolvedSize],
          NATIVE_RADIUS_CLASS[resolvedRadius],
          NATIVE_INPUT_VARIANT_CLASS[resolvedVariant],
          edgeClass,
          resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
          className,
        )}
      />
      {isListOpen && (
        <View className={NATIVE_SUGGESTION_LIST_CLASS}>
          {matches.length === 0 ? (
            <Text role="body-sm" className={NATIVE_SUGGESTION_EMPTY_CLASS}>
              {noResultsLabel}
            </Text>
          ) : (
            matches.map((option) => (
              <Pressable
                key={option.value}
                testID={
                  optionTestID ? `${optionTestID}-${option.value}` : undefined
                }
                accessibilityRole="button"
                accessibilityLabel={option.label}
                accessibilityHint={option.description}
                accessibilityState={{
                  selected: option.value === value,
                  disabled: Boolean(option.isDisabled),
                }}
                disabled={option.isDisabled}
                onPress={() => {
                  setText(option.label);
                  onValueChange?.(option.value, option);
                  setIsFocused(false);
                }}
                className={NATIVE_SUGGESTION_CLASS}>
                <Text role="body-md">{option.label}</Text>
                {option.description && (
                  <Text role="body-sm" tone="muted">
                    {option.description}
                  </Text>
                )}
              </Pressable>
            ))
          )}
        </View>
      )}
    </FieldShell>
  );
}
