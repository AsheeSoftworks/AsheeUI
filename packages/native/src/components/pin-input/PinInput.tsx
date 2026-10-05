/**
 * PinInput component for the native package.
 *
 * The component satisfies the framework's code-field contract: the same length, accepted
 * characters, masking, validation vocabulary, completion reporting and dense value as the
 * web field, whose rules it reads from `@asheeui/core` rather than restating them.
 *
 * One thing is deliberately native rather than portable, and it is what the platform
 * offers rather than a preference: the value is typed into *one* field behind the boxes
 * rather than into a field per box. A native control has a single caret, so a code that
 * moves between several controls cannot be typed the way the platform types text; the
 * boxes draw what the field holds, and tapping the group moves the caret into it. The
 * rules are untouched: the value is dense, so removing a character in the middle moves the
 * ones after it left, exactly as on the web.
 */

import {
  type FieldStatus,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_PIN_INPUT_BOX_CLASS,
  NATIVE_PIN_INPUT_BOX_DEFAULT_CLASS,
  NATIVE_PIN_INPUT_BOX_DISABLED_CLASS,
  NATIVE_PIN_INPUT_BOX_INVALID_CLASS,
  NATIVE_PIN_INPUT_FIELD_CLASS,
  NATIVE_PIN_INPUT_FONT_CLASS,
  NATIVE_PIN_INPUT_GROUP_CLASS,
  NATIVE_PIN_INPUT_SEPARATOR_CLASS,
  NATIVE_PIN_INPUT_SIZE_CLASS,
  NATIVE_PIN_INPUT_VALUE_CLASS,
  NATIVE_PIN_INPUT_VALUE_DISABLED_CLASS,
  NATIVE_RADIUS_CLASS,
  type PinInputMode,
  type PinInputSize,
  type Radius,
  resolveCascade,
  sanitizePinValue,
} from "@asheeui/core";
import { Fragment, useRef, useState } from "react";
import type { TextInput as PlatformTextInput } from "react-native";
import { Pressable, TextInput, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_PIN_INPUT_CONFIG,
  type NativePinInputConfig,
} from "./pin-input-config";

/** The keyboard a mode asks the platform for. */
const PIN_INPUT_KEYBOARD_TYPE: Record<PinInputMode, "number-pad" | "default"> =
  {
    numeric: "number-pad",
    alphanumeric: "default",
    text: "default",
  };

/**
 * Props for the native PinInput.
 */
export interface PinInputProps extends NativePinInputConfig {
  /** The code, for a consumer that owns the value. */
  value?: string;

  /** The initial code, for a consumer that does not. */
  defaultValue?: string;

  /** Called with the whole code whenever it changes. */
  onValueChange?: (value: string) => void;

  /**
   * Called once when the code reaches its full length.
   * It fires per completion rather than on every keystroke, so a consumer can submit from it.
   */
  onComplete?: (value: string) => void;

  /** The field's label, shown above the boxes. */
  label?: string;

  /** Description shown under the label. */
  description?: string;

  /** Validation message shown under the boxes. */
  message?: string;

  /** Validation status of the field. Defaults to `"default"`. */
  status?: FieldStatus;

  /** Whether the field must be filled in. Defaults to false. */
  required?: boolean;

  /** Whether the label shows a pending state. Defaults to false. */
  isLoading?: boolean;

  /**
   * Accessible name of the group of boxes, for a field with no visible label.
   *
   * @default "Verification code"
   */
  groupLabel?: string;

  /**
   * Draw a separator after this many boxes.
   * Purely presentational grouping, hidden from assistive technology.
   */
  separatorAfter?: number;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Identifier for the field the platform types into, so a test can reach it. */
  testID?: string;
}

/**
 * A field that collects a code one character at a time.
 *
 * The code is controlled by `value` or kept by the field itself, and reported through
 * `onValueChange` on every change and through `onComplete` when it becomes complete.
 *
 * @param props - The field's options.
 * @param props.length - Number of characters. Defaults to the configured value.
 * @param props.mode - Accepted characters. Defaults to the configured value.
 * @param props.masked - Hide the typed characters. Defaults to the configured value.
 * @param props.value - The code, for a controlled field.
 * @param props.onValueChange - Called with the code on every change.
 * @param props.onComplete - Called when the code becomes complete.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <PinInput
 *   label="Verification code"
 *   length={6}
 *   description="The six digits we sent to your phone."
 *   onComplete={verify}
 * />
 * ```
 *
 * @see Input - The field for a value that is not a code.
 */
