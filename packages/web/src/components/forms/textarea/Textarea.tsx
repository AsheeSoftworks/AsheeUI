/**
 * Textarea component for AsheeUI.
 * This file provides the main Textarea component implementation, which renders
 * a multi-line text input with label, description, validation message, and
 * virtual keyboard support. It integrates with the FieldShell for consistent
 * field layout and supports the standard AsheeUI cascade for visual tokens.
 */
"use client";

import {
  type Color,
  cn,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
  resolveVariantClass,
  type Variant,
} from "@asheeui/core";
import React, {
  forwardRef,
  type TextareaHTMLAttributes,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { RADIUS_CLASS } from "../../../styles/radius";
import {
  type KeyboardOpenOptions,
  useKeyboardField,
} from "../../system/keyboard";
import { FieldShell } from "../field/FieldShell";
import type { FieldSizeKey, LabelAlign } from "../field/field-config";
import {
  FALLBACK_TEXTAREA_CONFIG,
  type TextAreaConfig,
} from "./textarea-config";
import {
  TEXTAREA_SIZE_CLASS,
  TEXTAREA_STATUS_BORDER_CLASS,
} from "./textarea-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

type BaseTextareaProps = TextAreaConfig &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size" | "color" | "children"
  >;

/**
 * The width a field takes in the column it is placed in.
 *
 * A box is a control, so it fills its column by default; the consumer turns that off
 * with `fullWidth={false}`, which lets the field size to its content and sit inline
 * beside another one. Both strings are complete and static, so Tailwind can see them.
 */
const TEXTAREA_WIDTH_CLASS: Record<"full" | "inline", string> = {
  full: "w-full",
  inline: "inline-block w-auto",
};

/**
 * The width a field resolves to when no tier states one.
 *
 * The family's neutral fallback is `false`, but a box is a control and fills the
 * column it is placed in, so that is not the value this member bottoms out at. The
 * registered component default states the same value; stating it here as well keeps
 * the resolved width from depending on whether the bundler has evaluated the
 * configuration module yet, because a server render and a client hydration disagreeing
 * on this class would be a mismatch.
 */
const DEFAULT_FULL_WIDTH = true;

/**
 * Configuration options for the Textarea component.
 */
export interface TextareaProps extends BaseTextareaProps {
  /**
   * Label text for the textarea.
   * Displayed above the input field.
   */
  label?: string | undefined;

  /**
   * Whether the textarea is in a loading state.
   * Shows a loading spinner next to the label.
   *
   * @default false
   */
  isLoading?: boolean | undefined;

  /**
   * Description text shown below the label.
   * Provides additional context about the textarea.
   */
  description?: string | undefined;

  /**
   * Validation message shown below the textarea.
   * Color is determined by the status prop.
   */
  message?: string | undefined;

  /**
   * Whether the field is required.
   * Adds a required indicator (*) to the label.
   *
   * @default false
   */
  required?: boolean | undefined;

  /**
   * Whether the field stretches to fill its parent's width.
   *
   * A box is a control, so it fills the column it is placed in unless it is told not
   * to. Passing `false` sizes the field to its content and lets it sit inline, beside
   * another field.
   *
   * @default true
   */
  fullWidth?: boolean | undefined;

  /**
   * Whether the virtual keyboard should be enabled for mobile devices.
   * Controls the inputmode attribute.
   *
   * When enabled, the textarea will use the virtual keyboard system.
   * Can also be an object to configure the keyboard behavior.
   *
   * @default true
   */
  enableVirtualKeyboard?: boolean | KeyboardOpenOptions | undefined;
}

// ─── Component Implementation ─────────────────────────────────────────────────

/**
 * A multi-line text input with label, description, validation message,
 * and virtual keyboard support.
 *
 * Textarea renders a textarea with consistent styling and field layout.
 * It supports validation states, loading state, configurable rows, and
 * the standard AsheeUI cascade for visual tokens. The component integrates
 * with FieldShell for label, description, and message handling.
 *
 * The component automatically handles accessibility attributes including
 * aria-invalid, aria-describedby, and proper focus management. It also
 * supports mobile virtual keyboard control via the enableVirtualKeyboard prop.
 *
 * @param props - Textarea configuration options and native textarea props.
 * @param props.label - Label text for the textarea.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.description - Description text.
 * @param props.message - Validation message.
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.fullWidth - Whether the field fills its parent's width. Defaults to
 * true; pass false to let it size to its content and sit inline.
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
 * import { Textarea } from "@asheeui/web";
 * import { useState } from "react";
 *
 * export function Example() {
 *   const [value, setValue] = useState("");
 *
 *   return (
 *     <Textarea
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
 * <Textarea
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
 * <Textarea
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
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      fullWidth,
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

    // A radius is the consumer's decision, so the box rounds exactly as the
    // text field beside it does: `full` is a pill in both, not a value one field
    // silently rewrites.
    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_TEXTAREA_CONFIG.radius,
    );

    const resolvedStatus = status ?? FALLBACK_TEXTAREA_CONFIG.status;

    const resolvedFullWidth = resolveCascade<boolean>(
      fullWidth,
      sectionConfig?.fullWidth,
      undefined,
      DEFAULT_FULL_WIDTH,
    );

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
      // The width belongs to the field rather than to the box, so a field that is
      // not full width takes its label and its message with it.
      <div
        className={cn(
          TEXTAREA_WIDTH_CLASS[resolvedFullWidth ? "full" : "inline"],
          "min-w-0",
        )}>
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
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
