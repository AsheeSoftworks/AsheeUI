/**
 * FileUpload component for the native package.
 *
 * The component satisfies the framework's file-field contract: the same zone, the same
 * instruction, the same list of chosen files and the same validation vocabulary as the web
 * field. Three things are deliberately native rather than portable:
 *
 * 1. There is no drag state. The platform has no pointer, so a file arrives from the platform's
 *    picker, and the zone is the control that opens it (`onChoose`) rather than a drop target.
 * 2. The picker itself is not the component's. A native document picker is a package of its
 *    own, and a component that chose one for the consumer would choose a dependency for them;
 *    the field owns the zone, the list and the validation, and the consumer wires the picker to
 *    `onChoose`.
 * 3. The field does not render a hidden field for a keyboard to reach, because the platform's
 *    control is the zone itself.
 */

import {
  type FieldStatus,
  isFieldInvalid,
  NATIVE_FILE_UPLOAD_BUTTON_CLASS,
  NATIVE_FILE_UPLOAD_FILE_CLASS,
  NATIVE_FILE_UPLOAD_FILE_NAME_CLASS,
  NATIVE_FILE_UPLOAD_FILE_SIZE_CLASS,
  NATIVE_FILE_UPLOAD_HINT_CLASS,
  NATIVE_FILE_UPLOAD_LIST_CLASS,
  NATIVE_FILE_UPLOAD_REMOVE_CLASS,
  NATIVE_FILE_UPLOAD_SIZE_CLASS,
  NATIVE_FILE_UPLOAD_ZONE_CLASS,
  NATIVE_FILE_UPLOAD_ZONE_DISABLED_CLASS,
  resolveCascade,
  type Size,
} from "@asheeui/core";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_FILE_UPLOAD_CONFIG,
  type NativeFileUploadConfig,
} from "./file-upload-config";

/**
 * One file the field lists.
 *
 * It is a description rather than a handle: the platform's files are platform values, and a
 * component that carried one would tie the field to the picker the consumer chose.
 */
export interface NativeUploadedFile {
  /** The file's name, which is what the reader recognises it by. */
  name: string;

  /** Its size in bytes, when the picker reported one. */
  size?: number;
}

/**
 * Say a size in the unit a reader reads it in.
 *
 * @param bytes - The size in bytes.
 * @returns The size, with its unit.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${Math.round(kilobytes)} kB`;

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

/**
 * Props for the native FileUpload.
 */
export interface FileUploadProps extends NativeFileUploadConfig {
  /** The files the field lists. */
  files: readonly NativeUploadedFile[];

  /** Called when the reader asks for a file, so the consumer can open its own picker. */
  onChoose?: () => void;

  /** Called with a file's name when the reader removes it. */
  onRemove?: (name: string) => void;

  /** The field's label. */
  label?: string;

  /** Description shown under the label. */
  description?: string;

  /** Validation message shown under the list. */
  message?: string;

  /** Validation status of the field. Defaults to `"default"`. */
  status?: FieldStatus;

  /** Whether the field must hold a file before the form is submitted. */
  required?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Identifier for the zone, so a test can reach it. */
  testID?: string;
}

/**
 * A field for files.
 *
 * The field lists what has been chosen, offers the control that asks for another, and reports
 * the reader's intent; opening the platform's picker is the consumer's, which is what keeps the
 * field from choosing a dependency on the consumer's behalf.
 *
 * @param props - The field's files and its controls.
 * @param props.files - The files the field lists.
 * @param props.onChoose - Called when the reader asks for a file.
 * @param props.onRemove - Called with a file's name when the reader removes it.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   label="Receipt"
 *   files={files}
 *   onChoose={pickFile}
 *   onRemove={(name) => setFiles(files.filter((file) => file.name !== name))}
 * />
 * ```
 *
 * @see Form - The control a form submits with.
 */
export function FileUpload({
  files,
  onChoose,
  onRemove,
  label,
  description,
  message,
  status,
  required,
  buttonLabel,
  hint,
  size,
  isDisabled,
  className,
  testID,
}: FileUploadProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.fileupload;

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_FILE_UPLOAD_CONFIG.size,
  );
  const resolvedButtonLabel = resolveCascade<string>(
    buttonLabel,
    sectionConfig?.buttonLabel,
    undefined,
    FALLBACK_NATIVE_FILE_UPLOAD_CONFIG.buttonLabel,
  );
  const resolvedHint = resolveCascade<string>(
    hint,
    sectionConfig?.hint,
    undefined,
    FALLBACK_NATIVE_FILE_UPLOAD_CONFIG.hint,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_FILE_UPLOAD_CONFIG.isDisabled,
  );

  const resolvedStatus = status ?? "default";

  return (
    <FieldShell
      label={label}
      description={description}
      message={message}
      status={resolvedStatus}
      required={required}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label ?? resolvedButtonLabel}
        accessibilityHint={hint ?? description}
        aria-invalid={isFieldInvalid(resolvedStatus)}
        disabled={resolvedDisabled}
        onPress={() => onChoose?.()}
        className={classNames(
          NATIVE_FILE_UPLOAD_ZONE_CLASS,
          NATIVE_FILE_UPLOAD_SIZE_CLASS[resolvedSize],
          resolvedDisabled && NATIVE_FILE_UPLOAD_ZONE_DISABLED_CLASS,
          className,
        )}>
        <Text role="label" className={NATIVE_FILE_UPLOAD_BUTTON_CLASS}>
          {resolvedButtonLabel}
        </Text>
        <Text role="body-sm" className={NATIVE_FILE_UPLOAD_HINT_CLASS}>
          {resolvedHint}
        </Text>
      </Pressable>
      {files.length > 0 && (
        <View className={NATIVE_FILE_UPLOAD_LIST_CLASS}>
          {files.map((file) => (
            <View key={file.name} className={NATIVE_FILE_UPLOAD_FILE_CLASS}>
              <View className="flex-col flex-1 min-w-0">
                <Text
                  role="body-sm"
                  className={NATIVE_FILE_UPLOAD_FILE_NAME_CLASS}>
                  {file.name}
                </Text>
                {file.size !== undefined && (
                  <Text
                    role="body-sm"
                    className={NATIVE_FILE_UPLOAD_FILE_SIZE_CLASS}>
                    {formatFileSize(file.size)}
                  </Text>
                )}
              </View>
              {onRemove && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${file.name}`}
                  disabled={resolvedDisabled}
                  onPress={() => onRemove(file.name)}
                  className={NATIVE_FILE_UPLOAD_REMOVE_CLASS}>
                  <Text role="body-sm" accessible={false}>
                    ✕
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}
    </FieldShell>
  );
}
