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
  type Color,
  type FieldStatus,
  isFieldInvalid,
  type LabelAlign,
  type Radius,
  resolveCascade,
  resolveChange,
  resolveFieldStatusColor,
  type Size,
  type Variant,
} from "@asheeui/core";
import { type ReactNode, useState } from "react";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import { TextInput, View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
} from "../../../styles/input";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import {
  NATIVE_TEXTAREA_BASE_CLASS,
  NATIVE_TEXTAREA_ROW_HEIGHT,
  NATIVE_TEXTAREA_SIZE_CLASS,
} from "../../../styles/textarea";
import { classNames } from "../../../utils/class-names";
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
    Omit<
      TextInputProps,
      "children" | "style" | "multiline" | "rows" | "onChange" | "onChangeText"
    > {
  /** The field's label, which also names the control. */
  label?: string;

  /** Description shown under the label, and the control's hint. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /** Whether the field is waiting for something, which shows a pending marker. */
  isLoading?: boolean;

  /** Content rendered at the start of the field, typically an icon. */
  startContent?: ReactNode;

  /** Content rendered at the end of the field. */
  endContent?: ReactNode;

  /**
   * Called with the field's next value, under the name the browser gives the event.
   *
   * The event is a shim with `target.value`; `preventDefault` and `stopPropagation` are
   * not part of it, because the platform has no default action here to stop.
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
  labelAlign,
  fullWidth,
  startContent,
  endContent,
  className,
  style,
  onFocus,
  onBlur,
  onChange,
  onChangeText,
  onValueChange,
  ...rest
}: TextareaProps) {
  const config = useAsheeConfig();
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
  const resolvedColor = resolveCascade<Color>(
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
  const resolvedLabelAlign = resolveCascade<LabelAlign>(
    labelAlign,
    sectionConfig?.labelAlign,
    undefined,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.labelAlign,
  );
  const resolvedFullWidth = resolveCascade<boolean>(
    fullWidth,
    sectionConfig?.fullWidth,
    undefined,
    FALLBACK_NATIVE_TEXTAREA_CONFIG.fullWidth,
  );

  const isInvalid = isFieldInvalid(resolvedStatus);
  const statusColor = resolveFieldStatusColor(resolvedStatus, resolvedColor);
  const edgeClass = classNames(
    NATIVE_INPUT_EDGE_WIDTH_CLASS[resolvedVariant],
    resolvedStatus !== "default"
      ? NATIVE_INPUT_EDGE_ACCENT_CLASS[statusColor]
      : isFocused
        ? NATIVE_INPUT_EDGE_ACCENT_CLASS[resolvedColor]
        : NATIVE_INPUT_EDGE_NEUTRAL_CLASS[resolvedVariant],
  );

  return (
    <View
      className={classNames(
        "min-w-0",
        resolvedFullWidth ? "w-full" : "self-start",
      )}>
      <FieldShell
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={resolvedRequired}
        isLoading={isLoading}>
        <View className="relative w-full">
          {startContent ? (
            <View
              pointerEvents="none"
              className="absolute left-3 top-3 z-10 flex items-center text-foreground/50">
              {startContent}
            </View>
          ) : null}
          <TextInput
            {...rest}
            accessibilityLabel={label}
            accessibilityHint={description}
            aria-invalid={isInvalid}
            editable={!resolvedDisabled}
            multiline
            numberOfLines={resolvedRows}
            textAlignVertical="top"
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
              NATIVE_TEXTAREA_BASE_CLASS,
              NATIVE_TEXTAREA_SIZE_CLASS[resolvedSize],
              NATIVE_RADIUS_CLASS[resolvedRadius],
              NATIVE_INPUT_VARIANT_CLASS[resolvedVariant],
              edgeClass,
              resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
              startContent ? "pl-11" : undefined,
              endContent ? "pr-11" : undefined,
              className,
            )}
            // The rows option is a height here: the platform's field grows with its
            // content, so the number of rows is what it starts from.
            style={[
              style,
              { minHeight: resolvedRows * NATIVE_TEXTAREA_ROW_HEIGHT },
            ]}
          />
          {endContent ? (
            <View className="absolute right-3 top-3 z-10 flex items-center text-foreground/50">
              {endContent}
            </View>
          ) : null}
        </View>
      </FieldShell>
    </View>
  );
}
