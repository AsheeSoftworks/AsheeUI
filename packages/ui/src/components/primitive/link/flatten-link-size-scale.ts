import type { ResponsiveValue } from "@ashee/theme";
import type { LinkSizeScale } from "./link-config";

export function flattenLinkSizeScale(
  scale: LinkSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-link-${key}-font-s`] = v.fontSize;
    vars[`--ashee-link-${key}-gap`] = v.gap;
    vars[`--ashee-link-${key}-icon-s`] = v.iconSize;
  }
  return vars;
}
