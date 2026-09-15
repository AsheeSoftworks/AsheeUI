/**
 * FileUpload component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the file field: what
 * its drop zone and its control say, and how dense it is. It registers the
 * default configuration with the component registry and provides fallback values
 * for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared";

/**
 * Theme configuration options for the FileUpload component.
 *
 * Set under `components.fileupload` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface FileUploadConfig {
  /**
   * Name of the control inside the drop zone.
   *
   * @default "Choose files"
   */
  buttonLabel?: string;

  /**
   * Instruction shown in the zone when nothing is being dragged over it.
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
 * Default config values registered for the FileUpload component.
 */
export const defaultFileUploadConfig: FileUploadConfig = {
  buttonLabel: "Choose files",
  hint: "Drag files here",
  size: "md",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    fileupload: FileUploadConfig;
  }
}

registerComponentDefaults("fileupload", defaultFileUploadConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_FILE_UPLOAD_CONFIG: Required<FileUploadConfig> = {
  buttonLabel: "Choose files",
  hint: "Drag files here",
  size: "md",
};
