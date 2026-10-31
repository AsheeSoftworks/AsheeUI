/**
 * Stepper styles for the web renderer.
 *
 * The class strings live in `../../../styles/stepper`, which is where Tailwind can read them: a
 * marker, the label beside it and the rule drawn between steps are decisions about this renderer's
 * pixels. This module keeps the component's import path, so the stepper reads one module.
 *
 * `StepperStepState` is the exception — a type never moves (H17) — and is re-exported from
 * `@asheeui/core`, where both renderers name the same three states of a step.
 */

export type { StepperStepState } from "@asheeui/core";
export {
  STEPPER_CONNECTOR_CLASS,
  STEPPER_DESCRIPTION_CLASS,
  STEPPER_ITEM_BUTTON_CLASS,
  STEPPER_ITEM_CLASS,
  STEPPER_LABEL_CLASS,
  STEPPER_LABEL_SIZE_TOKEN,
  STEPPER_LIST_CLASS,
  STEPPER_MARKER_CLASS,
  STEPPER_MARKER_SIZE_CLASS,
  STEPPER_MARKER_STATE_CLASS,
  STEPPER_STATE_TEXT_CLASS,
} from "../../../styles/stepper";
