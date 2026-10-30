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
  type FieldStatus,
  isFieldInvalid,
  type LabelAlign,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { View } from "react-native";
import { classNames } from "../../../utils/class-names";
import {
  NATIVE_FIELD_LABEL_ROW_CLASS,
  NATIVE_FIELD_SHELL_CLASS,
} from "../../../styles/field";
import {
  FIELD_REQUIRED_MARKER_CLASS,
  FIELD_STATUS_TEXT_CLASS,
} from "../../../styles/portable";
import { Spinner } from "../../feedback/spinner/Spinner";
import { Typography } from "../../typography/text/Text";

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
   * Where the label row sits across the field.
   *
   * The web field has always accepted `labelAlign`; B12 gives the platform the same option,
   * because the shared field contract advertises it and a field that silently ignored it
   * would look aligned on one platform and not on the other.
   *
   * @default "left"
   */
  labelAlign?: LabelAlign;

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
 * How a label row spends the space it is given, per alignment.
 *
 * A class per value rather than an inline style: NativeWind compiles a class it can read,
 * and the row is a layout element the platform lays out itself.
 */
const LABEL_ALIGN_CLASS: Record<LabelAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

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
  labelAlign = FALLBACK_FIELD_CONFIG.labelAlign,
  isLoading = false,
  children,
}: FieldShellProps) {
  return (
    <View className={NATIVE_FIELD_SHELL_CLASS}>
      {label && (
        <View
          className={classNames(
            NATIVE_FIELD_LABEL_ROW_CLASS,
            LABEL_ALIGN_CLASS[labelAlign],
          )}>
          <Typography role="label">{label}</Typography>
          {required && (
            <Typography
              role="label"
              className={FIELD_REQUIRED_MARKER_CLASS}
              accessible={false}>
              *
            </Typography>
          )}
          {isLoading && <Spinner size="sm" />}
        </View>
      )}
      {description && (
        <Typography role="body-sm" tone="muted">
          {description}
        </Typography>
      )}
      {children}
      {message && (
        <Typography
          role="body-sm"
          className={FIELD_STATUS_TEXT_CLASS[status]}
          // A failed field announces its message when it appears; the others
          // are part of the form's own text.
          accessibilityLiveRegion={isFieldInvalid(status) ? "polite" : "none"}>
          {message}
        </Typography>
      )}
    </View>
  );
}
