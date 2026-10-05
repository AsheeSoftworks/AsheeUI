/**
 * SearchInput component for the native package.
 *
 * The component satisfies the framework's search contract with the platform's own text
 * field: the same query, the same dismiss control, the same submit handler and the same
 * naming decisions as the web search field. Four things are deliberately native rather
 * than portable:
 *
 * 1. The field announces itself with `accessibilityRole="search"` and a label, which is
 *    where the platform reads a search field's purpose and name; the role sits on the
 *    field itself rather than on a wrapper, because the platform's control is what a
 *    reader moves to.
 * 2. The dismiss control is a pressable box rather than a button element, because a
 *    control a thumb cannot hit is a defect rather than a style choice.
 * 3. Submitting is the keyboard's own return key, so `onSearch` is reported from the
 *    platform's submit event rather than from a form element.
 * 4. The keyboard hint the web shows is absent: a shortcut a consumer bound elsewhere is
 *    shown beside a web field, and the platform has no keyboard to bind.
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
  NATIVE_SEARCH_INPUT_CLEAR_CLASS,
  NATIVE_SEARCH_INPUT_CLEAR_GLYPH_CLASS,
  NATIVE_SEARCH_INPUT_FIELD_CLASS,
  NATIVE_SEARCH_INPUT_ROW_CLASS,
  type Radius,
  resolveCascade,
  type Size,
} from "@asheeui/core";
import { useState } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Pressable, TextInput, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import { Spinner } from "../spinner/Spinner";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_SEARCH_INPUT_CONFIG,
  type NativeSearchInputConfig,
} from "./search-input-config";

/**
 * Props for the native SearchInput.
 */
export interface SearchInputProps extends NativeSearchInputConfig {
  /** The query, for a consumer that owns it. */
  value?: string;

  /** The initial query, for a consumer that does not. */
  defaultValue?: string;

  /** Called with the next query whenever it changes, including when the field is emptied. */
  onValueChange?: (value: string) => void;

  /** Called with the query when the reader submits the field. */
  onSearch?: (value: string) => void;

  /** Supporting text under the field. */
  description?: string;

  /** Validation message under the field. */
  message?: string;

  /** Validation status of the field. Defaults to `"default"`. */
  status?: FieldStatus;

  /** Whether a search is in progress, which the field reports as busy. */
  isLoading?: boolean;

  /** Platform styles for the field itself, for what NativeWind cannot express. */
  style?: StyleProp<TextStyle>;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;
}

/**
 * A field that searches.
 *
 * The query is controlled by `value` or kept by the field itself, and reported through
 * `onValueChange` on every change and through `onSearch` when the reader submits it, so a
 * consumer can drive a result list from either.
 *
 * @param props - The field's options.
 * @param props.value - The query, for a controlled field.
 * @param props.defaultValue - The initial query, for an uncontrolled one.
 * @param props.onValueChange - Called with the next query on every change.
 * @param props.onSearch - Called with the query when it is submitted.
 * @param props.label - The field's name. Defaults to the configured value.
 * @param props.hideLabel - Name the field without captioning it. Defaults to the configured value.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <SearchInput
 *   label="Search invoices"
 *   onValueChange={setQuery}
 *   onSearch={run}
 * />
 * ```
 *
 * @see Input - The plain field this one composes.
 */
export function SearchInput({
  value,
  defaultValue,
  onValueChange,
  onSearch,
  description,
  message,
  status,
  isLoading,
  size,
  color,
  clearable,
  label,
  hideLabel,
  isDisabled,
  style,
  className,
}: SearchInputProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.searchinput;
  const [typedValue, setTypedValue] = useState(defaultValue ?? "");
  const [isFocused, setIsFocused] = useState(false);

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_SEARCH_INPUT_CONFIG.size,
  );
  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_SEARCH_INPUT_CONFIG.color,
  );
  const resolvedClearable = resolveCascade<boolean>(
    clearable,
    sectionConfig?.clearable,
    undefined,
    FALLBACK_NATIVE_SEARCH_INPUT_CONFIG.clearable,
  );
  const resolvedLabel = resolveCascade<string>(
    label,
    sectionConfig?.label,
    undefined,
    FALLBACK_NATIVE_SEARCH_INPUT_CONFIG.label,
  );
  const resolvedHideLabel = resolveCascade<boolean>(
    hideLabel,
    sectionConfig?.hideLabel,
    undefined,
    FALLBACK_NATIVE_SEARCH_INPUT_CONFIG.hideLabel,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_SEARCH_INPUT_CONFIG.isDisabled,
  );

  const resolvedStatus = status ?? "default";
  const isInvalid = isFieldInvalid(resolvedStatus);
  const isControlled = value !== undefined;
  const query = isControlled ? value : typedValue;

  // A search field has no rounding of its own, so it takes the application's default
  // radius rather than pinning one.
  const resolvedRadius: Radius = config.defaultRadius;
  const edgeClass = classNames(
    NATIVE_INPUT_EDGE_WIDTH_CLASS.bordered,
    isInvalid
      ? NATIVE_INPUT_EDGE_INVALID_CLASS
      : isFocused
        ? NATIVE_INPUT_EDGE_ACCENT_CLASS[resolvedColor]
        : NATIVE_INPUT_EDGE_NEUTRAL_CLASS.bordered,
  );

  return (
    <FieldShell
      label={resolvedHideLabel ? undefined : resolvedLabel}
      description={description}
      message={message}
      status={resolvedStatus}
      isLoading={isLoading}>
      <View className={classNames(NATIVE_SEARCH_INPUT_ROW_CLASS, className)}>
        <TextInput
          accessibilityRole="search"
          accessibilityLabel={resolvedLabel}
          accessibilityHint={description}
          aria-invalid={isInvalid}
          editable={!resolvedDisabled}
          returnKeyType="search"
          value={query}
          onChangeText={(next) => {
            if (!isControlled) setTypedValue(next);
            onValueChange?.(next);
          }}
          onSubmitEditing={() => onSearch?.(query)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={classNames(
            NATIVE_INPUT_BASE_CLASS,
            NATIVE_INPUT_SIZE_CLASS[resolvedSize],
            NATIVE_RADIUS_CLASS[resolvedRadius],
            NATIVE_INPUT_VARIANT_CLASS.bordered,
            edgeClass,
            NATIVE_SEARCH_INPUT_FIELD_CLASS,
            resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
          )}
          style={style}
        />
        {isLoading && <Spinner size="sm" />}
        {resolvedClearable && query.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            disabled={resolvedDisabled}
            onPress={() => {
              if (!isControlled) setTypedValue("");
              onValueChange?.("");
            }}
            className={NATIVE_SEARCH_INPUT_CLEAR_CLASS}>
            <Text
              role="body-md"
              className={NATIVE_SEARCH_INPUT_CLEAR_GLYPH_CLASS}>
              ✕
            </Text>
          </Pressable>
        )}
      </View>
    </FieldShell>
  );
}
