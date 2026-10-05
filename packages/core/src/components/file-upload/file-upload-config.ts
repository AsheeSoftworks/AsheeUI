/**
 * The FileUpload's configuration face, shared by both platforms.
 *
 * A file field is a field family member whose control the platform supplies, so its
 * configuration is what the field says rather than what it holds: the name of the control, the
 * instruction beside it and the density of the zone they sit in.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `fileupload` here is what makes `components.fileupload` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Size } from "../../tokens";

/**
 * Theme configuration options for the FileUpload component.
 *
 * Set under `components.fileupload` in the AsheeUI config.
 */
export interface FileUploadConfig {
  /**
   * Name of the control inside the zone.
   *
   * @default "Choose files"
   */
  buttonLabel?: string;

  /**
   * Instruction shown in the zone.
   *
   * @default "Drag files here"
   */
  hint?: string;

  /**
   * Density of the zone.
   *
   * @default "md"
   */
  size?: Size;
}

/**
 * The values a file field falls back to when no tier provides one.
 *
 * The instruction is the web's, and native overrides it in its own defaults rather than here:
 * there is nothing to drag on a platform without a pointer, so the shared fallback states what
 * the web says and the native renderer says something a reader can act on.
 */
export const FALLBACK_FILE_UPLOAD_CONFIG: Required<FileUploadConfig> = {
  buttonLabel: "Choose files",
  hint: "Drag files here",
  size: "md",
};

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    fileupload: FileUploadConfig;
  }
}
