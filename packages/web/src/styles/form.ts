/**
 * The web renderer's class dictionaries for form.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/forms/form/form-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

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
