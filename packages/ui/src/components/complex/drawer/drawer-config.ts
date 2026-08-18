import type { Transition, Variants } from "framer-motion";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";

export type DrawerAnimationPreset = "slide" | "zoom" | "fade";

export type DrawerAnimation =
  | boolean
  | DrawerAnimationPreset
  | {
      variants?: Variants;
      transition?: Transition;
    };

export type DrawerPlacement = "right" | "left" | "top" | "bottom";
export type DrawerSizeKey = "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerSizeValue {
  width?: ResponsiveValue<string>;
  height?: ResponsiveValue<string>;
}

export interface DrawerSizeScale {
  default: DrawerSizeKey;
  values: Record<DrawerSizeKey, DrawerSizeValue>;
}

export interface DrawerConfig {
  size?: DrawerSizeScale;
  placement?: DrawerPlacement;
  radius?: keyof Radius;
  animation?: DrawerAnimation;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}
