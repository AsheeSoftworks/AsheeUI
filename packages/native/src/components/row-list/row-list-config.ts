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

import type { DataTableConfig, TableConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  ColumnDef,
  DataTableConfig,
  TableConfig,
  TableVariant,
} from "@asheeui/core";

/**
 * Configuration options for the native rendering of the table contract.
 */
export type NativeTableConfig = TableConfig;

/**
 * Configuration options for the native rendering of the data-table contract.
 */
export type NativeDataTableConfig = DataTableConfig;

/**
 * The table defaults RowList registers with the native registry.
 *
 * They are the web's own values: rows at the framework's middle density, on the surface the
 * framework's rows are drawn on.
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
 */
export const defaultNativeDataTableConfig: NativeDataTableConfig = {
  searchable: true,
  searchLabel: "Search",
  paginated: true,
  pageSize: 10,
  showRowCount: true,
  emptyTitle: "No results",
  emptyDescription: "Try a different search, or clear it to see everything.",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    table: NativeTableConfig;
    datatable: NativeDataTableConfig;
  }
}

registerNativeComponentDefaults("table", defaultNativeTableConfig);
registerNativeComponentDefaults("datatable", defaultNativeDataTableConfig);

/**
 * The table values RowList falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_TABLE_CONFIG: Required<NativeTableConfig> = {
  size: "md",
  variant: "grid",
  color: "primary",
  radius: "md",
  className: "",
  headerClassName: "",
  rowClassName: "",
  cellClassName: "",
} as const;

/**
 * The data-table values RowList falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_DATA_TABLE_CONFIG: Required<NativeDataTableConfig> =
  {
    searchable: true,
    searchLabel: "Search",
    paginated: true,
    pageSize: 10,
    showRowCount: true,
    emptyTitle: "No results",
    emptyDescription: "Try a different search, or clear it to see everything.",
  };
