/**
 * FileUpload component styles for the web renderer.
 *
 * They live in `@asheeui/web/src/styles`, beside this module's component; the barrel re-exports
 * them so the component keeps reading one module. Core no longer holds either renderer's
 * strings (C2).
 */

export {
  FILE_UPLOAD_BUTTON_CLASS,
  FILE_UPLOAD_HINT_CLASS,
  FILE_UPLOAD_INPUT_CLASS,
  FILE_UPLOAD_LIST_CLASS,
  FILE_UPLOAD_SIZE_CLASS,
  FILE_UPLOAD_ZONE_ACTIVE_CLASS,
  FILE_UPLOAD_ZONE_CLASS,
  FILE_UPLOAD_ZONE_DISABLED_CLASS,
} from "../../../styles/file-upload";
