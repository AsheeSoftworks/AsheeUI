import type { ResponsiveValue } from "@ashee/theme";
import type { TooltipSizeScale } from "./tooltip-config";

export function flattenTooltipSizeScale(
  scale: TooltipSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-tooltip-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-tooltip-${key}-padding-y`] = v.paddingY;
    vars[`--ashee-tooltip-${key}-font-size`] = v.fontSize;
  }
  return vars;
}
