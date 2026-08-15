import type { TableConfig, TableSizeScale } from "./table-config";

export const defaultTableSizeScale: TableSizeScale = {
  default: "md",
  values: {
    sm: {
      cellPaddingY: { base: "0.375rem" },
      cellPaddingX: { base: "0.5rem" },
      fontSize: { base: "0.8125rem" },
      headerFontSize: { base: "0.75rem" },
    },
    md: {
      cellPaddingY: { base: "0.625rem" },
      cellPaddingX: { base: "0.75rem" },
      fontSize: { base: "0.875rem" },
      headerFontSize: { base: "0.8125rem" },
    },
    lg: {
      cellPaddingY: { base: "0.875rem" },
      cellPaddingX: { base: "1rem" },
      fontSize: { base: "1rem" },
      headerFontSize: { base: "0.875rem" },
    },
  },
};

export const defaultTableConfig: TableConfig = {
  size: defaultTableSizeScale,
  variant: "default",
  radius: "md",
};
