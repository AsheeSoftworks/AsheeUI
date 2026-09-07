"use client";

import { forwardRef, type ReactNode, useId } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color } from "../../shared/variant";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import {
  FALLBACK_RADIO_CONFIG,
  type RadioConfig,
  type RadioVariant,
} from "./radio-config";
import { RadioContext } from "./radio-context";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface RadioGroupProps {
  children: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: FieldSizeKey;
  color?: Color;
  variant?: RadioVariant;
  orientation?: "horizontal" | "vertical";
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  description?: string;
  message?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      children,
      name,
      value,
      onChange,
      size,
      color,
      variant,
      orientation = "vertical",
      status,
      label,
      labelAlign,
      description,
      message,
      required,
      disabled,
      className,
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.radio as RadioConfig | undefined;

    const generatedId = useId();
    const groupName = name ?? generatedId;

    const resolvedStatus = status ?? FALLBACK_RADIO_CONFIG.status;

    const resolvedLabelAlign = resolveCascade<LabelAlign>(
      labelAlign,
      sectionConfig?.labelAlign,
      undefined,
      FALLBACK_RADIO_CONFIG.labelAlign,
    );

    return (
      <FieldShell
        id={generatedId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}>
        <RadioContext.Provider
          value={{
            name: groupName,
            value,
            onChange,
            size,
            color,
            variant,
            disabled,
            status: resolvedStatus,
          }}>
          <div
            ref={ref}
            role="radiogroup"
            className={cn(
              "flex",
              orientation === "vertical"
                ? "flex-col gap-2"
                : "flex-row flex-wrap gap-4",
              className,
            )}>
            {children}
          </div>
        </RadioContext.Provider>
      </FieldShell>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
