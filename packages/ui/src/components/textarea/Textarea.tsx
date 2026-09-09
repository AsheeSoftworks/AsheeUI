/**
 * TextArea component for AsheeUI.
 * This file provides the main TextArea component implementation, which renders
 * a multi-line text input with label, description, validation message, and
 * virtual keyboard support. It integrates with the FieldShell for consistent
 * field layout and supports the standard AsheeUI cascade for visual tokens.
 */
"use client";

import React, {
  forwardRef,
  type TextareaHTMLAttributes,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import {
  type Color,
  RADIUS_CLASS,
  type Radius,
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
import type { FieldSizeKey, LabelAlign } from "../field/field-config";
import { type KeyboardOpenOptions, useKeyboardField } from "../keyboard";
import {
  FALLBACK_TEXTAREA_CONFIG,
  type TextAreaConfig,
} from "./textarea-config";
import {
  TEXTAREA_SIZE_CLASS,
  TEXTAREA_STATUS_BORDER_CLASS,
} from "./textarea-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseTextAreaProps = TextAreaConfig &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size" | "color" | "children"
  >;

/**
 * Configuration options for the TextArea component.
 */
export interface TextAreaProps extends BaseTextAreaProps {
  /**
   * Label text for the textarea.
   * Displayed above the input field.
   */
  label?: string;

  /**
   * Whether the textarea is in a loading state.
   * Shows a loading spinner next to the label.
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * Description text shown below the label.
   * Provides additional context about the textarea.
   */
  description?: string;

  /**
   * Validation message shown below the textarea.
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
   * Whether the virtual keyboard should be enabled for mobile devices.
   * Controls the inputmode attribute.
   *
   * When enabled, the textarea will use the virtual keyboard system.
   * Can also be an object to configure the keyboard behavior.
   *
   * @default true
   */
  enableVirtualKeyboard?: boolean | KeyboardOpenOptions;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A multi-line text input with label, description, validation message,
 * and virtual keyboard support.
 *
 * TextArea renders a textarea with consistent styling and field layout.
 * It supports validation states, loading state, configurable rows, and
 * the standard AsheeUI cascade for visual tokens. The component integrates
 * with FieldShell for label, description, and message handling.
 *
 * The component automatically handles accessibility attributes including
 * aria-invalid, aria-describedby, and proper focus management. It also
 * supports mobile virtual keyboard control via the enableVirtualKeyboard prop.
 *
 * @param props - TextArea configuration options and native textarea props.
 * @param props.label - Label text for the textarea.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.enableVirtualKeyboard - Enable mobile virtual keyboard. Defaults to true.
 * @param props.rows - Number of visible text rows. Defaults to 4.
 * @param props.size - Size of the textarea. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.status - Validation status.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.disabled - Whether the textarea is disabled.
 * @param props.className - Extra CSS classes for the textarea.
 * @param props.id - Optional ID for the field.
 * @param props.style - Inline styles for the textarea.
 *
 * @example
 * ```tsx
 * import { TextArea } from "asheeui";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [value, setValue] = useState("");
 *
 *   return (
 *     <TextArea
 *       label="Message"
 *       description="Write your message here"
 *       placeholder="Type your message..."
 *       value={value}
 *       onChange={(e) => setValue(e.target.value)}
 *       rows={6}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With validation state
 * <TextArea
 *   label="Feedback"
 *   status="error"
 *   message="Feedback must be at least 10 characters"
 *   required
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With virtual keyboard configuration
 * <TextArea
 *   label="Numeric Input"
 *   enableVirtualKeyboard={{
 *     layout: "numeric",
 *     size: "lg",
 *     color: "primary"
 *   }}
 * />
 * ```
 *
 * @see TextAreaConfig - The configuration type for component defaults.
 * @see FieldShell - The wrapper component for label and validation.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 * @see useKeyboardField - Hook for connecting inputs to the virtual keyboard.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      rows,
      id,
      className,
      disabled,
      style,
      onFocus,
      onBlur,
      enableVirtualKeyboard = true,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.textarea as
      | TextAreaConfig
      | undefined;

    const internalRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

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
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        handleKeyboardFocus(e);
        onFocus?.(e);
      },
      [handleKeyboardFocus, onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        handleKeyboardBlur();
        onBlur?.(e);
      },
      [handleKeyboardBlur, onBlur],
    );

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<FieldSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_TEXTAREA_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_TEXTAREA_CONFIG.variant,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_TEXTAREA_CONFIG.color,
    );

    // ─── NEW: Filter out 'full' radius ──────────────────────────────────────
    const filterRadius = (
      radiusValue: Radius | undefined,
    ): Radius | undefined => {
      if (radiusValue === "full") return "xl";
      return radiusValue;
    };

    const resolvedRadiusKey = resolveRadiusKey(
      filterRadius(radius),
      filterRadius(sectionConfig?.radius),
      config.defaultRadius,
      FALLBACK_TEXTAREA_CONFIG.radius,
    );

    const resolvedStatus = status ?? FALLBACK_TEXTAREA_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_TEXTAREA_CONFIG.labelAlign,
    );

    const resolvedRows = resolveCascade<number>(
      rows,
      sectionConfig?.rows,
      undefined,
      FALLBACK_TEXTAREA_CONFIG.rows,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const variantClass = resolveVariantClass(
      resolvedVariantKey,
      resolvedColorKey,
    );
    const statusClass =
      resolvedStatus !== "default"
        ? TEXTAREA_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
    const radiusClass =
      resolvedVariantKey === "underlined"
        ? "rounded-none"
        : resolveClassKey(
            resolvedRadiusKey,
            RADIUS_CLASS,
            FALLBACK_TEXTAREA_CONFIG.radius,
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
        <textarea
          ref={internalRef}
          id={fieldId}
          disabled={disabled}
          required={required}
          rows={resolvedRows}
          aria-busy={isLoading}
          aria-invalid={resolvedStatus === "error"}
          aria-describedby={describedBy}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "resize-y w-full text-foreground outline-none transition-colors shrink-0",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            TEXTAREA_SIZE_CLASS[resolvedSizeKey],
            variantClass,
            statusClass,
            radiusClass,
            className,
          )}
          style={style}
          {...rest}
        />
      </FieldShell>
    );
  },
);

TextArea.displayName = "TextArea";
