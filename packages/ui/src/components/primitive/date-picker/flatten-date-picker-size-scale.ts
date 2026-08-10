import type { ResponsiveValue } from "@ashee/theme";
import type { DatePickerSizeScale } from "./date-picker-config";

export function flattenDatePickerSizeScale(
  scale: DatePickerSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-date-picker-${key}-height`] = v.height;
    vars[`--ashee-date-picker-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-date-picker-${key}-font-s`] = v.fontSize;
    vars[`--ashee-date-picker-${key}-cell-s`] = v.cellSize;
  }
  return vars;
}
