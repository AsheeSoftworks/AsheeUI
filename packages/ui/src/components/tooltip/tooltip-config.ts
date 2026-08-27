import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

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

export type TooltipSizeKey = "sm" | "md" | "lg" | "xl";

export interface TooltipConfig {
  variant?: Variant;
  color?: Color;
  size?: TooltipSizeKey;
  placement?: TooltipPlacement;
  delay?: number | { open?: number; close?: number };
  offset?: number;
  radius?: Radius;
  showArrow?: boolean;
  className?: string;
}

export const defaultTooltipConfig: TooltipConfig = {
  size: "md",
  placement: "top",
  delay: 200,
  offset: 8,
  showArrow: false,
};

export const FALLBACK_TOOLTIP_CONFIG: Required<TooltipConfig> = {
  size: "md" as TooltipSizeKey,
  placement: "top" as TooltipPlacement,
  variant: "solid" as Variant,
  color: "secondary" as Color,
  delay: 200,
  offset: 8,
  radius: "md" as Radius,
  showArrow: false,
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    tooltip: TooltipConfig;
  }
}

registerComponentDefaults("tooltip", defaultTooltipConfig);
