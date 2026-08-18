import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";

export type ChipSizeKey = "sm" | "md" | "lg";

export type ChipVariant = Exclude<Variant, "underlined">;

export interface ChipSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
  gap: ResponsiveValue<string>;
  iconSize: ResponsiveValue<string>;
}

export interface ChipSizeScale {
  default: ChipSizeKey;
  values: Record<ChipSizeKey, ChipSizeValue>;
}

export interface ChipConfig {
  variant?: ChipVariant;
  color?: Color;
  size?: ChipSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
}
