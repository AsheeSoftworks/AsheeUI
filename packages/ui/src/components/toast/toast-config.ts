import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Variant } from "../../shared/variant";

export type ToastType = "success" | "error" | "info" | "warning" | "default";
export type ToastPlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";
export type ToastSizeKey = Size;

export interface ToastItemData {
  id: string;
  title?: ReactNode;
  message: ReactNode;
  type?: ToastType;
  timeout?: number;
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
}

export interface ToastConfig {
  size?: ToastSizeKey;
  placement?: ToastPlacement;
  variant?: Variant;
  radius?: Radius;
  animated?: boolean;
  defaultTimeout?: number;
  maxToasts?: number;
}

export const defaultToastConfig: ToastConfig = {
  size: "md",
  placement: "top-right",
  variant: "bordered",
  radius: "md",
  animated: true,
  defaultTimeout: 3500,
  maxToasts: 5,
};

export const FALLBACK_TOAST_CONFIG = {
  size: "md" as ToastSizeKey,
  placement: "top-right" as ToastPlacement,
  variant: "solid" as Variant,
  radius: "md" as Radius,
  animated: true,
  defaultTimeout: 3500,
  maxToasts: 5,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    toast: ToastConfig;
  }
}

registerComponentDefaults("toast", defaultToastConfig);
