import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { SelectSizeScale } from "./select-config";

export function flattenSelectSizeScale(
  scale: SelectSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-select-${key}-height`] = v.height;
    vars[`--ashee-select-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-select-${key}-font-s`] = v.fontSize;
  }
  return vars;
}
