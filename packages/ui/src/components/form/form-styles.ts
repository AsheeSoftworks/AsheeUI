/**
 * Form component styles for AsheeUI.
 * This file provides the static classes the Form component is built from.
 *
 * The list is deliberately short: a form groups and submits, and page layout
 * belongs to the consumer's Tailwind classes. Nothing here styles
 * a field, because fields are the framework's field components.
 */

/**
 * Base classes for the form element.
 */
export const FORM_BASE_CLASS = "w-full";

/**
 * Classes for the group that wraps the fields when the consumer names them.
 * The browser's default fieldset frame is removed, because the grouping is
 * semantic rather than visual.
 */
export const FORM_FIELD_GROUP_CLASS = "border-0 p-0 m-0 min-w-0";

/**
 * Classes for the legend of that group.
 */
export const FORM_LEGEND_CLASS = "p-0 mb-2 text-sm font-medium text-foreground";

/**
 * Classes for the row that holds the submit control.
 */
export const FORM_SUBMIT_ROW_CLASS = "flex items-center gap-2 mt-4";
