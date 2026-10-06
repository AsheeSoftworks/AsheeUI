/**
 * Table component configuration for AsheeUI.
 *
 * This file registers the values the table defaults to on the web, so the component-level
 * fallback tier of the theme cascade has a value to resolve. The options themselves, and the
 * types that name them, live in `@asheeui/core`: they are the framework's table contract
 * rather than a web renderer's, and the component that renders a table's rows on the native
 * platform reads the same ones from the same place. What stays here is the web default
 * values and the registration that puts them in the web registry.
 */

import { registerComponentDefaults, type TableConfig } from "@asheeui/core";

export type { ColumnDef, TableConfig, TableVariant } from "@asheeui/core";

/**
 * Default config values registered for the Table component.
 */
export const defaultTableConfig: TableConfig = {
  size: "md",
  variant: "grid",
};

registerComponentDefaults("table", defaultTableConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_TABLE_CONFIG: Required<TableConfig> = {
  size: "md",
  variant: "grid",
  color: "primary",
  radius: "md",
  className: "",
  headerClassName: "",
  rowClassName: "",
  cellClassName: "",
} as const;
