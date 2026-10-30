/**
 * The platform's class dictionaries for form.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/form/form-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/** The form's own layout, which is a column of fields. */
export const NATIVE_FORM_CLASS = "w-full flex-col gap-4";

/** The group that wraps the fields when the consumer names them. */
export const NATIVE_FORM_GROUP_CLASS = "w-full flex-col gap-4";

/** The text the grouping is named with. */
export const NATIVE_FORM_LEGEND_CLASS = "text-sm font-medium text-foreground";

/** The row that holds the submit control. */
export const NATIVE_FORM_SUBMIT_ROW_CLASS =
  "flex-row items-center gap-2 pt-2 self-start";
