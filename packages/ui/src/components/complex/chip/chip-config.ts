import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";

export type ChipSizeKey = "sm" | "md" | "lg";

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
  variant?: Variant;
  color?: Color;
  size?: ChipSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
}
