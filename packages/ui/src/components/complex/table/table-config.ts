import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { ReactNode } from "react";
import type { Color } from "../../../shared/variant";

export type TableSizeKey = "sm" | "md" | "lg";
export type TableVariant = "default" | "striped" | "bordered" | "flush";

export interface ColumnDef<TData> {
  /** Optional explicit key for React list rendering. */
  id?: string;
  /** Header content or title. */
  header: ReactNode;
  /** Cell renderer function. */
  cell: (row: TData) => ReactNode;
}

export interface TableSizeValue {
  cellPaddingY: ResponsiveValue<string>;
  cellPaddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
  headerFontSize: ResponsiveValue<string>;
}

export interface TableSizeScale {
  default: TableSizeKey;
  values: Record<TableSizeKey, TableSizeValue>;
}

export interface TableConfig {
  size?: TableSizeScale;
  variant?: TableVariant;
  color?: Color;
  radius?: keyof Radius;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}
