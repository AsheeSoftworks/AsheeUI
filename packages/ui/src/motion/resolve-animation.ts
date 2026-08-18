import { animationPresets } from "./presets";
import type {
  AnimationPreset,
  AnimationProp,
  BaseAnimationPreset,
} from "./types";

export function resolveAnimation<
  TPreset extends BaseAnimationPreset = BaseAnimationPreset,
>(
  animation: AnimationProp<TPreset> | undefined,
  enableAnimations = true,
  defaultPreset: TPreset = "scale" as TPreset,
): AnimationPreset {
  // Global setting disabled or explicitly turned off
  if (!enableAnimations || animation === false || animation === "none") {
    return animationPresets.none;
  }

  // Boolean `true` or `undefined` falls back to default preset
  if (animation === undefined || animation === true) {
    return animationPresets[defaultPreset] ?? animationPresets.scale;
  }

  // String preset lookup
  if (typeof animation === "string") {
    return (
      animationPresets[animation as BaseAnimationPreset] ??
      animationPresets[defaultPreset] ??
      animationPresets.none
    );
  }

  // Custom object / variants escape hatch
  if (typeof animation === "object") {
    return animation as AnimationPreset;
  }

  return animationPresets.none;
}
