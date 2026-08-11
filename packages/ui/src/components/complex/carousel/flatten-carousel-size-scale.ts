import type { ResponsiveValue } from "@ashee/theme";
import type { CarouselSizeScale } from "./carousel-config";

export function flattenCarouselSizeScale(
  scale: CarouselSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-carousel-${key}-height`] = v.height;
    vars[`--ashee-carousel-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-carousel-${key}-padding-y`] = v.paddingY;
  }
  return vars;
}
