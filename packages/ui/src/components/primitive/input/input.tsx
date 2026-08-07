import type { Radius } from "@ashee/config";
import { type AnimationProp, resolveAnimation } from "@ashee/motion";
import { useSettings } from "@ashee/settings";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useId } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import type { FieldSize, FieldStatus, LabelAlign } from "../field/field-config";
import { FieldShell } from "../field/field-shell";
import type { InputConfig } from "./input-config";

const SIZE_CLASS: Record<FieldSize, string> = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-3 py-2 text-md",
  lg: "px-4 py-2.5 text-lg",
};

const STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "border-border focus:border-primary",
  error: "border-danger focus:border-danger",
  warning: "border-warning focus:border-warning",
  success: "border-success focus:border-success",
};

export interface InputProps
  extends Omit<HTMLMotionProps<"input">, "size" | "children"> {
  size?: FieldSize;
  radius?: keyof Radius;
  animation?: AnimationProp;
  status?: FieldStatus;
  label?: string;
  labelAlign?: LabelAlign;
  description?: string;
  message?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      radius,
      animation,
      status,
      label,
      labelAlign,
      description,
      message,
      required,
      id,
      className,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.input as InputConfig | undefined;
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    const resolvedSize = resolveValue(
      size,
      sectionConfig?.size,
      "md",
    ) as FieldSize;
    const resolvedRadius = resolveScale(
      radius,
      sectionConfig?.radius,
      config.theme.radius.default,
      config.theme.radius.values,
    );
    const resolvedStatus = status ?? "default";
    const resolvedLabelAlign = resolveValue(
      labelAlign,
      sectionConfig?.labelAlign,
      "left",
    ) as LabelAlign;
    const motionProps = resolveAnimation(
      animation ?? sectionConfig?.animation,
      settings.enableAnimations,
    );

    return (
      <FieldShell
        id={fieldId}
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={required}
        labelClassName={sectionConfig?.labelClassName}
        descriptionClassName={sectionConfig?.descriptionClassName}
        messageClassName={sectionConfig?.messageClassName}>
        <motion.input
          ref={ref}
          id={fieldId}
          autoComplete="off"
          className={cn(
            "border bg-background text-foreground outline-none transition-colors",
            STATUS_BORDER_CLASS[resolvedStatus],
            SIZE_CLASS[resolvedSize],
            sectionConfig?.className,
            className,
          )}
          style={{ borderRadius: resolvedRadius }}
          {...motionProps}
          {...rest}
        />
      </FieldShell>
    );
  },
);
Input.displayName = "Input";
