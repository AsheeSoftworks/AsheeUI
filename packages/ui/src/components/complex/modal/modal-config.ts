import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { Transition, Variants } from "framer-motion";

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

export interface ModalSizeValue {
  maxWidth: ResponsiveValue<string>;
  padding: ResponsiveValue<string>;
  radius: ResponsiveValue<string>;
}

export interface ModalSizeScale {
  default: ModalSizeKey;
  values: Record<ModalSizeKey, ModalSizeValue>;
}

export interface ModalConfig {
  size?: ModalSizeScale;
  position?: ModalPosition;
  radius?: keyof Radius;
  animation?: ModalAnimationPreset;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}
