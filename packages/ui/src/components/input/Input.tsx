/**
 * Input component for AsheeUI.
 * This file provides the main Input component implementation, which renders
 * a form input field with label, description, validation message, and
 * content slot support. It integrates with the FieldShell for consistent
 * field layout and supports the standard AsheeUI cascade for visual tokens.
 */
"use client";

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
import {
  type Color,
  RADIUS_CLASS,
  resolveVariantClass,
  type Variant,
} from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldSizeKey,
  type LabelAlign,
} from "../field/field-config";
import { useKeyboardField } from "../keyboard";
import type { InputConfig } from "./input-config";
import { INPUT_SIZE_CLASS, INPUT_STATUS_BORDER_CLASS } from "./input-styles";

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
   * @default true
   */
  enableVirtualKeyboard?: boolean;
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
 * import { Input } from "asheeui";
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
 * // With validation state
 * <Input
 *   label="Password"
 *   type="password"
 *   status="error"
 *   message="Password must be at least 8 characters"
 *   required
 * />
 * ```
 *
 * @see InputConfig - The configuration type for component defaults.
 * @see FieldShell - The wrapper component for label and validation.
 * @see useAsheeConfig - Hook for accessing the global configuration.
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

    const { handleFocus: handleKeyboardFocus, handleBlur: handleKeyboardBlur } =
      useKeyboardField(fieldId, internalRef, enableVirtualKeyboard);

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

    const resolvedStatusColor: Color =
      resolvedStatus === "error"
        ? "danger"
        : resolvedStatus === "success"
          ? "success"
          : resolvedStatus === "warning"
            ? "warning"
            : resolvedColorKey;

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
    const statusClass =
      resolvedStatus !== "default"
        ? INPUT_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
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
            aria-invalid={resolvedStatus === "error"}
            aria-describedby={describedBy}
            aria-busy={isLoading}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
