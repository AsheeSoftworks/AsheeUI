import type { AnimationProp } from "../../motion/types";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import type {
  FieldConfig,
  FieldSizeKey,
  InputAnimationPreset,
} from "../field/field-config";

export type RadioSizeKey = FieldSizeKey;
export type RadioVariant = "default" | "card";

export interface RadioConfig extends Omit<FieldConfig, "size" | "variant"> {
  size?: RadioSizeKey;
  color?: Color;
  radius?: keyof Radius;
  variant?: RadioVariant;
  animation?: AnimationProp<InputAnimationPreset>;
  className?: string;
}

export const defaultRadioConfig: RadioConfig = {
  size: "md",
  radius: "full",
  variant: "default",
  animation: "none",
};

export const FALLBACK_RADIO_CONFIG = {
  size: "md",
  radius: "full",
  variant: "default",
  color: "primary",
  status: "default",
  labelAlign: "left",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    radio: RadioConfig;
  }
}

registerComponentDefaults("radio", defaultRadioConfig);
