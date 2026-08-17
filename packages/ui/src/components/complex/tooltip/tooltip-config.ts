import type { Radius, ResponsiveValue, ShadowConfig } from "@ashee/theme";
import type { AnimationProp } from "../../../libs/motion/types";
import type { Color, Variant } from "../../../shared/variant";

export type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export type TooltipSizeKey = "sm" | "md" | "lg";

export interface TooltipSizeValue {
  paddingX: ResponsiveValue<string>;
  paddingY: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface TooltipSizeScale {
  default: TooltipSizeKey;
  values: Record<TooltipSizeKey, TooltipSizeValue>;
}

export interface TooltipConfig {
  variant?: Variant;
  color?: Color;
  size?: TooltipSizeScale;
  placement?: TooltipPlacement;
  delay?: number | { open?: number; close?: number };
  offset?: number;
  radius?: keyof Radius;
  shadow?: keyof ShadowConfig["values"];
  animation?: AnimationProp;
  showArrow?: boolean;
  className?: string;
}
