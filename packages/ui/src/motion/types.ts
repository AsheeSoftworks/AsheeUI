import type { TargetAndTransition, Transition, Variants } from "framer-motion";

/** All built-in animation preset names across gesture and surface components. */
export type BaseAnimationPreset =
  | "none"
  | "scale"
  | "lift"
  | "fade"
  | "bounce"
  | "slide"
  | "zoom"
  | "pop";

export type AnimationPresetName = BaseAnimationPreset;

/** Unified animation definition supporting interactive states and presence transitions. */
export interface AnimationPreset {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  initial?: TargetAndTransition | string;
  animate?: TargetAndTransition | string;
  exit?: TargetAndTransition | string;
  variants?: Variants;
  transition?: Transition;
}

/** Flexibly accepts preset strings, custom objects/variants, or boolean toggles. */
export type AnimationProp<TPresets extends string = BaseAnimationPreset> =
  | TPresets
  | AnimationPreset
  | Variants
  | boolean;
