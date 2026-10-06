/**
 * The Table's configuration face, shared by both platforms.
 *
 * A table states the same things on both platforms: how densely its cells are set, how its
 * surface is treated, what accent it uses, how its corners are rounded, and what a consumer
 * adds to its container, its rows and its cells. Those are named here, once, so
 * `components.table` means the same thing in a web application and in a native one —
 * including on the platform, where the same contract is read by the component that renders
 * a table's rows rather than a table.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `table` here is what makes `components.table` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { ReactNode } from "react";
import type { Radius, Size } from "../../shared/radius";
import type { Color } from "../../shared/variant";

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
 *
 * A column is data rather than markup, which is what lets one table description be read by
 * a browser, which draws a column, and by a device, which draws a labelled line.
 */
export interface ColumnDef<TData = unknown> {
  /**
   * Optional explicit key for list rendering.
   * Used as the key prop for the column element.
   */
  id?: string;

  /**
   * Header content or title.
   * Rendered in the table header cell on the web, and as the line's label on the platform.
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
   * The platform has no header row — a row is a set of labelled lines — so this resolves
   * through the shared contract and changes nothing there.
   */
  headerClassName?: string;

  /**
   * Extra classes applied to rows.
   * The platform applies them to each row it draws.
   */
  rowClassName?: string;

  /**
   * Extra classes applied to cells.
   * The platform applies them to each labelled line it draws.
   */
  cellClassName?: string;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    table: TableConfig;
  }
}
