"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
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
import type { InputConfig } from "./input-config";
import { INPUT_SIZE_CLASS, INPUT_STATUS_BORDER_CLASS } from "./input-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

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
}

// ─── Component Implementation ─────────────────────────────────────────────────

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
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.input as InputConfig | undefined;

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

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_FIELD_CONFIG.labelAlign,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const variantClass = resolveVariantClass(resolvedVariant, resolvedColor);
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
        isLoading={isLoading}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
        <div className="relative flex items-center w-full">
          {startContent && (
            <span className="absolute left-3 z-10 flex items-center pointer-events-none text-foreground/50">
              {startContent}
            </span>
          )}

          <input
            ref={ref}
            id={fieldId}
            disabled={disabled}
            required={required}
            autoComplete="off"
            aria-invalid={resolvedStatus === "error"}
            aria-describedby={describedBy}
            aria-busy={isLoading}
            className={cn(
              "w-full text-foreground outline-none transition-colors shrink-0",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              INPUT_SIZE_CLASS[resolvedSizeKey],
              variantClass,
              statusClass,
              radiusClass,
              startContent && "pl-9",
              endContent && "pr-9",
              sectionConfig?.className,
              className,
            )}
            style={style}
            {...rest}
          />

          {endContent && (
            <span className="absolute right-3 z-10 flex items-center pointer-events-none text-foreground/50">
              {endContent}
            </span>
          )}
        </div>
      </FieldShell>
    );
  },
);

Input.displayName = "Input";
