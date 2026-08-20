import type { AnimationProp } from "../../motion/types";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Variant } from "../../shared/variant";
import type { ShadowConfig } from "../../theme/shadow/shadow-config";
import type { Radius } from "../../theme/token/radius/radius-config";

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

export interface TooltipConfig {
  variant?: Variant;
  color?: Color;
  size?: TooltipSizeKey;
  placement?: TooltipPlacement;
  delay?: number | { open?: number; close?: number };
  offset?: number;
  radius?: keyof Radius;
  shadow?: keyof ShadowConfig["values"];
  animation?: AnimationProp;
  showArrow?: boolean;
  className?: string;
}

export const defaultTooltipConfig: TooltipConfig = {
  size: "md",
  placement: "top",
  delay: 200,
  offset: 8,
  animation: "scale",
  showArrow: false,
};

export const FALLBACK_TOOLTIP_CONFIG = {
  size: "md" as TooltipSizeKey,
  placement: "top" as TooltipPlacement,
  variant: "solid" as Variant,
  color: "secondary" as Color,
  delay: 200,
  offset: 8,
  radius: "md" as keyof Radius,
  shadow: "md" as keyof ShadowConfig["values"],
  animation: "scale" as AnimationProp,
  showArrow: false,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    tooltip: TooltipConfig;
  }
}

registerComponentDefaults("tooltip", defaultTooltipConfig);
