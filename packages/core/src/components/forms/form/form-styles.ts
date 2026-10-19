/**
 * The Form's class dictionaries, for both renderers.
 *
 * The list is deliberately short: a form groups and submits, and laying a page out is the
 * consumer's job. Nothing here styles a field, because fields are the framework's field
 * components, and nothing here states a layout a consumer could not restate with a stack.
 *
 * The web's legend is a real element the browser draws a frame around, which is why the web
 * removes that frame rather than styling it: the grouping is semantic. Native has no frame to
 * remove, so what native states is the text the grouping is named with.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/** Base classes for the form element. */
export const FORM_BASE_CLASS = "w-full";

/**
 * Classes for the group that wraps the fields when the consumer names them.
 * The browser's default fieldset frame is removed, because the grouping is semantic rather
 * than visual.
 */
export const FORM_FIELD_GROUP_CLASS = "border-0 p-0 m-0 min-w-0";

/** Classes for the legend of that group. */
export const FORM_LEGEND_CLASS = "p-0 mb-2 text-sm font-medium text-foreground";

/** Classes for the row that holds the submit control. */
export const FORM_SUBMIT_ROW_CLASS = "flex items-center gap-2 mt-4";

// ─── Native ───────────────────────────────────────────────────────────────────

/** The form's own layout, which is a column of fields. */
export const NATIVE_FORM_CLASS = "w-full flex-col gap-4";

/** The group that wraps the fields when the consumer names them. */
export const NATIVE_FORM_GROUP_CLASS = "w-full flex-col gap-4";

/** The text the grouping is named with. */
export const NATIVE_FORM_LEGEND_CLASS = "text-sm font-medium text-foreground";

/** The row that holds the submit control. */
export const NATIVE_FORM_SUBMIT_ROW_CLASS =
  "flex-row items-center gap-2 pt-2 self-start";
