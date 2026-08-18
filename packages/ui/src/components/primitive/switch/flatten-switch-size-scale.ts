import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
import type { SwitchSizeScale } from "./switch-config";

export function flattenSwitchSizeScale(
  scale: SwitchSizeScale,
): Record<string, ResponsiveValue<string>> {
  const vars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, v] of Object.entries(scale.values)) {
    vars[`--ashee-switch-${key}-track-w`] = v.trackWidth;
    vars[`--ashee-switch-${key}-track-h`] = v.trackHeight;
    vars[`--ashee-switch-${key}-thumb-s`] = v.thumbSize;
    vars[`--ashee-switch-${key}-thumb-t`] = v.thumbTranslate;
    vars[`--ashee-switch-${key}-font-s`] = v.fontSize;
  }
  return vars;
}
