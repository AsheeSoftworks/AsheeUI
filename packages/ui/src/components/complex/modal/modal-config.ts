import type { Transition, Variants } from "framer-motion";
import type { Radius } from "../../../theme/token/radius/radius-config";

export type ModalAnimationPreset =
  | "scale"
  | "zoom"
  | "slide-up"
  | "slide-down"
  | "fade"
  | "drop"
  | "flip"
  | "pop";

export type ModalAnimation =
  | boolean
  | ModalAnimationPreset
  | {
      variants?: Variants;
      transition?: Transition;
    };

export type ModalSizeKey = "sm" | "md" | "lg" | "xl" | "full";
export type ModalPosition = "center" | "top" | "bottom";

export interface ModalConfig {
  size?: ModalSizeKey;
  position?: ModalPosition;
  radius?: keyof Radius;
  animation?: ModalAnimationPreset;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

export const defaultModalConfig: ModalConfig = {
  size: "md",
  position: "center",
  animation: "pop",
  closeOnBackdropClick: true,
  closeOnEscape: true,
};

export const FALLBACK_MODAL_CONFIG = {
  size: "md",
  position: "center",
  radius: "lg",
  animation: "pop",
  closeOnBackdropClick: true,
  closeOnEscape: true,
} as const;
