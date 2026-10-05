/**
 * Input component for AsheeUI.
 * This file provides the main Input component implementation, which renders
 * a form input field with label, description, validation message, and
 * content slot support. It integrates with the FieldShell for consistent
 * field layout and supports the standard AsheeUI cascade for visual tokens.
 */
"use client";

import {
  type Color,
  cn,
  FIELD_STATUS_BORDER_CLASS,
  INPUT_SIZE_CLASS,
  isFieldInvalid,
  RADIUS_CLASS,
  resolveCascade,
  resolveClassKey,
  resolveFieldStatusColor,
  resolveRadiusKey,
  resolveVariantClass,
  type Variant,
} from "@asheeui/core";
import React, {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldSizeKey,
  type LabelAlign,
} from "../field/field-config";
import { type KeyboardOpenOptions, useKeyboardField } from "../keyboard";
import type { InputConfig } from "./input-config";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseInputProps = InputConfig &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "children">;

/**
 * Configuration options for the Input component.
 */
export interface InputProps extends BaseInputProps {
  /**
   * Label text for the input.
   * Displayed above the input field.
   */
  label?: string;

  /**
   * Whether the input is in a loading state.
   * Shows a loading spinner next to the label.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Description text shown below the label.
   * Provides additional context about the input.
   */
  description?: string;

  /**
   * Validation message shown below the input.
   * Color is determined by the status prop.
   */
  message?: string;

  /**
   * Whether the field is required.
   * Adds a required indicator (*) to the label.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Called with the field's next value whenever it changes.
   *
   * This is the name the framework's field contract gives the change handler, so a
   * handler written against `InputContract` is portable: the same function works
   * whether the field it is passed to renders on the web or on native.
   *
   * The DOM's own `onChange` still receives the event, so a web consumer keeps the
   * choice between the two; passing both calls both.
   */
  onChangeText?: (value: string) => void;

  /**
   * Content rendered at the start of the input.
   * Typically an icon or adornment.
   */
  startContent?: ReactNode;

  /**
   * Content rendered at the end of the input.
   * Typically an icon, button, or adornment.
   */
  endContent?: ReactNode;

  /**
   * Whether the virtual keyboard should be enabled for mobile devices.
   * Controls the inputmode attribute.
   *
   * When enabled, the input will use the virtual keyboard system.
   * Can also be an object to configure the keyboard behavior.
   *
   * @default true
   */
  enableVirtualKeyboard?: boolean | KeyboardOpenOptions;
}

