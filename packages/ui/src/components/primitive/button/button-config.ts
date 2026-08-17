import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../libs/motion/types";
import type { Color, Variant } from "../../../shared/variant";

export type ButtonSizeKey = "sm" | "md" | "lg";
export type ButtonAnimationPreset = "none" | "scale" | "lift" | "bounce";

export interface ButtonSizeValue {
  paddingX: ResponsiveValue<string>;
  paddingY: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
  gap: ResponsiveValue<string>;
}

export interface ButtonSizeScale {
  default: ButtonSizeKey;
  values: Record<ButtonSizeKey, ButtonSizeValue>;
}

export interface ButtonConfig {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp<ButtonAnimationPreset>;
  className?: string;
}
