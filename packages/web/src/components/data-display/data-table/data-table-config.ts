/**
 * DataTable component configuration for AsheeUI.
 *
 * This file registers the values the table composition defaults to on the web, so the
 * component-level tier of the theme cascade has a value to resolve. The options themselves,
 * and the types that name them, live in `@asheeui/core`: they are the framework's data-table
 * contract rather than a web renderer's, and the native component that renders a table's
 * rows reads the same ones from the same place. What stays here is the web default values
 * and the registration that puts them in the web registry.
 */

import {
  DATA_TABLE_ROW_COUNT_LABEL,
  type DataTableConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { DataTableConfig };

/**
 * Default config values registered for the DataTable component.
 */
export const defaultDataTableConfig: DataTableConfig = {
  searchable: true,
  searchLabel: "Search",
  searchDebounce: 0,
  paginated: true,
  pageSize: 10,
  showRowCount: true,
  rowCountLabel: DATA_TABLE_ROW_COUNT_LABEL,
  loadingLabel: "Loading results",
  emptyTitle: "No results",
  emptyDescription: "Try a different search, or clear it to see everything.",
};

registerComponentDefaults("datatable", defaultDataTableConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_DATA_TABLE_CONFIG = {
  searchable: true,
  searchLabel: "Search",
  searchDebounce: 0,
  paginated: true,
  pageSize: 10,
  showRowCount: true,
  rowCountLabel: DATA_TABLE_ROW_COUNT_LABEL,
  loadingLabel: "Loading results",
  emptyTitle: "No results",
  emptyDescription: "Try a different search, or clear it to see everything.",
} satisfies DataTableConfig;