/**
 * A form input field with label, description, validation message,
 * and content slot support.
 *
 * Input renders a text input with consistent styling and field layout.
 * It supports start and end content slots for icons and adornments,
 * validation states, loading state, and the standard AsheeUI cascade
 * for visual tokens. The component integrates with FieldShell for
 * label, description, and message handling.
 *
 * The component automatically handles accessibility attributes including
 * aria-invalid, aria-describedby, and proper focus management. It also
 * supports mobile virtual keyboard control via the enableVirtualKeyboard
 * prop.
 *
 * @param props - Input configuration options and native input props.
 * @param props.label - Label text for the input.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.onChangeText - Called with the field's next value on change.
 * @param props.startContent - Content at the start of the input.
 * @param props.endContent - Content at the end of the input.
 * @param props.enableVirtualKeyboard - Enable mobile virtual keyboard. Defaults to true.
 * @param props.size - Size of the input. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.status - Validation status.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.disabled - Whether the input is disabled.
 * @param props.className - Extra CSS classes for the input.
 * @param props.id - Optional ID for the field.
 * @param props.style - Inline styles for the input.
 *
 * @example
 * ```tsx
 * import { Input } from "@asheeui/web";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [value, setValue] = useState("");
 *
 *   return (
 *     <Input
 *       label="Email Address"
 *       description="We'll never share your email."
 *       placeholder="you@example.com"
 *       value={value}
 *       onChange={(e) => setValue(e.target.value)}
 *       startContent={<MailIcon />}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With virtual keyboard configuration
 * <Input
 *   label="Numeric Input"
 *   enableVirtualKeyboard={{
 *     layout: "numeric",
 *     size: "lg",
 *     color: "primary"
 *   }}
 * />
 * ```
 *
 * @see InputConfig - The configuration type for component defaults.
 * @see FieldShell - The wrapper component for label and validation.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 * @see useKeyboardField - Hook for connecting inputs to the virtual keyboard.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      radius,
      variant,
      color,
      status,
      label,
      labelAlign,
      description,
      message,
      required,
      isLoading,
      id,
      className,
      disabled,
      startContent,
      endContent,
      style,
      onFocus,
      onBlur,
      onChange,
      onChangeText,
      enableVirtualKeyboard = true,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.input as InputConfig | undefined;

    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const messageId = message ? `${fieldId}-message` : undefined;
    const describedBy =
      [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

    // Determine if keyboard is enabled and get options
    const isKeyboardEnabled = Boolean(enableVirtualKeyboard);
    const keyboardOptions =
      typeof enableVirtualKeyboard === "object" &&
      enableVirtualKeyboard !== null
        ? enableVirtualKeyboard
        : undefined;

    const { handleFocus: handleKeyboardFocus, handleBlur: handleKeyboardBlur } =
      useKeyboardField(
        fieldId,
        internalRef,
        isKeyboardEnabled,
        keyboardOptions,
      );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        handleKeyboardFocus(e);
        onFocus?.(e);
      },
      [handleKeyboardFocus, onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        handleKeyboardBlur();
        onBlur?.(e);
      },
      [handleKeyboardBlur, onBlur],
    );

    /**
     * Report a change through both names.
     *
     * The contract's name carries the value and the DOM's carries the event, and a
     * handler may be written against either, so neither is dropped: a consumer porting
     * a form between platforms changes nothing, and a web consumer that needs the
     * event keeps it.
     */
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        onChangeText?.(e.target.value);
      },
      [onChange, onChangeText],
    );

    // ─── Token Resolvers ──────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_FIELD_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_FIELD_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_FIELD_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string"
        ? sectionConfig.radius
        : undefined,
      config.defaultRadius,
      FALLBACK_FIELD_CONFIG.radius,
    );

    const resolvedStatus = status ?? FALLBACK_FIELD_CONFIG.status;

    // A status outranks the configured accent, and that rule is the family's rather
    // than this component's, so the field resolves it the way every other field does.
    const resolvedStatusColor = resolveFieldStatusColor(
      resolvedStatus,
      resolvedColorKey,
    );

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_FIELD_CONFIG.labelAlign,
    );

    const variantClass = resolveVariantClass(
      resolvedVariantKey,
      resolvedStatusColor,
    );
    const statusClass = FIELD_STATUS_BORDER_CLASS[resolvedStatus];
    const radiusClass =
      resolvedVariantKey === "underlined"
        ? "rounded-none"
        : resolveClassKey(
            resolvedRadiusKey,
            RADIUS_CLASS,
            FALLBACK_FIELD_CONFIG.radius,
          );

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        descriptionId={descriptionId}
        message={message}
        messageId={messageId}
        status={resolvedStatus}
        required={required}
        isLoading={isLoading}>
        <div className="relative flex items-center w-full">
          {startContent && (
            <span className="absolute left-3 z-10 flex items-center pointer-events-none text-foreground/50">
              {startContent}
            </span>
          )}
          <input
            ref={internalRef}
            id={fieldId}
            disabled={disabled}
            required={required}
            autoComplete="off"
            aria-invalid={isFieldInvalid(resolvedStatus)}
            aria-describedby={describedBy}
            aria-busy={isLoading}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              "w-full text-foreground outline-none transition-colors shrink-0",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              INPUT_SIZE_CLASS[resolvedSizeKey],
              variantClass,
              statusClass,
              radiusClass,
              startContent && "pl-11",
              endContent && "pr-11",
              className,
            )}
            style={style}
            {...rest}
          />
          {endContent && (
            <span
              className={cn(
                "absolute right-3 z-10 flex items-center",
                typeof endContent === "string" ||
                  (React.isValidElement(endContent) &&
                    endContent.type === "span")
                  ? "pointer-events-none"
                  : "",
                "text-foreground/50",
              )}>
              {endContent}
            </span>
          )}
        </div>
      </FieldShell>
    );
  },
);

Input.displayName = "Input";
