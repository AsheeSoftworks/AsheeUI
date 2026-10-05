/**
 * The field family's class dictionaries.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones,
 * side by side and both platform-neutral: neither renderer owns a string the other
 * platform's design language also states, so the label block a web field draws and
 * the label block a native field draws are the same block.
 *
 * A map is total over the union it is keyed by. A component that asks for a status
 * or an alignment therefore cannot receive `undefined`, which is what lets a new
 * member of the family — or a fifth status — fail to compile rather than render
 * nothing.
 *
 * Only the maps a shell actually compiles live here. A dictionary for a size-aware
 * shell is not included: both shells space themselves by a constant today, and a map
 * that describes a variant of the component nobody has built reads as a feature
 * rather than as dead weight.
 */

import type { FieldStatus, LabelAlign } from "./field-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

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

/**
 * The marker that shows a field has to be filled in.
 * Both platforms draw the same asterisk in the same role colour.
 */
export const FIELD_REQUIRED_MARKER_CLASS = "text-danger";

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
 * The tone of the message for each validation status.
 *
 * Both platforms draw it the same way, so one map serves both: a failed field's
 * message is the danger colour because the message is where the user is told what to
 * fix. The shell's own label and description keep the neutral foreground, since a
 * field that failed still has to be readable to be corrected.
 */
export const FIELD_STATUS_TEXT_CLASS: Record<FieldStatus, string> = {
  default: "text-foreground",
  error: "text-danger",
  warning: "text-warning",
  success: "text-success",
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

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The stack a native shell's parts sit in.
 * The same gap as the web shell's, in the platform's own layout vocabulary.
 */
export const NATIVE_FIELD_SHELL_CLASS = "flex-col gap-1.5";

/**
 * The row a native field's label sits in.
 * Native draws the label's marker as its own text node rather than inside the label
 * string, which is why the row exists at all: the marker has to be able to be read
 * out of the accessibility tree without leaving the visual label.
 */
export const NATIVE_FIELD_LABEL_ROW_CLASS = "flex-row items-center gap-1";
