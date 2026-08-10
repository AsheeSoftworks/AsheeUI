import type { ResponsiveValue } from "@ashee/theme";
import type { ModalSizeScale } from "./modal-config";

export function flattenModalSizeScale(
  scale: ModalSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-modal-${key}-max-w`] = v.maxWidth;
    vars[`--ashee-modal-${key}-p`] = v.padding;
    vars[`--ashee-modal-${key}-r`] = v.radius;
  }
  return vars;
}
