import {
  type AnimationPreset,
  type AnimationPresetName,
  animationPresets,
} from "../presets";

export type AnimationProp = AnimationPresetName | AnimationPreset;

export function resolveAnimation(
  animation: AnimationProp | undefined,
  enableAnimations: boolean,
): AnimationPreset {
  if (!enableAnimations) return animationPresets.none;
  if (!animation) return animationPresets.scale;
  return typeof animation === "string"
    ? animationPresets[animation]
    : animation;
}
