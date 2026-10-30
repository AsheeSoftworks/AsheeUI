/**
 * RowList component configuration for the native package.
 *
 * RowList is the native renderer of two contracts at once. The table's states how a
 * collection's rows are described and treated; the data table's states the furniture around
 * them — a search control, paging, a count of what is showing, and something to say when
 * there is nothing. A platform reads a collection as rows rather than as a grid of cells, so
 * both contracts land on one component here, and both sections resolve through the same
 * cascade, so a configuration written for a browser describes a device as well.
 */

import {
  DATA_TABLE_ROW_COUNT_LABEL,
  type DataTableConfig,
  type TableConfig,
} from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type {
  ColumnDef,
  DataTableConfig,
  TableConfig,
  TableVariant,
} from "@asheeui/core";

/**
 * Configuration options for the native rendering of the table contract.
 *
 * @deprecated Use {@link TableConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeTableConfig = TableConfig;

/**
 * Configuration options for the native rendering of the data-table contract.
 *
 * @deprecated Use {@link DataTableConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeDataTableConfig = DataTableConfig;

/**
 * The table defaults RowList registers with the native registry.
 *
 * They are the web's own values: rows at the framework's middle density, on the surface the
 * framework's rows are drawn on.
 *
 * @deprecated Use {@link defaultTableConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeTableConfig: NativeTableConfig = {
  size: "md",
  variant: "grid",
};

/**
 * The data-table defaults RowList registers with the native registry.
 *
 * They are the web's own values. A search control appears only when the list is given
 * something to search, exactly as it does on the web, because a field that cannot search is
 * a control that does nothing.
 *
 * @deprecated Use {@link defaultDataTableConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeDataTableConfig: NativeDataTableConfig = {
  searchable: true,
  searchLabel: "Search",
  searchDebounce: 0,
  paginated: true,
  pageSize: 10,
  showRowCount: true,
  loadingLabel: "Loading results",
  emptyTitle: "No results",
  emptyDescription: "Try a different search, or clear it to see everything.",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    table: NativeTableConfig;
    datatable: NativeDataTableConfig;
  }
}

registerNativeComponentDefaults("table", defaultNativeTableConfig);
registerNativeComponentDefaults("datatable", defaultNativeDataTableConfig);

/**
 * The table values RowList falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_TABLE_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_TABLE_CONFIG = {
  size: "md",
  variant: "grid",
  color: "primary",
  radius: "md",
  className: "",
  headerClassName: "",
  rowClassName: "",
  cellClassName: "",
} as const satisfies NativeTableConfig;

/**
 * The data-table values RowList falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_DATA_TABLE_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_DATA_TABLE_CONFIG = {
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
} satisfies NativeDataTableConfig;
