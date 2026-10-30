/**
 * Input component for the native package.
 *
 * The component satisfies the framework's input contract: the same value,
 * initial value, change handler, label, description, message and status names as
 * the web field, implemented as the platform's own text field. Two things are
 * deliberately native rather than portable:
 *
 * 1. The field announces itself through `accessibilityLabel` and
 *    `accessibilityHint`, which is where the platform reads a field's name and
 *    its explanation, instead of the web's referenced description.
 * 2. Focus is a state the component tracks, because the platform has no focus
 *    variant to style against.
 */

import {
  type ColorRole,
  type FieldStatus,
  isFieldInvalid,
  type Radius,
  resolveCascade,
  resolveChange,
  type Size,
  type Variant,
} from "@asheeui/core";
import { useState } from "react";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import { TextInput } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_INPUT_BASE_CLASS,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_INVALID_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_MULTILINE_CLASS,
  NATIVE_INPUT_SIZE_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
} from "../../../styles/input";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import { classNames } from "../../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_NATIVE_INPUT_CONFIG,
  type NativeInputConfig,
} from "./input-config";

/**
 * Props for the native Input.
 */
export interface InputProps
  extends NativeInputConfig,
    Omit<
      TextInputProps,
      "children" | "multiline" | "style" | "onChange" | "onChangeText"
    > {
  /** The field's label, which also names the control. */
  label?: string;

  /** Description shown under the label, and the control's hint. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /**
   * Called with the field's next value, under the name the browser gives the event.
   *
   * The event is a shim with `target.value`; `preventDefault` and `stopPropagation` are not
   * part of it, because the platform has no default action here to stop.
   */
  onChange?: (event: { target: { value: string } }) => void;

  /** Called with the field's next value, under the platform's most specific name. */
  onChangeText?: (value: string) => void;

  /** Called with the field's next value, under the name the picker family already used. */
  onValueChange?: (value: string) => void;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<TextStyle>;
}

/**
 * A single or multi-line text field.
 *
 * @param props - The field's options and the platform's text input props.
 * @param props.label - The field's label.
 * @param props.description - The explanation under the label.
 * @param props.message - The validation message under the field.
 * @param props.status - Validation status. Defaults to the configured value.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.multiline - Accept several lines. Defaults to the configured value.
 * @param props.isDisabled - Make the field unavailable. Defaults to the configured value.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="you@example.com"
 *   keyboardType="email-address"
 *   onChangeText={setEmail}
 * />
 * ```
 *
 * @see FieldShell - The label, description and message block the field shows.
 * @see Button - The control a form submits with.
 */
export function Input({
  label,
  description,
  message,
  status,
  size,
  radius,
  variant,
  color,
  multiline,
  isDisabled,
  required,
  className,
  style,
  onFocus,
  onBlur,
  onChange,
  onChangeText,
  onValueChange,
  ...rest
}: InputProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.input;
  const [isFocused, setIsFocused] = useState(false);

  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.status,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_INPUT_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_INPUT_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_INPUT_CONFIG.color,
  );
  const resolvedMultiline = resolveCascade<boolean>(
    multiline,
    sectionConfig?.multiline,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.multiline,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.required,
  );

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
      required={resolvedRequired}>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityHint={description}
        aria-invalid={isInvalid}
        editable={!resolvedDisabled}
        multiline={resolvedMultiline}
        onChangeText={(value) =>
          resolveChange({ onChange, onChangeText, onValueChange }, value)
        }
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        className={classNames(
          NATIVE_INPUT_BASE_CLASS,
          NATIVE_INPUT_SIZE_CLASS[resolvedSize],
          NATIVE_RADIUS_CLASS[resolvedRadius],
          NATIVE_INPUT_VARIANT_CLASS[resolvedVariant],
          edgeClass,
          resolvedMultiline && NATIVE_INPUT_MULTILINE_CLASS,
          resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
          className,
        )}
        style={style}
      />
    </FieldShell>
  );
}
