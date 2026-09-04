"use client";

import { cn } from "@asheeui/utils";
import React, {
  forwardRef,
  type TextareaHTMLAttributes,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import {
  type Color,
  resolveVariantClass,
  type Variant,
} from "../../shared/variant";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import { useKeyboardField } from "../keyboard";
import {
  FALLBACK_TEXTAREA_CONFIG,
  type TextAreaConfig,
} from "./textarea-config";
import {
  TEXTAREA_SIZE_CLASS,
  TEXTAREA_STATUS_BORDER_CLASS,
} from "./textarea-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface TextAreaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size" | "color" | "children"
  > {
  size?: FieldSizeKey;
  radius?: Radius;
  variant?: Variant;
  color?: Color;
  status?: FieldStatus;
  label?: string;
  isLoading?: boolean;
  labelAlign?: LabelAlign;
  description?: string;
  message?: string;
  required?: boolean;
  rows?: number;
  enableVirtualKeyboard?: boolean;
}

// ─── Component Implementation ─────────────────────────────────────────────────

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

    const { handleFocus: handleKeyboardFocus, handleBlur: handleKeyboardBlur } =
      useKeyboardField(fieldId, internalRef, enableVirtualKeyboard);

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

    const resolvedVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_TEXTAREA_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_TEXTAREA_CONFIG.color,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
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

    const variantClass = resolveVariantClass(resolvedVariant, resolvedColor);
    const statusClass =
      resolvedStatus !== "default"
        ? TEXTAREA_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
    const radiusClass =
      resolvedVariant === "underlined"
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
