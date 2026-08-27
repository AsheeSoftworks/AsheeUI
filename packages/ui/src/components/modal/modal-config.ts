import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";

export type ModalAnimationPreset =
  | "scale"
  | "zoom"
  | "slide-up"
  | "slide-down"
  | "fade"
  | "drop"
  | "flip"
  | "pop"
  | "none";

export type ModalSizeKey = "sm" | "md" | "lg" | "xl" | "full";
export type ModalPosition = "center" | "top" | "bottom";

export interface ModalConfig {
  size?: ModalSizeKey;
  position?: ModalPosition;
  radius?: Radius;
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

export const FALLBACK_MODAL_CONFIG: Required<ModalConfig> = {
  size: "md",
  position: "center",
  radius: "lg",
  animation: "pop",
  closeOnBackdropClick: true,
  closeOnEscape: true,
  className: "",
  overlayClassName: "",
  contentClassName: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    modal: ModalConfig;
  }
}

registerComponentDefaults("modal", defaultModalConfig);
