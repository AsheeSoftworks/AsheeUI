import type { TargetAndTransition, Transition } from "framer-motion";

export type AnimationPresetName = "none" | "scale" | "lift" | "fade" | "bounce";

export interface AnimationPreset {
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  transition?: Transition;
}

export const animationPresets: Record<AnimationPresetName, AnimationPreset> = {
  none: {},
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15, ease: "easeOut" },
  },
  lift: {
    whileHover: { y: -2, boxShadow: "0 8px 16px -4px rgb(0 0 0 / 0.2)" },
    whileTap: { y: 0 },
    transition: { duration: 0.15, ease: "easeOut" },
  },
  fade: {
    whileHover: { opacity: 0.85 },
    whileTap: { opacity: 0.7 },
    transition: { duration: 0.1 },
  },
  bounce: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.9 },
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};
