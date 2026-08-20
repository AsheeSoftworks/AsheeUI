import type { AnimationProp } from "../../motion/types";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import type {
  FieldConfig,
  FieldSizeKey,
  InputAnimationPreset,
} from "../field/field-config";

export type SwitchSizeKey = FieldSizeKey;

export interface SwitchConfig extends Omit<FieldConfig, "size" | "variant"> {
  size?: SwitchSizeKey;
  color?: Color;
  radius?: keyof Radius;
  animation?: AnimationProp<InputAnimationPreset>;
  className?: string;
}

export const defaultSwitchConfig: SwitchConfig = {
  size: "md",
  labelAlign: "left",
  animation: "none",
  radius: "full",
};

export const FALLBACK_SWITCH_CONFIG = {
  size: "md",
  radius: "full",
  color: "primary",
  status: "default",
  labelAlign: "left",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    switch: SwitchConfig;
  }
}

registerComponentDefaults("switch", defaultSwitchConfig);
