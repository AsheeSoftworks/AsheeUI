/**
 * Field shell helper for the native package.
 *
 * The field shell is the one implementation of the label, description and message
 * block every field component shows, so a text field, a code field and a picker
 * present their field the same way. It is an internal helper: it is not exported
 * from the package entry point and is not part of the public component inventory.
 *
 * The block it draws is the family's: the stack, the label row, the marker and the tone
 * a status gives the message all come from the shared field dictionary, so a native
 * field's label block is the same block a web field shows. What stays here is what only
 * native has — the accessibility properties the platform reads a field's name and its
 * announcement from.
 */

import {
  FALLBACK_FIELD_CONFIG,
  FIELD_REQUIRED_MARKER_CLASS,
  FIELD_STATUS_TEXT_CLASS,
  type FieldStatus,
  isFieldInvalid,
  NATIVE_FIELD_LABEL_ROW_CLASS,
  NATIVE_FIELD_SHELL_CLASS,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { View } from "react-native";
import { Spinner } from "../spinner/Spinner";
import { Text } from "../text/Text";

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
  status?: FieldStatus;

  /** Whether the field is required, which adds the visible marker. */
  required?: boolean;

  /**
   * Whether the field is waiting for something.
   *
   * A pending field shows the framework's spinner in its label row, which is where a
   * reader looks for the name of the field that is taking its time.
   *
   * @default false
   */
  isLoading?: boolean;

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
  status = FALLBACK_FIELD_CONFIG.status,
  required = false,
  isLoading = false,
  children,
}: FieldShellProps) {
  return (
    <View className={NATIVE_FIELD_SHELL_CLASS}>
      {label && (
        <View className={NATIVE_FIELD_LABEL_ROW_CLASS}>
          <Text role="label">{label}</Text>
          {required && (
            <Text
              role="label"
              className={FIELD_REQUIRED_MARKER_CLASS}
              accessible={false}>
              *
            </Text>
          )}
          {isLoading && <Spinner size="sm" />}
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
          className={FIELD_STATUS_TEXT_CLASS[status]}
          // A failed field announces its message when it appears; the others
          // are part of the form's own text.
          accessibilityLiveRegion={isFieldInvalid(status) ? "polite" : "none"}>
          {message}
        </Text>
      )}
    </View>
  );
}
