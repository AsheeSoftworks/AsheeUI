import type { TargetAndTransition, Transition, Variants } from "framer-motion";

/** All available preset keys in the library */
export type BaseAnimationPreset =
  | "none"
  | "scale"
  | "lift"
  | "fade"
  | "bounce"
  | "slide"
  | "zoom"
  | "pop";

export type SurfaceAnimationPreset = "none" | "fade" | "slide" | "zoom" | "pop";

// ─── Core Animation Interfaces ───────────────────────────────────────────────

export interface AnimationPreset {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  initial?: TargetAndTransition | string;
  animate?: TargetAndTransition | string;
  exit?: TargetAndTransition | string;
  variants?: Variants;
  transition?: Transition;
}

/**
 * Accepts constrained preset strings based on `TPresets`,
 * custom Framer Motion objects/variants, or boolean toggles.
 */
export type AnimationProp<TPresets extends string = BaseAnimationPreset> =
  | TPresets
  | AnimationPreset
  | Variants
  | boolean;
