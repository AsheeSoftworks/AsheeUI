import type { Radius } from "@ashee/config";
import type { AnimationProp } from "@ashee/motion";

export type FieldSize = "sm" | "md" | "lg";
export type FieldStatus = "default" | "error" | "warning" | "success";
export type LabelAlign = "left" | "center" | "right";

export interface FieldConfig {
  size?: FieldSize;
  radius?: keyof Radius;
  animation?: AnimationProp;
  labelAlign?: LabelAlign;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
}
