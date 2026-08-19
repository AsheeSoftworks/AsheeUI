import type { Transition, Variants } from "framer-motion";
import type { Radius } from "../../../theme/token/radius/radius-config";

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

export interface DrawerConfig {
  size?: DrawerSizeKey;
  placement?: DrawerPlacement;
  radius?: keyof Radius;
  animation?: DrawerAnimation;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

export const defaultDrawerConfig: DrawerConfig = {
  size: "md",
  placement: "right",
  animation: "slide",
  closeOnOverlayClick: true,
  closeOnEsc: true,
};

export const FALLBACK_DRAWER_CONFIG = {
  size: "md",
  placement: "right",
  radius: "none",
  animation: "slide",
  closeOnOverlayClick: true,
  closeOnEsc: true,
} as const;
