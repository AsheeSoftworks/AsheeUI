/**
 * PinInput component for AsheeUI.
 *
 * This file provides the `PinInput` field: one box per character of a
 * verification code, with keyboard navigation, paste distribution, deletion and
 * completion reporting. It owns input behaviour and presentation only: the code
 * is a value the consumer verifies, and no authentication logic lives here.
 */

"use client";

import {
  type ClipboardEvent,
  Fragment,
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared";
import { cn } from "../../utils";
import {
  resolveClassKey,
  resolveConfigCascade,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type { FieldStatus, LabelAlign } from "../field/field-config";
import {
  FALLBACK_PIN_INPUT_CONFIG,
  type PinInputConfig,
  type PinInputMode,
} from "./pin-input-config";
import {
  PIN_INPUT_BOX_CLASS,
  PIN_INPUT_BOX_DEFAULT_CLASS,
  PIN_INPUT_BOX_DISABLED_CLASS,
  PIN_INPUT_BOX_INVALID_CLASS,
  PIN_INPUT_GROUP_CLASS,
  PIN_INPUT_SEPARATOR_CLASS,
  PIN_INPUT_SIZE_CLASS,
} from "./pin-input-styles";

/**
 * Keep only the characters a mode accepts.
 *
 * @param raw - The text to filter.
 * @param mode - The characters the field accepts.
 * @returns The filtered text.
 */
export function sanitizePinValue(raw: string, mode: PinInputMode): string {
  if (mode === "numeric") {
    return raw.replace(/\D+/g, "");
  }
  if (mode === "alphanumeric") {
    return raw.replace(/[^0-9a-zA-Z]+/g, "");
  }
  return raw.replace(/\s+/g, "");
}

type BasePinInputProps = PinInputConfig &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "value"
    | "defaultValue"
    | "onChange"
    | "color"
    | "type"
    | "children"
    | "autoFocus"
  >;

/**
 * Props for the PinInput component.
 */
export interface PinInputProps extends BasePinInputProps {
  /** The code, for a consumer that owns the value. */
  value?: string;

  /** The initial code, for a consumer that does not. */
  defaultValue?: string;

  /** Called with the whole code whenever it changes. */
  onValueChange?: (value: string) => void;

  /**
   * Called once when the code reaches its full length.
   * It fires once per completion, not on every keystroke, so a consumer can
   * submit from it.
   */
  onComplete?: (value: string) => void;

  /** Label of the field, shown above the boxes. */
  label?: string;

  /** Alignment of the label. @default "left" */
  labelAlign?: LabelAlign;

  /** Description under the label. */
  description?: string;

  /** Validation message under the boxes. */
  message?: string;

  /** Validation status, which colours the message. @default "default" */
  status?: FieldStatus;

  /** Whether the field is required. @default false */
  required?: boolean;

  /** Whether the label shows a pending state. @default false */
  isLoading?: boolean;

  /**
   * Accessible name of the group of boxes.
   * Used when the field has no visible label.
   *
   * @default "Verification code"
   */
  groupLabel?: string;

  /**
   * Draw a separator after this many boxes.
   * Purely presentational grouping, hidden from assistive technology.
   */
  separatorAfter?: number;
}

/**
 * A field that collects a code one character at a time.
 *
 * PinInput accepts a dense code string: the characters are always packed
 * left to right, so deleting a character in the middle moves the characters
 * after it left rather than leaving a gap. A consumer therefore never has to
 * reason about positions when it reads `value`.
 *
 * Typing a character moves focus to the next box, Backspace clears the box
 * behind the caret, the arrow keys move between boxes, Home and End jump to the
 * ends, and a pasted code fills the boxes from the caret. Because the value is
 * dense, a caret beyond the characters that are already filled pastes at the end
 * of them, which is where the next character would have gone. The code is
 * reported through `onValueChange` on every change and through `onComplete` when
 * it becomes complete, so a consumer can submit from either.
 *
 * The boxes are one named group element (a `fieldset`), because the value is one
 * value even though it is typed in several places. The component never focuses
 * itself: a consumer that moves the reader to the field (after sending a code,
 * for example) does so through the ref, which is the group element, so the
 * decision to move focus stays with the screen that knows why.
 *
 * @param props - PinInput configuration options and field props.
 * @param props.length - Number of characters. Defaults to 4.
 * @param props.mode - Accepted characters. Defaults to "numeric".
 * @param props.size - Density of the boxes. Defaults to "md".
 * @param props.masked - Hide the typed characters. Defaults to false.
 * @param props.value - Controlled value.
 * @param props.defaultValue - Initial value.
 * @param props.onValueChange - Called with the code on every change.
 * @param props.onComplete - Called when the code becomes complete.
 * @param props.label - Label of the field.
 * @param props.description - Description under the label.
 * @param props.message - Validation message under the boxes.
 * @param props.status - Validation status.
 * @param props.isDisabled - Disable the field. Defaults to false.
 * @param props.isInvalid - Mark the value invalid. Defaults to false.
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
 * @see Input - The single-value field.
 */

export const PinInput = forwardRef<HTMLFieldSetElement, PinInputProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      onComplete,
      length,
      mode,
      size,
      masked,
      radius,
      isDisabled,
      isInvalid,
      label,
      labelAlign,
      description,
      message,
      status,
      required,
      isLoading,
      groupLabel = "Verification code",
      separatorAfter,
      name,
      className,
      id,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.pininput;

    const resolved = resolveConfigCascade<
      PinInputConfig,
      Required<Omit<PinInputConfig, "radius">> & { radius: Radius }
    >(
      {
        length,
        mode,
        size,
        masked,
        isDisabled,
        isInvalid,
        radius: radius ?? undefined,
      },
      sectionConfig,
      FALLBACK_PIN_INPUT_CONFIG,
    );

    const resolvedRadiusKey = resolveRadiusKey<Radius>(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_PIN_INPUT_CONFIG.radius,
    );

    const resolvedRadius = resolveClassKey(
      resolvedRadiusKey,
      RADIUS_CLASS,
      FALLBACK_PIN_INPUT_CONFIG.radius,
    );

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const labelId = `${fieldId}-label`;
    const descriptionId = `${fieldId}-description`;
    const messageId = `${fieldId}-message`;

    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const focusBox = (index: number) => {
      const target = Math.max(0, Math.min(index, resolved.length - 1));
      inputRefs.current[target]?.focus();
    };

    const update = (nextValue: string) => {
      const capped = nextValue.slice(0, resolved.length);

      if (!isControlled) {
        setInternalValue(capped);
      }
      onValueChange?.(capped);

      if (capped.length === resolved.length) {
        onComplete?.(capped);
      }
    };

    const insertAt = (index: number, text: string) => {
      const cleaned = sanitizePinValue(text, resolved.mode);
      const next = (
        currentValue.slice(0, index) +
        cleaned +
        currentValue.slice(index + cleaned.length)
      ).slice(0, resolved.length);

      update(next);
      focusBox(index + cleaned.length);
    };

    const handleBoxChange = (index: number, raw: string) => {
      const cleaned = sanitizePinValue(raw, resolved.mode);

      if (cleaned.length === 0) {
        // The box was cleared by a native edit rather than by a key press.
        update(currentValue.slice(0, index) + currentValue.slice(index + 1));
        return;
      }

      if (cleaned.length > 1) {
        // A paste or an autofill delivered several characters into one box.
        insertAt(index, cleaned);
        return;
      }

      const next =
        index >= currentValue.length
          ? currentValue + cleaned
          : currentValue.slice(0, index) +
            cleaned +
            currentValue.slice(index + 1);

      update(next);
      focusBox(index + 1);
    };

    const handleKeyDown = (
      index: number,
      event: KeyboardEvent<HTMLInputElement>,
    ) => {
      switch (event.key) {
        case "Backspace": {
          event.preventDefault();
          if (index < currentValue.length) {
            update(
              currentValue.slice(0, index) + currentValue.slice(index + 1),
            );
          }
          focusBox(index - 1);
          return;
        }
        case "Delete": {
          event.preventDefault();
          if (index < currentValue.length) {
            update(
              currentValue.slice(0, index) + currentValue.slice(index + 1),
            );
          }
          return;
        }
        case "ArrowLeft": {
          event.preventDefault();
          focusBox(index - 1);
          return;
        }
        case "ArrowRight": {
          event.preventDefault();
          focusBox(index + 1);
          return;
        }
        case "Home": {
          event.preventDefault();
          focusBox(0);
          return;
        }
        case "End": {
          event.preventDefault();
          focusBox(resolved.length - 1);
          return;
        }
        default:
      }
    };

    const handlePaste = (
      index: number,
      event: ClipboardEvent<HTMLInputElement>,
    ) => {
      const pasted = event.clipboardData?.getData("text") ?? "";
      if (!pasted) return;

      event.preventDefault();
      insertAt(index, pasted);
    };

    const describedBy =
      [description ? descriptionId : null, message ? messageId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <FieldShell
        id={fieldId}
        htmlFor={null}
        labelId={labelId}
        label={label}
        labelAlign={labelAlign}
        description={description}
        descriptionId={descriptionId}
        message={message}
        messageId={messageId}
        status={status}
        required={required}
        isLoading={isLoading}>
        <fieldset
          ref={ref}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : groupLabel}
          aria-describedby={describedBy}
          data-disabled={resolved.isDisabled ? "true" : undefined}
          className={cn(PIN_INPUT_GROUP_CLASS, className)}>
          {Array.from({ length: resolved.length }, (_, index) => (
            <Fragment key={`pin-${index}`}>
              <input
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                id={index === 0 ? fieldId : `${fieldId}-${index}`}
                type={resolved.masked ? "password" : "text"}
                inputMode={resolved.mode === "numeric" ? "numeric" : "text"}
                pattern={resolved.mode === "numeric" ? "[0-9]*" : undefined}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                placeholder={placeholder}
                disabled={resolved.isDisabled}
                aria-label={`${groupLabel}, character ${index + 1} of ${
                  resolved.length
                }`}
                aria-invalid={resolved.isInvalid || undefined}
                value={currentValue[index] ?? ""}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => handlePaste(index, event)}
                onChange={(event) => handleBoxChange(index, event.target.value)}
                className={cn(
                  PIN_INPUT_BOX_CLASS,
                  PIN_INPUT_SIZE_CLASS[resolved.size],
                  resolvedRadius,
                  resolved.isDisabled
                    ? PIN_INPUT_BOX_DISABLED_CLASS
                    : resolved.isInvalid
                      ? PIN_INPUT_BOX_INVALID_CLASS
                      : PIN_INPUT_BOX_DEFAULT_CLASS,
                )}
                {...rest}
              />
              {separatorAfter !== undefined &&
                separatorAfter > 0 &&
                index + 1 === separatorAfter &&
                index + 1 < resolved.length && (
                  <span
                    aria-hidden="true"
                    className={PIN_INPUT_SEPARATOR_CLASS}>
                    -
                  </span>
                )}
            </Fragment>
          ))}
          {name && <input type="hidden" name={name} value={currentValue} />}
        </fieldset>
      </FieldShell>
    );
  },
);

PinInput.displayName = "PinInput";
