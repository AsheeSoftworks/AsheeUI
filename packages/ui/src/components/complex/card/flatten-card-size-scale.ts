import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { CardSizeScale } from "./card-config";

export function flattenCardSizeScale(
  scale: CardSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-card-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-card-${key}-padding-y`] = v.paddingY;
    vars[`--ashee-card-${key}-gap`] = v.gap;
  }
  return vars;
}
