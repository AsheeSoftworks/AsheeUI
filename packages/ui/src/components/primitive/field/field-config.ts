import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";

export type FieldSizeKey = "sm" | "md" | "lg";
export type FieldStatus = "default" | "error" | "warning" | "success";
export type LabelAlign = "left" | "center" | "right";

export interface FieldSizeValue {
  paddingX: ResponsiveValue<string>;
  paddingY: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface FieldSizeScale {
  default: FieldSizeKey;
  values: Record<FieldSizeKey, FieldSizeValue>;
}

export type InputAnimationPreset = "none" | "scale" | "lift" | "bounce";

export interface FieldConfig {
  size?: FieldSizeScale;
  radius?: keyof Radius;
  variant?: Variant;
  color?: Color;
  animation?: AnimationProp<InputAnimationPreset>;
  labelAlign?: LabelAlign;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
}
