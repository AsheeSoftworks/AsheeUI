import type { ResponsiveValue } from "@ashee/theme";
import type { FieldSizeScale } from "./field-config";

export function flattenFieldSizeScale(
  prefix: string,
  scale: FieldSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-${prefix}-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-${prefix}-${key}-padding-y`] = v.paddingY;
    vars[`--ashee-${prefix}-${key}-font-size`] = v.fontSize;
  }
  return vars;
}
