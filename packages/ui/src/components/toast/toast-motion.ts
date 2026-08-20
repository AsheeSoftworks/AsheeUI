import type { TargetAndTransition } from "framer-motion";
import type { ToastPlacement } from "./toast-config";

export function getToastMotionVariants(placement: ToastPlacement): {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
} {
  switch (placement) {
    case "top-right":
    case "bottom-right":
      return {
        initial: { x: 80, opacity: 0, scale: 0.95 },
        animate: { x: 0, opacity: 1, scale: 1 },
        exit: { x: 80, opacity: 0, scale: 0.9 },
      };
    case "top-left":
    case "bottom-left":
      return {
        initial: { x: -80, opacity: 0, scale: 0.95 },
        animate: { x: 0, opacity: 1, scale: 1 },
        exit: { x: -80, opacity: 0, scale: 0.9 },
      };
    case "top-center":
      return {
        initial: { y: -50, opacity: 0, scale: 0.95 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: -50, opacity: 0, scale: 0.9 },
      };
    case "bottom-center":
      return {
        initial: { y: 50, opacity: 0, scale: 0.95 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: 50, opacity: 0, scale: 0.9 },
      };
  }
}
