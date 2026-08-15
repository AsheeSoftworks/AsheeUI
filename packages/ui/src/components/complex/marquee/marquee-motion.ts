import { MARQUEE_SPEED_PRESETS } from "./default-marquee-config";
import type { MarqueeSpeedPreset } from "./marquee-config";

export interface ResolvedMarqueeMotion {
  durationSeconds: number;
  isDisabled: boolean;
}

/**
 * Resolves a speed prop (preset name or raw seconds) plus the global
 * `enableAnimations` setting into a runtime duration.
 *
 * When animations are globally disabled (e.g. `prefers-reduced-motion`),
 * the loop is turned off entirely rather than just slowed down — a
 * continuously-scrolling marquee is exactly the kind of motion that
 * setting exists to suppress.
 */
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
