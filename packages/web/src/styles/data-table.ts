/**
 * The web renderer's class dictionaries for data-table.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/data-table/data-table-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

/** The wrapper. */
export const DATA_TABLE_CLASS = "flex w-full min-w-0 flex-col gap-4";

/** The heading above the toolbar. */
export const DATA_TABLE_HEADING_CLASS = "flex flex-col gap-1";

/**
 * The toolbar above the table.
 * The control and the count stack on a narrow screen and sit in a row from the
 * `sm` breakpoint.
 */
export const DATA_TABLE_TOOLBAR_CLASS =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

/** The group that holds the search control and the consumer's own controls. */
export const DATA_TABLE_TOOLBAR_GROUP_CLASS =
  "flex w-full flex-col gap-2 sm:flex-row sm:items-center";

/** The region that holds the table or the empty state. */
export const DATA_TABLE_REGION_CLASS = "flex w-full min-w-0 flex-col gap-4";

/** The row count, which sits under the table beside the pagination. */
export const DATA_TABLE_FOOTER_CLASS =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

/** Width the search control takes in the toolbar. */
export const DATA_TABLE_SEARCH_CLASS = "w-full sm:max-w-sm";