export function PinInput({
  value,
  defaultValue,
  onValueChange,
  onComplete,
  label,
  description,
  message,
  status,
  required,
  isLoading,
  groupLabel = "Verification code",
  separatorAfter,
  length,
  mode,
  size,
  masked,
  radius,
  isDisabled,
  isInvalid,
  className,
  testID,
}: PinInputProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.pininput;
  const [typedValue, setTypedValue] = useState(defaultValue ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const fieldRef = useRef<PlatformTextInput>(null);

  const resolvedLength = resolveCascade<number>(
    length,
    sectionConfig?.length,
    undefined,
    FALLBACK_NATIVE_PIN_INPUT_CONFIG.length,
  );
  const resolvedMode = resolveCascade<PinInputMode>(
    mode,
    sectionConfig?.mode,
    undefined,
    FALLBACK_NATIVE_PIN_INPUT_CONFIG.mode,
  );
  const resolvedSize = resolveCascade<PinInputSize>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_PIN_INPUT_CONFIG.size,
  );
  const resolvedMasked = resolveCascade<boolean>(
    masked,
    sectionConfig?.masked,
    undefined,
    FALLBACK_NATIVE_PIN_INPUT_CONFIG.masked,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_PIN_INPUT_CONFIG.radius,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_PIN_INPUT_CONFIG.isDisabled,
  );
  const resolvedInvalid = resolveCascade<boolean>(
    isInvalid,
    sectionConfig?.isInvalid,
    undefined,
    FALLBACK_NATIVE_PIN_INPUT_CONFIG.isInvalid,
  );

  const resolvedStatus = status ?? "default";
  const isControlled = value !== undefined;
  const code = isControlled ? value : typedValue;

  const update = (next: string) => {
    const capped = sanitizePinValue(next, resolvedMode, resolvedLength);

    if (!isControlled) setTypedValue(capped);
    onValueChange?.(capped);

    if (capped.length === resolvedLength) onComplete?.(capped);
  };

  const boxStateClass = resolvedDisabled
    ? NATIVE_PIN_INPUT_BOX_DISABLED_CLASS
    : resolvedInvalid
      ? NATIVE_PIN_INPUT_BOX_INVALID_CLASS
      : NATIVE_PIN_INPUT_BOX_DEFAULT_CLASS;

  return (
    <FieldShell
      label={label}
      description={description}
      message={message}
      status={resolvedStatus}
      required={required}
      isLoading={isLoading}>
      <Pressable
        accessibilityLabel={label ? undefined : groupLabel}
        accessibilityHint={description}
        disabled={resolvedDisabled}
        onPress={() => fieldRef.current?.focus()}
        className={classNames(NATIVE_PIN_INPUT_GROUP_CLASS, className)}>
        <TextInput
          ref={fieldRef}
          testID={testID}
          accessibilityLabel={groupLabel}
          accessibilityHint={description}
          aria-invalid={resolvedInvalid}
          editable={!resolvedDisabled}
          keyboardType={PIN_INPUT_KEYBOARD_TYPE[resolvedMode]}
          secureTextEntry={resolvedMasked}
          maxLength={resolvedLength}
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          value={code}
          onChangeText={update}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={NATIVE_PIN_INPUT_FIELD_CLASS}
        />
        {Array.from({ length: resolvedLength }, (_, index) => (
          <Fragment key={`pin-${index}`}>
            <View
              accessible={false}
              className={classNames(
                NATIVE_PIN_INPUT_BOX_CLASS,
                NATIVE_PIN_INPUT_SIZE_CLASS[resolvedSize],
                NATIVE_RADIUS_CLASS[resolvedRadius],
                boxStateClass,
                // The box the next character lands in takes the accent while the field has
                // focus, which is where a caret would be.
                isFocused && !resolvedDisabled && index === code.length
                  ? NATIVE_INPUT_EDGE_ACCENT_CLASS[config.defaultColor]
                  : undefined,
              )}>
              <Text
                role="body-lg"
                className={classNames(
                  NATIVE_PIN_INPUT_FONT_CLASS[resolvedSize],
                  resolvedDisabled
                    ? NATIVE_PIN_INPUT_VALUE_DISABLED_CLASS
                    : NATIVE_PIN_INPUT_VALUE_CLASS,
                )}>
                {resolvedMasked && code[index] ? "•" : (code[index] ?? "")}
              </Text>
            </View>
            {separatorAfter !== undefined &&
              separatorAfter > 0 &&
              index + 1 === separatorAfter &&
              index + 1 < resolvedLength && (
                <Text
                  accessible={false}
                  role="body-md"
                  className={NATIVE_PIN_INPUT_SEPARATOR_CLASS}>
                  -
                </Text>
              )}
          </Fragment>
        ))}
      </Pressable>
    </FieldShell>
  );
}
