import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { TabsSizeScale } from "./tabs-config";

export function flattenTabsSizeScale(
  scale: TabsSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-tabs-${key}-height`] = v.height;
    vars[`--ashee-tabs-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-tabs-${key}-font-s`] = v.fontSize;
  }
  return vars;
}
