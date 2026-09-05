import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";

export type ChipVariant = Exclude<Variant, "underlined">;
export type ChipSizeKey = Size;
export type ChipRadiusKey = Radius;

export interface ChipConfig {
  variant?: ChipVariant;
  color?: Color;
  size?: ChipSizeKey;
  radius?: ChipRadiusKey;
  className?: string;
}

export const defaultChipConfig: ChipConfig = {
  size: "md",
  radius: "full",
};

export const FALLBACK_CHIP_CONFIG: Required<ChipConfig> = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "full",
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    chip: ChipConfig;
  }
}

registerComponentDefaults("chip", defaultChipConfig);
