import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";

export type DrawerPlacement = "right" | "left" | "top" | "bottom";
export type DrawerSize = Size | "full";

export interface DrawerConfig {
  size?: DrawerSize;
  placement?: DrawerPlacement;
  radius?: Radius;
  animated?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export const defaultDrawerConfig: DrawerConfig = {
  size: "md",
  placement: "right",
  radius: "none",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
};

export const FALLBACK_DRAWER_CONFIG: Required<DrawerConfig> = {
  size: "md",
  placement: "right",
  radius: "none",
  animated: true,
  closeOnOverlayClick: true,
  closeOnEsc: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    drawer: DrawerConfig;
  }
}

registerComponentDefaults("drawer", defaultDrawerConfig);
