/**
 * The Stepper's one shared name: the state a step is in.
 *
 * A step is `complete`, `current` or `upcoming` on both platforms, and a screen writes those three
 * words in a prop — so `StepperStepState` is vocabulary, and a type never moves (H17). Both
 * renderers re-export it, and each states what a state *looks* like in its own package.
 *
 * Everything else the Stepper renders has left core. The web's class dictionaries, and
 * `STEPPER_LABEL_SIZE_TOKEN` with them, are in `packages/web/src/styles/stepper.ts`; the platform's
 * are in `packages/native/src/styles/stepper.ts` and `packages/native/src/components/forms/stepper/`.
 * The size token moved in C3 rather than staying here because only the web reads it: the platform
 * answers the same question one role higher, in `NATIVE_STEPPER_LABEL_ROLE`, since a native marker
 * is a touch target rather than a badge. There is no map both renderers could read, so core does
 * not hold one.
 */

/**
 * The state a step is in, relative to the current step.
 */
export type StepperStepState = "complete" | "current" | "upcoming";
