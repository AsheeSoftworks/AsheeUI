import type { Transition, Variants } from "framer-motion";
import type {
  DrawerAnimation,
  DrawerAnimationPreset,
  DrawerPlacement,
} from "./drawer-config";

// ─── Preset Motion Variants ──────────────────────────────────────────────────

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

export const drawerFadeVariants: Record<DrawerPlacement, Variants> = {
  right: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  left: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  top: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  bottom: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

// ─── Resolver ────────────────────────────────────────────────────────────────

export interface ResolvedDrawerMotion {
  variants?: Variants;
  initial?: string | boolean;
  animate?: string | boolean;
  exit?: string | boolean;
  transition?: Transition;
}

// Preset mapping
const DRAWER_PRESETS: Record<
  DrawerAnimationPreset,
  Record<DrawerPlacement, Variants>
> = {
  slide: drawerSlideVariants,
  zoom: drawerZoomVariants,
  fade: drawerFadeVariants,
};

const defaultTransition: Transition = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1], // Natural ease-out curve matching modal
  duration: 0.25,
};

/**
 * Resolves animation props into placement-aware motion parameters for Drawers.
 */
export function resolveDrawerAnimation(
  animation: DrawerAnimation | undefined,
  placement: DrawerPlacement = "right",
  enableAnimations: boolean = true,
): ResolvedDrawerMotion {
  // 1. Globally disabled or explicitly false
  if (!enableAnimations || animation === false) {
    return {};
  }

  // 2. Custom Framer Motion object escape hatch
  if (typeof animation === "object" && animation !== null) {
    return {
      variants: animation.variants,
      initial: "initial",
      animate: "animate",
      exit: "exit",
      transition: animation.transition ?? defaultTransition,
    };
  }

  // 3. Explicit preset string
  if (typeof animation === "string" && animation in DRAWER_PRESETS) {
    return {
      variants: DRAWER_PRESETS[animation as DrawerAnimationPreset][placement],
      initial: "initial",
      animate: "animate",
      exit: "exit",
      transition: defaultTransition,
    };
  }

  // 4. Default placement-aware slide behavior (when animation is true or undefined)
  return {
    variants: drawerSlideVariants[placement],
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: defaultTransition,
  };
}
