import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { AccordionSizeScale } from "./accordion-config";

export function flattenAccordionSizeScale(
  scale: AccordionSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-accordion-${key}-padding-x`] = v.paddingX;
    vars[`--ashee-accordion-${key}-padding-y`] = v.paddingY;
    vars[`--ashee-accordion-${key}-font-s`] = v.fontSize;
  }
  return vars;
}
