/**
 * Every class string the DataTable renders, for the web renderer, kept side by side so a
 * change to the composition lands on the web at once. Every entry is a complete,
 * static class string, because both Tailwind and NativeWind compile the classes they can
 * read in the source.
 *
 * The web's toolbar states its arrangements per breakpoint, because a browser window can be
 * wide; the platform has one width, so its toolbar is the column the phone needs, and the
 * same is true of its footer.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

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

// ─── Native ───────────────────────────────────────────────────────────────────
