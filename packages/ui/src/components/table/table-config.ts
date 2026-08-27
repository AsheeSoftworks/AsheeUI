import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color } from "../../shared/variant";

export type TableSizeKey = Size;
export type TableVariant = "default" | "striped" | "bordered" | "flush";

export interface ColumnDef<TData> {
  /** Optional explicit key for React list rendering. */
  id?: string;
  /** Header content or title. */
  header: ReactNode;
  /** Cell renderer function. */
  cell: (row: TData) => ReactNode;
}

export interface TableConfig {
  size?: TableSizeKey;
  variant?: TableVariant;
  color?: Color;
  radius?: Radius;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export const defaultTableConfig: TableConfig = {
  size: "md",
  variant: "default",
};

export const FALLBACK_TABLE_CONFIG: Required<TableConfig> = {
  size: "md",
  variant: "default",
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
