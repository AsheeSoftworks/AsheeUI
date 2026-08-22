import { registerComponentDefaults } from "../../libs/registry";
import type { AnimationProp } from "../../motion/types";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";

export type ChipSizeKey = "sm" | "md" | "lg";
export type ChipVariant = Exclude<Variant, "underlined">;

export interface ChipConfig {
  variant?: ChipVariant;
  color?: Color;
  size?: ChipSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
}

export const defaultChipConfig: ChipConfig = {
  size: "md",
  radius: "full",
  animation: "none",
};

export const FALLBACK_CHIP_CONFIG = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "full",
  animation: "none",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    chip: ChipConfig;
  }
}

registerComponentDefaults("chip", defaultChipConfig);
