import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";

export type ButtonSizeKey = Size;
export type ButtonRadiusKey = Radius;

export interface ButtonConfig {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeKey;
  radius?: ButtonRadiusKey;
  animate?: boolean;
  fullWidth?: boolean;
}

export const defaultButtonConfig: ButtonConfig = {
  size: "md",
  animate: true,
  fullWidth: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    button: ButtonConfig;
  }
}

registerComponentDefaults("button", defaultButtonConfig);

export const FALLBACK_BUTTON_CONFIG: Required<ButtonConfig> = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "md",
  animate: true,
  fullWidth: false,
} as const;
