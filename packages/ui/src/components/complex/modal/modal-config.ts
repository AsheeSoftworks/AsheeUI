import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";

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
  animation?: AnimationProp;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}
