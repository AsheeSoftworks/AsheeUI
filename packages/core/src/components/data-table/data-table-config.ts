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
  searchable?: boolean;

  /**
   * Placeholder of the search control.
   *
   * @default "Search"
   */
  searchLabel?: string;

  /**
   * Whether the rows are divided into pages.
   *
   * @default true
   */
  paginated?: boolean;

  /**
   * How many rows a page holds.
   *
   * @default 10
   */
  pageSize?: number;

  /**
   * Whether the table reports how many rows it is showing.
   *
   * @default true
   */
  showRowCount?: boolean;

  /**
   * What the table says when there is nothing to show.
   *
   * @default "No results"
   */
  emptyTitle?: string;

  /**
   * The sentence under that title.
   *
   * @default "Try a different search, or clear it to see everything."
   */
  emptyDescription?: string;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    datatable: DataTableConfig;
  }
}
