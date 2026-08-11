import type { ResponsiveValue } from "@ashee/theme";
import type { ChipSizeScale } from "./chip-config";

export function flattenChipSizeScale(
  scale: ChipSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-chip-${key}-h`] = v.height;
    vars[`--ashee-chip-${key}-px`] = v.paddingX;
    vars[`--ashee-chip-${key}-font-s`] = v.fontSize;
    vars[`--ashee-chip-${key}-gap`] = v.gap;
    vars[`--ashee-chip-${key}-icon-s`] = v.iconSize;
  }
  return vars;
}
