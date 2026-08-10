import type { ResponsiveValue } from "@ashee/theme";
import type { HeadingConfig } from "./heading-config";

export function flattenHeadingSizeScale(
  levels: HeadingConfig["levels"],
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  if (!levels) return vars;
  for (const [level, style] of Object.entries(levels))
    vars[`--ashee-heading-h${level}-font-size`] = style.fontSize;
  return vars;
}
