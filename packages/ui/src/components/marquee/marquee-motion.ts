import type { MarqueeSpeedPreset } from "./marquee-config";
import { MARQUEE_SPEED_PRESETS } from "./marquee-styles";

export interface ResolvedMarqueeMotion {
  durationSeconds: number;
  isDisabled: boolean;
}

export function resolveMarqueeMotion(
  speed: MarqueeSpeedPreset | number | undefined,
  enableAnimationsSetting = true,
): ResolvedMarqueeMotion {
  if (enableAnimationsSetting === false) {
    return { durationSeconds: 0, isDisabled: true };
  }

  if (typeof speed === "number") {
    return { durationSeconds: speed, isDisabled: false };
  }

  const preset = speed && speed in MARQUEE_SPEED_PRESETS ? speed : "normal";
  return { durationSeconds: MARQUEE_SPEED_PRESETS[preset], isDisabled: false };
}
