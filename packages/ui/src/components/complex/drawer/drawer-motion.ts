import type { Variants } from "framer-motion";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationPreset, AnimationProp } from "../../../motion/types";
import type { DrawerPlacement } from "./drawer-config";

export const drawerSlideVariants: Record<DrawerPlacement, Variants> = {
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  left: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  top: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  bottom: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
};

export const drawerZoomVariants: Record<DrawerPlacement, Variants> = {
  right: {
    initial: { x: "20%", scale: 0.95, opacity: 0 },
    animate: { x: 0, scale: 1, opacity: 1 },
    exit: { x: "20%", scale: 0.95, opacity: 0 },
  },
  left: {
    initial: { x: "-20%", scale: 0.95, opacity: 0 },
    animate: { x: 0, scale: 1, opacity: 1 },
    exit: { x: "-20%", scale: 0.95, opacity: 0 },
  },
  top: {
    initial: { y: "-20%", scale: 0.95, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: { y: "-20%", scale: 0.95, opacity: 0 },
  },
  bottom: {
    initial: { y: "20%", scale: 0.95, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: { y: "20%", scale: 0.95, opacity: 0 },
  },
};

/** Resolves animation props into placement-aware motion parameters using @ashee/motion. */
export function resolveDrawerAnimation(
  animation: AnimationProp | undefined,
  placement: DrawerPlacement,
  enableAnimations: boolean,
): AnimationPreset {
  // Direct preset handling for placement-sensitive strings
  if (enableAnimations) {
    if (
      animation === "slide" ||
      animation === undefined ||
      animation === true
    ) {
      return {
        variants: drawerSlideVariants[placement],
        initial: "initial",
        animate: "animate",
        exit: "exit",
        transition: { type: "spring", damping: 25, stiffness: 300 },
      };
    }

    if (animation === "zoom") {
      return {
        variants: drawerZoomVariants[placement],
        initial: "initial",
        animate: "animate",
        exit: "exit",
        transition: { type: "spring", damping: 25, stiffness: 300 },
      };
    }
  }

  // Fall back to standard preset resolution (fade, none, or custom objects)
  return resolveAnimation(animation, enableAnimations, "slide");
}
