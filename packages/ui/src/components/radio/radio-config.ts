import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Color } from "../../shared/variant";
import type { FieldConfig, FieldSizeKey } from "../field/field-config";

export type RadioSizeKey = FieldSizeKey;
export type RadioVariant = "default" | "card";

export interface RadioConfig extends Omit<FieldConfig, "size" | "variant"> {
  size?: RadioSizeKey;
  color?: Color;
  radius?: Radius;
  variant?: RadioVariant;
  className?: string;
}

export const defaultRadioConfig: RadioConfig = {
  size: "md",
  radius: "full",
  variant: "default",
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
