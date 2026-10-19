/**
 * FileUpload component styles for the web renderer.
 *
 * The class strings live in `@asheeui/core`, beside the native ones, because the zone a file is
 * dropped into and the list of chosen files are the same decisions on both platforms. This
 * module re-exports them so the component keeps reading one module.
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
} from "@asheeui/core";
