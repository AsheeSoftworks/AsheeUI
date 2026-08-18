import type { AnimationPreset, BaseAnimationPreset } from "./types";

export const animationPresets: Record<BaseAnimationPreset, AnimationPreset> = {
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
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    whileHover: { opacity: 0.85 },
    whileTap: { opacity: 0.7 },
    transition: { duration: 0.15, ease: "easeOut" },
  },
  bounce: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.9 },
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  slide: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2, ease: "easeOut" },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" },
  },
  pop: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 420, damping: 25 },
  },
};
