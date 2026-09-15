/**
 * FileUpload component for AsheeUI.
 *
 * This file provides the `FileUpload` field: a drop zone, a file picker and the
 * list of chosen files. It composes the framework's field shell and `Chip` for
 * that list, so the field contract (label, description, message, status) and the
 * file token look the same here as they do everywhere else.
 */

"use client";

import {
  type DragEvent,
  forwardRef,
  type InputHTMLAttributes,
  useId,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Chip } from "../chip/Chip";
import { FieldShell } from "../field/FieldShell";
import type { FieldStatus } from "../field/field-config";
import { describeRejectedFiles } from "./file-upload.helpers";
import {
  FALLBACK_FILE_UPLOAD_CONFIG,
  type FileUploadConfig,
} from "./file-upload-config";
import {
  FILE_UPLOAD_BUTTON_CLASS,
  FILE_UPLOAD_HINT_CLASS,
  FILE_UPLOAD_INPUT_CLASS,
  FILE_UPLOAD_LIST_CLASS,
  FILE_UPLOAD_SIZE_CLASS,
  FILE_UPLOAD_ZONE_ACTIVE_CLASS,
  FILE_UPLOAD_ZONE_CLASS,
  FILE_UPLOAD_ZONE_DISABLED_CLASS,
} from "./file-upload-styles";

type BaseFileUploadProps = FileUploadConfig &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "className" | "onChange" | "size" | "type" | "value"
  >;

/**
 * Props for the FileUpload component.
 */
export interface FileUploadProps extends BaseFileUploadProps {
  /**
   * Called with the files the reader chose, once the ones over the size limit
   * have been left out. The field owns nothing: the consumer keeps the list and
   * passes it back through `files`.
   */
  onFilesSelected: (files: File[]) => void;

  /**
   * The files that have been chosen, which the field lists and can remove.
   */
  files?: File[];

  /**
   * Called with the file the reader removed.
   * Its presence is what draws a remove control beside each file.
   */
  onRemove?: (file: File) => void;

  /**
   * Largest file the field accepts, in bytes.
   * A larger file is left out and reported here rather than being passed on to
   * be rejected later.
   */
  maxSize?: number;

  /**
   * Label of the field.
   */
  label?: string;

  /**
   * Description shown under the label.
   */
  description?: string;

  /**
   * Message shown under the field.
   */
  message?: string;

  /**
   * Validation status of the field.
   *
   * @default "default"
   */
  status?: FieldStatus;

  /**
   * Whether the field is unavailable.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the field must be filled in before the form is submitted.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Extra classes for the field wrapper.
   */
  className?: string;
}

