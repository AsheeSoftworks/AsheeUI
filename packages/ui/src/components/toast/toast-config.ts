import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { AnimationProp } from "../../motion/types";
import type { Variant } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";

export type ToastType = "success" | "error" | "info" | "warning" | "default";
export type ToastPlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";
export type ToastSizeKey = "sm" | "md" | "lg";

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
  radius?: keyof Radius;
  animation?: AnimationProp;
  defaultTimeout?: number;
  maxToasts?: number;
  className?: string;
  itemClassName?: string;
}

export const defaultToastConfig: ToastConfig = {
  size: "md",
  placement: "top-right",
  variant: "solid",
  radius: "md",
  animation: "slide",
  defaultTimeout: 3500,
  maxToasts: 5,
};

export const FALLBACK_TOAST_CONFIG = {
  size: "md" as ToastSizeKey,
  placement: "top-right" as ToastPlacement,
  variant: "solid" as Variant,
  radius: "md" as keyof Radius,
  animation: "slide" as AnimationProp,
  defaultTimeout: 3500,
  maxToasts: 5,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    toast: ToastConfig;
  }
}

registerComponentDefaults("toast", defaultToastConfig);
