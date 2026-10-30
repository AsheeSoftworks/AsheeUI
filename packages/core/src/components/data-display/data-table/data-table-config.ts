/**
 * The DataTable's configuration face, shared by both platforms.
 *
 * A data table is a table with the furniture a consumer would otherwise write: a search
 * control, paging, a count of what is showing, and something to say when there is nothing.
 * Both platforms ask it the same questions, so `components.datatable` means the same thing
 * in a web application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `datatable` here is what makes `components.datatable` a known
 * configuration section, on every platform, without each renderer restating it.
 */

/**
 * The values a row count template is filled with.
 */
export interface RowCountLabelValues {
  /** The first row shown, or `0` when there are none. */
  first: number;

  /** The last row shown, or `0` when there are none. */
  last: number;

  /** How many rows the current query, or the data, produced. */
  total: number;
}

/**
 * Fill a row count template with the rows a table is showing.
 *
 * A count is a sentence a reader is told rather than a control a reader operates, so it has
 * to be written in the reader's language. The template states the sentence and this fills
 * the three numbers it names; a placeholder the template does not use is simply not filled,
 * and text the template says around them is kept as written.
 *
 * @param template - The sentence, with `{first}`, `{last}` and `{total}` placeholders.
 * @param values - The numbers to fill it with.
 * @returns The sentence to state.
 *
 * @example
 * ```ts
 * formatRowCountLabel("Showing {first} to {last} of {total}", {
 *   first: 1,
 *   last: 10,
 *   total: 42,
 * }); // "Showing 1 to 10 of 42"
 * ```
 */
export function formatRowCountLabel(
  template: string,
  values: RowCountLabelValues,
): string {
  return template.replace(
    /\{(first|last|total)\}/g,
    (_placeholder: string, key: string) =>
      String(values[key as keyof RowCountLabelValues]),
  );
}

/**
 * Theme configuration options for the DataTable component.
 *
 * Set under `components.datatable` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface DataTableConfig {
  /**
   * Whether the table offers a search control.
   * The control appears only when the table also knows what to search, through
   * `searchAccessor` or `onSearchChange`, because a field that cannot search
   * would be a control that does nothing.
   *
   * @default true
   */
  searchable?: boolean | undefined;

  /**
   * Placeholder of the search control.
   *
   * @default "Search"
   */
  searchLabel?: string | undefined;

  /**
   * How long the table waits after the reader stops typing before it reports the query.
   *
   * The table reports each keystroke by default, which is what a search it filters itself
   * wants. A consumer that searches on the server sets this so `onSearchChange` fires once
   * per pause rather than once per character; the table also filters, resets to the first
   * page and announces the count at that moment, so the reported query and the rows agree.
   * `0` states no wait and leaves the component's behaviour unchanged.
   *
   * @default 0
   */
  searchDebounce?: number | undefined;

  /**
   * Whether the rows are divided into pages.
   *
   * @default true
   */
  paginated?: boolean | undefined;

  /**
   * How many rows a page holds.
   *
   * @default 10
   */
  pageSize?: number | undefined;

  /**
   * Whether the table reports how many rows it is showing.
   *
   * @default true
   */
  showRowCount?: boolean | undefined;

  /**
   * The sentence the count is stated with.
   *
   * `{first}` and `{last}` are the first and last row shown, and `{total}` is how many rows
   * there are, so a template can translate the sentence or state it in another shape. The
   * default is the wording the component has always used, so setting it changes the sentence
   * and leaving it changes nothing.
   *
   * @default "Showing {first} to {last} of {total}"
   */
  rowCountLabel?: string | undefined;

  /**
   * What the table says while its rows are still arriving.
   *
   * The table knows what is loading, so the region that reports the wait names it
   * rather than falling back to a generic "Loading". It is registered, so a product
   * whose rows are invoices can say so once.
   *
   * @default "Loading results"
   */
  loadingLabel?: string | undefined;

  /**
   * What the table says when there is nothing to show.
   *
   * @default "No results"
   */
  emptyTitle?: string | undefined;

  /**
   * The sentence under that title.
   *
   * @default "Try a different search, or clear it to see everything."
   */
  emptyDescription?: string | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    datatable: DataTableConfig;
  }
}
