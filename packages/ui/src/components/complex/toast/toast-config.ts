import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { ReactNode } from "react";
import type { AnimationProp } from "../../../motion/types";
import type { Variant } from "../../../shared/variant";

export type ToastType = "success" | "error" | "info" | "warning" | "default";
export type ToastPlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";
export type ToastSizeKey = "sm" | "md" | "lg";
export type ToastVariant = "solid" | "flat" | "bordered";

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

export interface ToastSizeValue {
  width: ResponsiveValue<string>;
  padding: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
  titleFontSize: ResponsiveValue<string>;
}

export interface ToastSizeScale {
  default: ToastSizeKey;
  values: Record<ToastSizeKey, ToastSizeValue>;
}

export interface ToastConfig {
  size?: ToastSizeScale;
  placement?: ToastPlacement;
  variant?: Variant;
  radius?: keyof Radius;
  animation?: AnimationProp;
  defaultTimeout?: number;
  maxToasts?: number;
  className?: string;
  itemClassName?: string;
}
