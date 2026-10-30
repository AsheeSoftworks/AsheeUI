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
  type LabelAlign,
  type Radius,
  resolveCascade,
  resolveChange,
  type Size,
} from "@asheeui/core";
import { type ReactNode, useState } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Pressable, TextInput, View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_INPUT_BASE_CLASS,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_INVALID_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_SIZE_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
} from "../../../styles/input";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import {
  NATIVE_SEARCH_INPUT_CLEAR_CLASS,
  NATIVE_SEARCH_INPUT_CLEAR_GLYPH_CLASS,
  NATIVE_SEARCH_INPUT_FIELD_CLASS,
  NATIVE_SEARCH_INPUT_ROW_CLASS,
} from "../../../styles/search-input";
import { classNames } from "../../../utils/class-names";
import { Spinner } from "../../feedback/spinner/Spinner";
import { Typography } from "../../typography/text/Text";
import { FieldShell } from "../field/FieldShell";
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

  /**
   * Called with the next query, under the name the browser gives the event.
   *
   * The event is a shim with `target.value`; `preventDefault` and `stopPropagation` are not
   * part of it, because the platform has no default action here to stop.
   */
  onChange?: (event: { target: { value: string } }) => void;

  /** Called with the next query, under the platform's most specific name. */
  onChangeText?: (value: string) => void;

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

  /** Whether the field must be filled in. */
  required?: boolean;

  /** Where the label row sits across the field. Defaults to "left". */
  labelAlign?: LabelAlign;

  /** Whether the field stretches to its parent's width. Defaults to true. */
  fullWidth?: boolean;

  /** Content rendered before the field, typically an icon. */
  startContent?: ReactNode;

  /** Content rendered after the field and before the dismiss control. */
  endContent?: ReactNode;

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
  onChange,
  onChangeText,
  onValueChange,
  onSearch,
  description,
  message,
  status,
  isLoading,
  required = false,
  labelAlign = "left",
  fullWidth = true,
  startContent,
  endContent,
  size,
  color,
  clearable,
  label,
  hideLabel,
  isDisabled,
  style,
  className,
}: SearchInputProps) {
  const config = useAsheeConfig();
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
    <View
      className={classNames(
        "min-w-0",
        fullWidth ? "w-full" : "self-start",
      )}>
      <FieldShell
        label={resolvedHideLabel ? undefined : resolvedLabel}
        labelAlign={labelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}>
        <View className={classNames(NATIVE_SEARCH_INPUT_ROW_CLASS, className)}>
          {startContent ? (
            <View
              pointerEvents="none"
              className="shrink-0 items-center text-foreground/50">
              {startContent}
            </View>
          ) : null}
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
              resolveChange({ onChange, onChangeText, onValueChange }, next);
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
          {endContent ? (
            <View className="shrink-0 items-center text-foreground/50">
              {endContent}
            </View>
          ) : null}
          {isLoading && <Spinner size="sm" />}
          {resolvedClearable && query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              disabled={resolvedDisabled}
              onPress={() => {
                if (!isControlled) setTypedValue("");
                resolveChange({ onChange, onChangeText, onValueChange }, "");
              }}
              className={NATIVE_SEARCH_INPUT_CLEAR_CLASS}>
              <Typography
                role="body-md"
                className={NATIVE_SEARCH_INPUT_CLEAR_GLYPH_CLASS}>
                ✕
              </Typography>
            </Pressable>
          )}
        </View>
      </FieldShell>
    </View>
  );
}
