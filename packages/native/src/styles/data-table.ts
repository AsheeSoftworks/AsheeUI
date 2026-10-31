/**
 * The platform's class dictionaries for data-table.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/data-table/data-table-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/** The native composition: heading, toolbar, rows and footer, in one column. */
export const NATIVE_ROW_LIST_WRAPPER_CLASS = "w-full flex flex-col gap-4";

/** The heading above the toolbar. */
export const NATIVE_ROW_LIST_HEADING_CLASS = "w-full flex flex-col gap-1";

/** The native toolbar, which is the column a phone needs. */
export const NATIVE_ROW_LIST_TOOLBAR_CLASS = "w-full flex flex-col gap-3";

/** The group that holds the search control and the consumer's own controls. */
export const NATIVE_ROW_LIST_TOOLBAR_GROUP_CLASS = "w-full flex flex-col gap-2";

/** The region that holds the rows or the empty state. */
export const NATIVE_ROW_LIST_REGION_CLASS = "w-full flex flex-col gap-4";

/** The footer that holds the count and the way to more rows. */
export const NATIVE_ROW_LIST_FOOTER_CLASS = "w-full flex flex-col gap-3";

/** The count of what is showing, which is a statement rather than a control. */
export const NATIVE_ROW_LIST_COUNT_CLASS = "text-center";
