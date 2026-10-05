/**
 * Textarea component styles for the web renderer.
 *
 * The class strings live in `@asheeui/core`, beside the native ones, because a text
 * field's padding around its text is the same decision on both platforms. This module
 * re-exports them so the component keeps reading one module, and so what it finds there
 * is the same scale the native package compiles.
 */

export {
  TEXTAREA_SIZE_CLASS,
  TEXTAREA_STATUS_BORDER_CLASS,
} from "@asheeui/core";
