import type { Radius } from "@ashee/config";
import type { AnimationProp } from "@ashee/motion";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonConfig {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
}
