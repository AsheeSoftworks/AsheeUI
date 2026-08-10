import { animationPresets } from "./presets";
import type {
  AnimationPreset,
  AnimationProp,
  BaseAnimationPreset,
} from "./types";

/**
  Resolves any input (preset string, boolean, custom Framer Motion object)
  into a valid Framer Motion configuration object without breaking existing callers.
 */
export function resolveAnimation(
  animation: AnimationProp | undefined,
  enableAnimations = true,
  defaultPreset: BaseAnimationPreset = "scale",
): AnimationPreset {
  // Global settings override or boolean `false` / `"none"`
  if (!enableAnimations || animation === false || animation === "none") {
    return animationPresets.none;
  }

  // Boolean `true` or `undefined` falls back to the requested or default preset
  if (animation === undefined || animation === true) {
    return animationPresets[defaultPreset] ?? animationPresets.scale;
  }

  // String lookup matching preset keys
  if (typeof animation === "string") {
    return (
      animationPresets[animation as BaseAnimationPreset] ??
      animationPresets[defaultPreset] ??
      animationPresets.none
    );
  }

  // Direct Framer Motion Variants or custom AnimationPreset object
  if (typeof animation === "object") {
    return animation as AnimationPreset;
  }

  return animationPresets.none;
}
