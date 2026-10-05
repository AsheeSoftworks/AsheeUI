/**
 * FileUpload configuration for the native package.
 *
 * The options are the ones the framework's file field names, so a file field on native and on
 * the web are configured the same way. The name of the control and the density are taken from
 * the shared configuration; the instruction is the renderer's own, and deliberately so: there
 * is nothing to drag on a platform without a pointer, so the native default says what a reader
 * can act on and a consumer who wants the web's wording can still state it.
 */

import type { FileUploadConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native FileUpload.
 *
 * `buttonLabel`, `hint` and `size` carry the meanings the shared file field gives them.
 */
export interface NativeFileUploadConfig extends FileUploadConfig {
  /** Whether the field is unavailable. Defaults to false. */
  isDisabled?: boolean;
}

/**
 * The defaults the FileUpload registers with the native registry.
 */
export const defaultNativeFileUploadConfig: NativeFileUploadConfig = {
  buttonLabel: "Choose files",
  hint: "Pick a file to upload",
  size: "md",
  isDisabled: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    fileupload: NativeFileUploadConfig;
  }
}

registerNativeComponentDefaults("fileupload", defaultNativeFileUploadConfig);

/**
 * The values the field falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_FILE_UPLOAD_CONFIG: Required<NativeFileUploadConfig> =
  {
    buttonLabel: "Choose files",
    hint: "Pick a file to upload",
    size: "md",
    isDisabled: false,
  };
