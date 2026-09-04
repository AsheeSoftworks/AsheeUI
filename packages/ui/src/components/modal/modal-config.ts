import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";

export type ModalPosition = "center" | "top" | "bottom";
export type ModalSizeKey = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalConfig {
  size?: ModalSizeKey;
  position?: ModalPosition;
  radius?: Radius;
  animated?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export const defaultModalConfig: ModalConfig = {
  size: "md",
  position: "center",
  animated: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
};

export const FALLBACK_MODAL_CONFIG: Required<ModalConfig> = {
  size: "md",
  position: "center",
  radius: "lg",
  animated: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    modal: ModalConfig;
  }
}

registerComponentDefaults("modal", defaultModalConfig);
