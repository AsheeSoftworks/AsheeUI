/**
 * The Textarea's class dictionaries, for the web renderer.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones,
 * side by side: a text field's padding around its text is the same decision on both
 * platforms, and stating the two beside each other is what keeps a change to the family's
 * density scale from reaching one renderer and missing the other.
 *
 * The two differ where the platforms differ. The web fixes nothing about the field's
 * box beyond its padding, because the browser grows a textarea by the row count the
 * `rows` option gives it. Native states the height a row occupies, because the
 * platform's control has no rows: it grows with its content, so the renderer derives a
 * minimum height from the option instead.
 *
 * The status edge is not mapped here: a textarea is a field, so the edge its validation
 * decides is the family's `FIELD_STATUS_BORDER_CLASS`, restated under the name this
 * component reads it by.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import { FIELD_STATUS_BORDER_CLASS } from "../field/field-styles";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * CSS classes for textarea padding and font size.
 * Maps size keys to Tailwind padding and text size classes.
 */
export const TEXTAREA_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "p-2 text-xs",
  md: "p-3 text-sm",
  lg: "p-4 text-base",
};

/**
 * CSS classes for textarea status border styles.
 * Maps status values to Tailwind classes for border and focus ring colours.
 */
export const TEXTAREA_STATUS_BORDER_CLASS: Record<FieldStatus, string> =
  FIELD_STATUS_BORDER_CLASS;

// ─── Native ───────────────────────────────────────────────────────────────────
