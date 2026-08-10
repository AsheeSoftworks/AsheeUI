import type { ResponsiveValue } from "@ashee/theme";
import type { ButtonSizeScale } from "./button-config";

export function flattenButtonSizeScale(
  scale: ButtonSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-button-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-button-${key}-padding-y`] = v.paddingY;
    vars[`--ashee-button-${key}-font-size`] = v.fontSize;
    vars[`--ashee-button-${key}-gap`] = v.gap;
  }
  return vars;
}
