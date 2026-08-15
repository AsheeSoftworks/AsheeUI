"use client";

import { cn } from "@ashee/utils";
import { forwardRef, type ReactNode, useId } from "react";
import type { Color } from "../../../shared/variant";
import { FieldShell } from "../field/FieldShell";
import type {
  FieldSizeKey,
  FieldStatus,
  LabelAlign,
} from "../field/field-config";
import type { RadioVariant } from "./radio-config";
import { RadioContext } from "./radio-context";

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
      status = "default",
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
    const generatedId = useId();
    const groupName = name ?? generatedId;

    return (
      <FieldShell
        id={generatedId}
        label={label}
        labelAlign={labelAlign}
        description={description}
        message={message}
        status={status}
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
            status,
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
