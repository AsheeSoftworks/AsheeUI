import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";

export type FieldSizeKey = "sm" | "md" | "lg";
export type FieldStatus = "default" | "error" | "warning" | "success";
export type LabelAlign = "left" | "center" | "right";
export type InputAnimationPreset = "none" | "scale" | "lift" | "bounce";

export interface FieldConfig {
  size?: FieldSizeKey;
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

export const defaultFieldConfig: FieldConfig = {
  size: "md",
  labelAlign: "left",
};

export const FALLBACK_FIELD_CONFIG = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  labelAlign: "left",
  status: "default",
} as const;
