import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { ToastSizeScale } from "./toast-config";

export function flattenToastSizeScale(
  scale: ToastSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-toast-${key}-width`] = v.width;
    vars[`--ashee-toast-${key}-padding`] = v.padding;
    vars[`--ashee-toast-${key}-font-s`] = v.fontSize;
    vars[`--ashee-toast-${key}-title-font-s`] = v.titleFontSize;
  }
  return vars;
}
