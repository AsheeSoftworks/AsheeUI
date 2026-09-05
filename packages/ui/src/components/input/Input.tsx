"use client";

import { cn } from "@asheeui/utils";
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
import {
  FALLBACK_FIELD_CONFIG,
  type FieldSizeKey,
  type FieldStatus,
  type LabelAlign,
} from "../field/field-config";
import { useKeyboardField } from "../keyboard";
import type { InputConfig } from "./input-config";
import { INPUT_SIZE_CLASS, INPUT_STATUS_BORDER_CLASS } from "./input-styles";

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "children"
  > {
  size?: FieldSizeKey;
  radius?: Radius;
  variant?: Variant;
  color?: Color;
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  isLoading?: boolean;
  description?: string;
  message?: string;
  required?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  enableVirtualKeyboard?: boolean;
}

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

    const resolvedVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_FIELD_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
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
            : resolvedColor;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_FIELD_CONFIG.labelAlign,
    );

    const variantClass = resolveVariantClass(
      resolvedVariant,
      resolvedStatusColor,
    );
    const statusClass =
      resolvedStatus !== "default"
        ? INPUT_STATUS_BORDER_CLASS[resolvedStatus]
        : "";
    const radiusClass =
      resolvedVariant === "underlined"
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
