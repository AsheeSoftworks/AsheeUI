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
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { FieldStatus } from "./field-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The marker that shows a field has to be filled in.
 * Both platforms draw the same asterisk in the same role colour.
 */
export const FIELD_REQUIRED_MARKER_CLASS = "text-danger";

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

// ─── Native ───────────────────────────────────────────────────────────────────
