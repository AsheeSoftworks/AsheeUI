import type { ResponsiveValue } from "@ashee/theme";
import type { RadioSizeScale } from "./radio-config";

export function flattenRadioSizeScale(
  scale: RadioSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-radio-${key}-outer-s`] = v.outerSize;
    vars[`--ashee-radio-${key}-inner-s`] = v.innerSize;
    vars[`--ashee-radio-${key}-font-s`] = v.fontSize;
    vars[`--ashee-radio-${key}-gap`] = v.gap;
  }
  return vars;
}
