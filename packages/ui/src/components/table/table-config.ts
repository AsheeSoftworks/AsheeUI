import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";

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

export interface TableConfig {
  size?: TableSizeKey;
  variant?: TableVariant;
  color?: Color;
  radius?: keyof Radius;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export const defaultTableConfig: TableConfig = {
  size: "md",
  variant: "default",
};

export const FALLBACK_TABLE_CONFIG = {
  size: "md" as TableSizeKey,
  variant: "default" as TableVariant,
  color: "primary" as Color,
  radius: "md" as keyof Radius,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    table: TableConfig;
  }
}

registerComponentDefaults("table", defaultTableConfig);
