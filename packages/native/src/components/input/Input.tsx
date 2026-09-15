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
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/shared";
import { useState } from "react";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import { TextInput } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_NATIVE_INPUT_CONFIG,
  type NativeInputConfig,
} from "./input-config";
import {
  INPUT_BASE_CLASS,
  INPUT_DISABLED_CLASS,
  INPUT_EDGE_ACCENT_CLASS,
  INPUT_EDGE_INVALID_CLASS,
  INPUT_EDGE_NEUTRAL_CLASS,
  INPUT_EDGE_WIDTH_CLASS,
  INPUT_MULTILINE_CLASS,
  INPUT_RADIUS_CLASS,
  INPUT_SIZE_CLASS,
  INPUT_VARIANT_CLASS,
} from "./input-styles";

/**
 * Props for the native Input.
 */
export interface InputProps
  extends NativeInputConfig,
    Omit<TextInputProps, "children" | "style"> {
  /** The field's label, which also names the control. */
  label?: string;

  /** Description shown under the label, and the control's hint. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

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
  ...rest
}: InputProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.input;
  const [isFocused, setIsFocused] = useState(false);

  const resolvedStatus = resolveCascade<NativeInputConfig["status"]>(
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

  const isInvalid = resolvedStatus === "error";
  const edgeClass = classNames(
    INPUT_EDGE_WIDTH_CLASS[resolvedVariant],
    isInvalid
      ? INPUT_EDGE_INVALID_CLASS
      : isFocused
        ? INPUT_EDGE_ACCENT_CLASS[resolvedColor]
        : INPUT_EDGE_NEUTRAL_CLASS[resolvedVariant],
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
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        className={classNames(
          INPUT_BASE_CLASS,
          INPUT_SIZE_CLASS[resolvedSize],
          INPUT_RADIUS_CLASS[resolvedRadius],
          INPUT_VARIANT_CLASS[resolvedVariant],
          edgeClass,
          resolvedMultiline && INPUT_MULTILINE_CLASS,
          resolvedDisabled && INPUT_DISABLED_CLASS,
          className,
        )}
        style={style}
      />
    </FieldShell>
  );
}
