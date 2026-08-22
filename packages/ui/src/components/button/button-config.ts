import { registerComponentDefaults } from "../../libs/registry";
import type { AnimationProp } from "../../motion/types";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";

export type ButtonSizeKey = "sm" | "md" | "lg";
export type ButtonAnimationPreset = "none" | "scale" | "lift" | "bounce";

export interface ButtonConfig {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp<ButtonAnimationPreset>;
}

export const defaultButtonConfig: ButtonConfig = {
  size: "md",
  radius: "md",
  animation: "none",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    button: ButtonConfig;
  }
}

registerComponentDefaults("button", defaultButtonConfig);
