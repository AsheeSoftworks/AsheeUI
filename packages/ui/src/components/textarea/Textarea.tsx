"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type TextareaHTMLAttributes, useId } from "react";
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
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.textarea as
      | TextAreaConfig
      | undefined;

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const messageId = message ? `${fieldId}-message` : undefined;
    const describedBy =
      [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

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
        isLoading={isLoading}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
        <TextArea
          ref={ref}
          id={fieldId}
          disabled={disabled}
          required={required}
          rows={resolvedRows}
          aria-busy={isLoading}
          aria-invalid={resolvedStatus === "error"}
          aria-describedby={describedBy}
          className={cn(
            "resize-y w-full text-foreground outline-none transition-colors shrink-0",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            TEXTAREA_SIZE_CLASS[resolvedSizeKey],
            variantClass,
            statusClass,
            radiusClass,
            sectionConfig?.className,
            className,
          )}
          style={style}
        />
      </FieldShell>
    );
  },
);

TextArea.displayName = "TextArea";
