/**
 * The web renderer's class dictionaries for field.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/field/field-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { FieldStatus, LabelAlign } from "@asheeui/core";

/**
 * The stack the shell's parts sit in.
 * The gap is the field's own breathing room, between the label, the control and the
 * message, so it does not scale with the control's density.
 */
export const FIELD_SHELL_CLASS = "flex flex-col gap-1.5";

/**
 * The label, which names the control.
 * Sized and weighted as a form label rather than as a heading: it labels what
 * follows instead of competing with it.
 */
export const FIELD_LABEL_CLASS = "text-sm font-medium text-foreground";

/**
 * The row inside the label, which holds the text and everything beside it.
 * The marker and the pending spinner sit in the label's line rather than after the
 * block, so a long label wraps without stranding them.
 */
export const FIELD_LABEL_CONTENT_CLASS = "inline-flex items-center gap-1.5";

/** The description, which explains the field beneath its label. */
export const FIELD_DESCRIPTION_CLASS = "text-sm text-foreground/60";

/** The message, whose tone its status decides. */
export const FIELD_MESSAGE_CLASS = "text-sm";

/**
 * CSS classes for label alignment.
 * Controls the text alignment of field labels.
 */
export const FIELD_LABEL_ALIGN_CLASS: Record<LabelAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * The edge a control wears for each validation status.
 *
 * A status never changes the edge's width, only its colour: re-laying out a control
 * because its validation changed would move everything around it. The focus ring is
 * restated with the border so a failed field that is also focused does not lose the
 * one signal that says where the caret is.
 */
export const FIELD_STATUS_BORDER_CLASS: Record<FieldStatus, string> = {
  default: "",
  error:
    "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
  warning:
    "border-warning focus-visible:border-warning focus-visible:ring-warning/20",
  success:
    "border-success focus-visible:border-success focus-visible:ring-success/20",
};
