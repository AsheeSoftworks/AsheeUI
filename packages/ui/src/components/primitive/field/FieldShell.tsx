import { cn } from "@asheeui/utils";
import type { ReactNode } from "react";
import { Spinner } from "../spinner/spinner";
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
  descriptionId?: string;
  message?: string;
  messageId?: string;
  status?: FieldStatus;
  required?: boolean;
  isLoading?: boolean; // new
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
  descriptionId,
  message,
  messageId,
  status = "default",
  required,
  isLoading,
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
          <span className="inline-flex items-center gap-1.5">
            {label}
            {required && (
              <span aria-hidden="true" className="text-danger">
                *
              </span>
            )}
            {isLoading && <Spinner size="sm" />}
          </span>
        </label>
      )}
      {description && (
        <p
          id={descriptionId}
          className={cn("text-sm text-foreground/60", descriptionClassName)}>
          {description}
        </p>
      )}
      {children}
      {message && (
        <p
          id={messageId}
          role={status === "error" ? "alert" : undefined}
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
