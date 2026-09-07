/**
 * Table component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Table
 * component, including variant, size, color, and radius options. It registers
 * the default configuration with the component registry and provides fallback
 * values for the cascade resolution system.
 */

import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size } from "../../shared";

/**
 * Visual style variant of the table.
 * - `grid`: Table with grid lines between cells.
 * - `striped`: Alternating row backgrounds.
 * - `bordered`: Table with outer border only.
 * - `ghost`: Minimal table without borders or backgrounds.
 */
export type TableVariant = "grid" | "striped" | "bordered" | "ghost";

/**
 * Column definition for the table.
 * Defines the header content and cell renderer for a column.
 */
export interface ColumnDef<TData> {
  /**
   * Optional explicit key for React list rendering.
   * Used as the key prop for the column element.
   */
  id?: string;

  /**
   * Header content or title.
   * Rendered in the table header cell.
   */
  header: ReactNode;

  /**
   * Cell renderer function.
   * Receives the row data and returns the cell content.
   */
  cell: (row: TData) => ReactNode;
}

/**
 * Theme configuration options for the Table component.
 *
 * Set under `components.table` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface TableConfig {
  /**
   * Density scale of the table.
   * Controls the padding and font size of cells.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Visual style variant.
   * Controls the table's border and background treatment.
   *
   * @default "grid"
   */
  variant?: TableVariant;

  /**
   * Theme accent color.
   * Controls the color of selected rows and interactive states.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Corner rounding.
   * Controls the border-radius of the table container.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Extra classes applied to the table container.
   */
  className?: string;

  /**
   * Extra classes applied to the table header.
   */
  headerClassName?: string;

  /**
   * Extra classes applied to table rows.
   */
  rowClassName?: string;

  /**
   * Extra classes applied to table cells.
   */
  cellClassName?: string;
}

/**
 * Default config values registered for the Table component.
 */
export const defaultTableConfig: TableConfig = {
  size: "md",
  variant: "grid",
};

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

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    table: TableConfig;
  }
}

registerComponentDefaults("table", defaultTableConfig);
