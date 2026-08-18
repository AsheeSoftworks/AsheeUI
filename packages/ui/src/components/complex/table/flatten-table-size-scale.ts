import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { TableSizeScale } from "./table-config";

export function flattenTableSizeScale(
  scale: TableSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-table-${key}-py`] = v.cellPaddingY;
    vars[`--ashee-table-${key}-px`] = v.cellPaddingX;
    vars[`--ashee-table-${key}-font-s`] = v.fontSize;
    vars[`--ashee-table-${key}-header-font-s`] = v.headerFontSize;
  }
  return vars;
}
