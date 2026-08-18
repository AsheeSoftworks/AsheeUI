import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { DrawerSizeScale } from "./drawer-config";

export function flattenDrawerSizeScale(
  scale: DrawerSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    if (v.width) vars[`--ashee-drawer-${key}-width`] = v.width;
    if (v.height) vars[`--ashee-drawer-${key}-height`] = v.height;
  }
  return vars;
}
