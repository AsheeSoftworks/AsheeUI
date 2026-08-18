import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { ShadowConfig } from "../../../theme/shadow/shadow-config";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";

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
