/**
 * Field shell component for AsheeUI.
 * This file provides the FieldShell component, which wraps form fields
 * with consistent label, description, status message, and loading state
 * handling. It is used internally by field components to provide a
 * uniform experience across the library.
 */

import type { ReactNode } from "react";
import { cn } from "../../utils";
import { Spinner } from "../spinner/spinner";
import type { FieldStatus, LabelAlign } from "./field-config";

/**
 * CSS classes for label alignment.
 * Internal mapping used by the FieldShell component.
 */
const LABEL_ALIGN_CLASS: Record<LabelAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * CSS classes for status message text colors.
 * Internal mapping used by the FieldShell component.
 */
const STATUS_TEXT_CLASS: Record<FieldStatus, string> = {
  default: "text-foreground",
  error: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

/**
 * Props for the FieldShell component.
 * Provides a consistent wrapper for form field components.
 */
export interface FieldShellProps {
  /**
   * The ID of the field.
   * Used to associate the label with the input via htmlFor.
   */
  id: string;

  /**
   * The label text for the field.
   */
  label?: string;

  /**
   * Alignment of the label relative to the field.
   * @default "left"
   */
  labelAlign?: LabelAlign;

  /**
   * Description text shown below the label.
   */
  description?: string;

  /**
   * Optional ID for the description element.
   * Used for accessibility to associate with the field.
   */
  descriptionId?: string;

  /**
   * Validation message shown below the field.
   */
  message?: string;

  /**
   * Optional ID for the message element.
   * Used for accessibility to associate with the field.
   */
  messageId?: string;

  /**
   * Validation status of the field.
   * Controls the color of the message text.
   * @default "default"
   */
  status?: FieldStatus;

  /**
   * Whether the field is required.
   * Adds a required indicator (*) to the label.
   * @default false
   */
  required?: boolean;

  /**
   * Whether the field is in a loading state.
   * Shows a loading spinner next to the label.
   * @default false
   */
  isLoading?: boolean;

  /**
   * The field content to render.
   * Typically an input, select, or other form control.
   */
  children: ReactNode;
}

/**
 * A wrapper component for form fields that provides consistent
 * label, description, status message, and loading state handling.
 *
 * FieldShell is used internally by AsheeUI form components to ensure
 * a uniform layout and behavior across the library. It automatically
 * handles accessibility associations between labels, descriptions,
 * status messages, and the field element.
 *
 * @param props - FieldShell configuration options.
 * @param props.id - The ID of the field.
 * @param props.label - The label text for the field.
 * @param props.labelAlign - Alignment of the label. Defaults to "left".
 * @param props.description - Description text shown below the label.
 * @param props.descriptionId - Optional ID for the description element.
 * @param props.message - Validation message shown below the field.
 * @param props.messageId - Optional ID for the message element.
 * @param props.status - Validation status. Defaults to "default".
 * @param props.required - Whether the field is required. Defaults to false.
 * @param props.isLoading - Whether the field is in a loading state. Defaults to false.
 * @param props.children - The field content to render.
 *
 * @example
 * ```tsx
 * <FieldShell
 *   id="email"
 *   label="Email Address"
 *   description="We'll never share your email."
 *   message="Please enter a valid email"
 *   status="error"
 *   required
 * >
 *   <input id="email" type="email" />
 * </FieldShell>
 * ```
 *
 * @see FieldConfig - The configuration type for field components.
 */
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
        <p id={descriptionId} className={cn("text-sm text-foreground/60")}>
          {description}
        </p>
      )}
      {children}
      {message && (
        <p
          id={messageId}
          role={status === "error" ? "alert" : undefined}
          className={cn("text-sm", STATUS_TEXT_CLASS[status])}>
          {message}
        </p>
      )}
    </div>
  );
}
