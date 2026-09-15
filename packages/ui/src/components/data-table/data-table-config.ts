/**
 * DataTable component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the table
 * composition: whether it searches and pages, how many rows a page holds,
 * whether it reports the count, and what it says when there is nothing to show.
 * It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";

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

/**
 * Default config values registered for the DataTable component.
 */
export const defaultDataTableConfig: DataTableConfig = {
  searchable: true,
  searchLabel: "Search",
  paginated: true,
  pageSize: 10,
  showRowCount: true,
  emptyTitle: "No results",
  emptyDescription: "Try a different search, or clear it to see everything.",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    datatable: DataTableConfig;
  }
}

registerComponentDefaults("datatable", defaultDataTableConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_DATA_TABLE_CONFIG: Required<DataTableConfig> = {
  searchable: true,
  searchLabel: "Search",
  paginated: true,
  pageSize: 10,
  showRowCount: true,
  emptyTitle: "No results",
  emptyDescription: "Try a different search, or clear it to see everything.",
};
