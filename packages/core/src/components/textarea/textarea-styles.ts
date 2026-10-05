/**
 * The Textarea's class dictionaries, for both renderers.
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

/**
 * The layout every native textarea starts from.
 *
 * It is not the single-line field's base: that one is a row which centres its text, and
 * a multi-line field has to fill its box from the top instead.
 */
export const NATIVE_TEXTAREA_BASE_CLASS = "w-full text-foreground";

/**
 * Padding and text size for each density.
 *
 * Height is deliberately absent: a native textarea's height comes from the rows it was
 * given, so a height here would be a second, competing statement of the same thing.
 */
export const NATIVE_TEXTAREA_SIZE_CLASS: Record<FieldSizeKey, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
};

/**
 * How tall one visible row is, in pixels.
 *
 * The platform's text metrics decide the real line height, so this is the framework's
 * reading of them rather than a measurement: it is the number the minimum height is
 * derived from, which is what makes `rows` mean the same thing on both platforms.
 */
export const NATIVE_TEXTAREA_ROW_HEIGHT = 24;
