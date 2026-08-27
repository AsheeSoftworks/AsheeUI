import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";

export type DrawerPlacement = "right" | "left" | "top" | "bottom";
export type DrawerSize = Size | "full";
export type DrawerAnimation = "slide" | "zoom" | "fade" | boolean;

export interface DrawerConfig {
  size?: DrawerSize;
  placement?: DrawerPlacement;
  radius?: Radius;
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
  radius: "none",
  animation: "slide",
  closeOnOverlayClick: true,
  closeOnEsc: true,
};

export const FALLBACK_DRAWER_CONFIG: Required<DrawerConfig> = {
  size: "md",
  placement: "right",
  radius: "none",
  animation: "slide",
  closeOnOverlayClick: true,
  closeOnEsc: true,
  className: "",
  overlayClassName: "",
  contentClassName: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    drawer: DrawerConfig;
  }
}

registerComponentDefaults("drawer", defaultDrawerConfig);
