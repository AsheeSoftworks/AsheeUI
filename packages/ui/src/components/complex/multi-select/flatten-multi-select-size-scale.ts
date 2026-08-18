import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { MultiSelectSizeScale } from "./multi-select-config";

export function flattenMultiSelectSizeScale(
  scale: MultiSelectSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-multi-select-${key}-height`] = v.height;
    vars[`--ashee-multi-select-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-multi-select-${key}-font-s`] = v.fontSize;
  }
  return vars;
}