/**
 * A field that accepts files.
 *
 * The zone is a label for the field, so a pointer opens the picker, a keyboard
 * reaches the field, and a screen reader reads the zone as the field's name.
 * Files dropped on the zone take the same path as files chosen from the picker,
 * which is what keeps the size limit from being skipped.
 *
 * The field owns nothing: it reports what was chosen and lists what the consumer
 * passes back, which is what lets one component serve a plain form and a form
 * library that owns the files.
 *
 * @param props - FileUpload configuration options and field attributes.
 * @param props.onFilesSelected - Called with the accepted files.
 * @param props.files - The files that have been chosen.
 * @param props.onRemove - Called with the file the reader removed.
 * @param props.maxSize - Largest accepted file, in bytes.
 * @param props.accept - The kinds of file the picker offers.
 * @param props.multiple - Whether more than one file may be chosen.
 * @param props.label - Label of the field.
 * @param props.description - Description under the label.
 * @param props.message - Message under the field.
 * @param props.status - Validation status. Defaults to "default".
 * @param props.isDisabled - Whether the field is unavailable. Defaults to false.
 * @param props.size - Density of the zone. Defaults to "md".
 * @param props.buttonLabel - Name of the control. Defaults to "Choose files".
 * @param props.hint - Instruction in the zone. Defaults to "Drag files here".
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   label="Attachments"
 *   accept="application/pdf"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   files={files}
 *   onFilesSelected={(chosen) => setFiles((current) => [...current, ...chosen])}
 *   onRemove={(file) => setFiles((current) => current.filter((f) => f !== file))}
 * />
 * ```
 *
 * @see Input - The text field, which shares the field contract.
 * @see Chip - The token the field uses for a chosen file.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      onFilesSelected,
      files,
      onRemove,
      maxSize,
      label,
      description,
      message,
      status,
      isDisabled,
      required,
      buttonLabel,
      hint,
      size,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const resolved = resolveConfigCascade<
      FileUploadConfig,
      Required<FileUploadConfig>
    >(
      { buttonLabel, hint, size },
      config.components?.fileupload,
      FALLBACK_FILE_UPLOAD_CONFIG,
    );

    const [isDragging, setIsDragging] = useState(false);
    const [rejection, setRejection] = useState("");
    const localRef = useRef<HTMLInputElement | null>(null);

    const setInputRef = (node: HTMLInputElement | null) => {
      localRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const acceptFiles = (chosen: FileList | null) => {
      const candidates = Array.from(chosen ?? []);

      if (candidates.length === 0) {
        return;
      }

      const accepted =
        maxSize === undefined
          ? candidates
          : candidates.filter((file) => file.size <= maxSize);

      const leftOut = candidates.length - accepted.length;
      setRejection(
        leftOut === 0 ? "" : describeRejectedFiles(leftOut, maxSize ?? 0),
      );

      if (accepted.length > 0) {
        onFilesSelected(accepted);
      }
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);

      if (isDisabled) {
        return;
      }

      acceptFiles(event.dataTransfer?.files ?? null);
    };

    // A reader who opens the picker and closes it again chooses nothing, and the
    // field reports that as an empty selection rather than as a rejection.
    const handleChange = () => {
      acceptFiles(localRef.current?.files ?? null);
    };

    // The size limit's own message and the consumer's message are the same
    // channel, so the field never shows two messages at once.
    const fieldMessage = message ?? rejection;
    const fieldStatus: FieldStatus = message
      ? (status ?? "default")
      : rejection
        ? "error"
        : "default";

    const zoneClassName = cn(
      FILE_UPLOAD_ZONE_CLASS,
      FILE_UPLOAD_SIZE_CLASS[resolved.size],
      isDragging && FILE_UPLOAD_ZONE_ACTIVE_CLASS,
      isDisabled && FILE_UPLOAD_ZONE_DISABLED_CLASS,
    );

    return (
      <div className={cn("flex w-full min-w-0 flex-col", className)}>
        <FieldShell
          id={inputId}
          label={label}
          description={description}
          message={fieldMessage}
          status={fieldStatus}
          required={required}>
          <input
            {...rest}
            ref={setInputRef}
            id={inputId}
            type="file"
            className={FILE_UPLOAD_INPUT_CLASS}
            disabled={isDisabled}
            onChange={handleChange}
          />

          <label
            htmlFor={inputId}
            className={zoneClassName}
            onDragOver={(event) => {
              event.preventDefault();

              if (!isDisabled) {
                setIsDragging(true);
              }
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}>
            <span className="flex flex-wrap items-baseline justify-center gap-1 text-sm">
              <span className={FILE_UPLOAD_BUTTON_CLASS}>
                {resolved.buttonLabel}
              </span>
              <span className={FILE_UPLOAD_HINT_CLASS}>
                or {resolved.hint.toLowerCase()}
              </span>
            </span>
          </label>

          {files && files.length > 0 && (
            <ul className={FILE_UPLOAD_LIST_CLASS}>
              {files.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>
                  <Chip
                    closeLabel={`Remove ${file.name}`}
                    onClose={onRemove ? () => onRemove(file) : undefined}>
                    {file.name}
                  </Chip>
                </li>
              ))}
            </ul>
          )}
        </FieldShell>
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";
