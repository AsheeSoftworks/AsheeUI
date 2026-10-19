/**
 * Stepper component styles for the web renderer.
 *
 * The class strings live in `@asheeui/core`, beside the native ones, because a marker, the
 * label beside it and the rule drawn between steps are the same decisions on both platforms.
 * This module re-exports them so the component keeps reading one module.
 */

export type { StepperStepState } from "@asheeui/core";
export {
  STEPPER_CONNECTOR_CLASS,
  STEPPER_DESCRIPTION_CLASS,
  STEPPER_ITEM_BUTTON_CLASS,
  STEPPER_ITEM_CLASS,
  STEPPER_LABEL_CLASS,
  STEPPER_LIST_CLASS,
  STEPPER_MARKER_CLASS,
  STEPPER_MARKER_SIZE_CLASS,
  STEPPER_MARKER_STATE_CLASS,
  STEPPER_STATE_TEXT_CLASS,
} from "@asheeui/core";
