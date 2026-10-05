/**
 * Textarea component for the native package.
 *
 * The component satisfies the framework's field contract with the platform's own
 * multi-line text field. Three things are deliberately native rather than portable:
 *
 * 1. `rows` becomes a minimum height. The platform's field grows with its content and
 *    has no rows to hand a browser, so the shared option is read as the height the field
 *    starts from.
 * 2. The text starts at the top of the box, which is a platform property rather than a
 *    class.
 * 3. Focus is a state the component tracks, because the platform has no focus variant
 *    to style against.
 */

import {
  type ColorRole,
  type FieldStatus,
  isFieldInvalid,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_INVALID_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
  NATIVE_RADIUS_CLASS,
  NATIVE_TEXTAREA_BASE_CLASS,
  NATIVE_TEXTAREA_ROW_HEIGHT,
  NATIVE_TEXTAREA_SIZE_CLASS,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/core";
import { useState } from "react";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import { TextInput } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_NATIVE_TEXTAREA_CONFIG,
  type NativeTextareaConfig,
} from "./textarea-config";

/**
 * Props for the native Textarea.
 */
export interface TextareaProps
  extends NativeTextareaConfig,
    Omit<TextInputProps, "children" | "style" | "multiline"> {
  /** The field's label, which also names the control. */
  label?: string;

  /** Description shown under the label, and the control's hint. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /** Whether the field is waiting for something, which shows a pending marker. */
  isLoading?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<TextStyle>;
}

/**
 * A field for a value that needs more than one line.
 *
 * @param props - The field's options and the platform's text input props.
 * @param props.label - The field's label.
 * @param props.description - The explanation under the label.
 * @param props.message - The validation message under the field.
 * @param props.rows - How much of the value is visible at once. Defaults to the configured value.
 * @param props.status - Validation status. Defaults to the configured value.
 * @param props.isDisabled - Make the field unavailable. Defaults to the configured value.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Notes"
 *   rows={6}
 *   placeholder="Anything the next person should know"
 *   onChangeText={setNotes}
 * />
 * ```
 *
 * @see FieldShell - The label, description and message block the field shows.
 * @see Input - The field for a value that fits on one line.
 */
export function Textarea({
  label,
  description,
  message,
  isLoading,
  rows,
  status,
  size,
  radius,
  variant,
  color,
  isDisabled,
  required,
  className,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextareaProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.textarea;
  const [isFocused, setIsFocused] = useState(false);

  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.status,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.color,
  );
  const resolvedRows = resolveCascade<number>(
    rows,
    sectionConfig?.rows,
    undefined,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.rows,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.required,
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
      required={resolvedRequired}
      isLoading={isLoading}>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityHint={description}
        aria-invalid={isInvalid}
        editable={!resolvedDisabled}
        multiline
        numberOfLines={resolvedRows}
        textAlignVertical="top"
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        className={classNames(
          NATIVE_TEXTAREA_BASE_CLASS,
          NATIVE_TEXTAREA_SIZE_CLASS[resolvedSize],
          NATIVE_RADIUS_CLASS[resolvedRadius],
          NATIVE_INPUT_VARIANT_CLASS[resolvedVariant],
          edgeClass,
          resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
          className,
        )}
        // The rows option is a height here: the platform's field grows with its
        // content, so the number of rows is what it starts from.
        style={[
          style,
          { minHeight: resolvedRows * NATIVE_TEXTAREA_ROW_HEIGHT },
        ]}
      />
    </FieldShell>
  );
}
