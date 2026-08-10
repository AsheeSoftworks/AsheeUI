import type { ResponsiveValue } from "@ashee/theme";
import type { ButtonDropdownSizeScale } from "./button-dropdown-config";

export function flattenButtonDropdownSizeScale(
  scale: ButtonDropdownSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-button-dropdown-${key}-height`] = v.height;
    vars[`--ashee-button-dropdown-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-button-dropdown-${key}-font-s`] = v.fontSize;
  }
  return vars;
}
