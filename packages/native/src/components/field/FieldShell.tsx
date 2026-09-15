/**
 * Field shell helper for the native package.
 *
 * The field shell is the one implementation of the label, description and message
 * block every field component shows, so a text field, a code field and a picker
 * present their field the same way. It is an internal helper: it is not exported
 * from the package entry point and is not part of the public component inventory.
 */

import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "../text/Text";

/**
 * Validation status of a native field.
 */
export type NativeFieldStatus = "default" | "error" | "warning" | "success";

/**
 * Props for the internal native field shell.
 */
export interface FieldShellProps {
  /** The field's label, which names the control. */
  label?: string;

  /** Description shown under the label. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /** Validation status, which selects the message's tone. */
  status?: NativeFieldStatus;

  /** Whether the field is required, which adds the visible marker. */
  required?: boolean;

  /** The control the shell describes. */
  children: ReactNode;
}

/**
 * The label, description and message block a field shows.
 *
 * The shell is presentational: it draws the text around the control and reports
 * the message as a live region when the field failed, and it leaves the
 * accessibility name and hint to the control, which is where the platform
 * expects them.
 *
 * @param props - The field's text and the control.
 * @returns The rendered field.
 *
 * @see Input - The text field that uses it.
 */
export function FieldShell({
  label,
  description,
  message,
  status = "default",
  required = false,
  children,
}: FieldShellProps) {
  return (
    <View className="flex-col gap-1.5">
      {label && (
        <View className="flex-row items-center gap-1">
          <Text role="label">{label}</Text>
          {required && (
            <Text role="label" className="text-danger" accessible={false}>
              *
            </Text>
          )}
        </View>
      )}
      {description && (
        <Text role="body-sm" tone="muted">
          {description}
        </Text>
      )}
      {children}
      {message && (
        <Text
          role="body-sm"
          className={MESSAGE_TONE_CLASS[status]}
          // A failed field announces its message when it appears; the others
          // are part of the form's own text.
          accessibilityLiveRegion={status === "error" ? "polite" : "none"}>
          {message}
        </Text>
      )}
    </View>
  );
}

/**
 * The message's colour for each validation status.
 */
const MESSAGE_TONE_CLASS: Record<NativeFieldStatus, string> = {
  default: "text-foreground",
  error: "text-danger",
  warning: "text-warning",
  success: "text-success",
};
