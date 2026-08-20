import type { Transition, Variants } from "framer-motion";
import type {
  ModalAnimation,
  ModalAnimationPreset,
  ModalPosition,
} from "./modal-config";

// ─── Preset Motion Variants ──────────────────────────────────────────────────

/** Pop in from center with scale scale-up. */
export const modalScaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/** Slide in from slightly below. Ideal for center and bottom modals. */
export const modalSlideUpVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
};

/** Slide in from slightly above. Ideal for top modals. */
export const modalSlideDownVariants: Variants = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

/** Pure fade transition without spatial movement. */
export const modalFadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Drop down from top with momentum. */
export const modalDropVariants: Variants = {
  initial: { opacity: 0, y: -40, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.96 },
};

/** 3D Perspective Flip effect. */
export const modalFlipVariants: Variants = {
  initial: { opacity: 0, rotateX: -12, scale: 0.96 },
  animate: { opacity: 1, rotateX: 0, scale: 1 },
  exit: { opacity: 0, rotateX: 8, scale: 0.96 },
};

/** 3D Perspective Pop effect. */
export const modalPopVariants: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// ─── Resolver ────────────────────────────────────────────────────────────────

export interface ResolvedModalMotion {
  variants?: Variants;
  initial?: string | boolean;
  animate?: string | boolean;
  exit?: string | boolean;
  transition?: Transition;
}

// Preset mapping
const MODAL_PRESETS: Record<ModalAnimationPreset, Variants> = {
  scale: modalScaleVariants,
  zoom: modalScaleVariants,
  "slide-up": modalSlideUpVariants,
  "slide-down": modalSlideDownVariants,
  fade: modalFadeVariants,
  drop: modalDropVariants,
  flip: modalFlipVariants,
  pop: modalPopVariants,
};

const defaultTransition: Transition = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1],
  duration: 0.2,
};

/**
 * Resolves animation props into position-aware motion parameters for Modals.
 */
export function resolveModalAnimation(
  animation: ModalAnimation | undefined,
  position: ModalPosition = "center",
  enableAnimations: boolean = true,
): ResolvedModalMotion {
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
  if (typeof animation === "string" && animation in MODAL_PRESETS) {
    return {
      variants: MODAL_PRESETS[animation as ModalAnimationPreset],
      initial: "initial",
      animate: "animate",
      exit: "exit",
      transition: defaultTransition,
    };
  }

  // 4. Default position-aware behavior (when animation is true or undefined)
  const defaultVariants =
    position === "top"
      ? modalSlideDownVariants
      : position === "bottom"
        ? modalSlideUpVariants
        : modalScaleVariants;

  return {
    variants: defaultVariants,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: defaultTransition,
  };
}
