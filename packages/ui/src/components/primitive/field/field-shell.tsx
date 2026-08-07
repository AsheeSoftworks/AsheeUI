import { cn } from "@ashee/utils";
import type { ReactNode } from "react";
import type { FieldStatus, LabelAlign } from "./field-config";

const LABEL_ALIGN_CLASS: Record<LabelAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const STATUS_TEXT_CLASS: Record<FieldStatus, string> = {
  default: "text-foreground",
  error: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

export interface FieldShellProps {
  id: string;
  label?: string;
  labelAlign?: LabelAlign;
  description?: string;
  message?: string;
  status?: FieldStatus;
  required?: boolean;
  labelClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
  children: ReactNode;
}

export function FieldShell({
  id,
  label,
  labelAlign = "left",
  description,
  message,
  status = "default",
  required,
  labelClassName,
  descriptionClassName,
  messageClassName,
  children,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-foreground",
            LABEL_ALIGN_CLASS[labelAlign],
            labelClassName,
          )}>
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      {description && (
        <p className={cn("text-sm text-foreground/60", descriptionClassName)}>
          {description}
        </p>
      )}
      {children}
      {message && (
        <p
          className={cn(
            "text-sm",
            STATUS_TEXT_CLASS[status],
            messageClassName,
          )}>
          {message}
        </p>
      )}
    </div>
  );
}
