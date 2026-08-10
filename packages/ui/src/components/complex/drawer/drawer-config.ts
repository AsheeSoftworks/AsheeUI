import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";

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
  animation?: AnimationProp;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}
