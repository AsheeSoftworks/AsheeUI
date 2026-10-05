/**
 * FileUpload configuration for the web renderer.
 *
 * The file field's options are shared, so the contract lives in `@asheeui/core` and is
 * re-exported here: a consumer configures `components.fileupload` with the same keys on both
 * platforms.
 *
 * What stays with the renderer is the value each option *defaults to* on the web, and the
 * registration itself.
 */

import {
  type FileUploadConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { FileUploadConfig } from "@asheeui/core";
export { FALLBACK_FILE_UPLOAD_CONFIG } from "@asheeui/core";

/**
 * Default config values registered for the FileUpload component.
 */
export const defaultFileUploadConfig: FileUploadConfig = {
  buttonLabel: "Choose files",
  hint: "Drag files here",
  size: "md",
};

registerComponentDefaults("fileupload", defaultFileUploadConfig);
