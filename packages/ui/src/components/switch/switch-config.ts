import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Color } from "../../shared/variant";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

export type SwitchSizeKey = FieldSizeKey;

export interface SwitchConfig extends Omit<FieldConfig, "size" | "variant"> {
  size?: SwitchSizeKey;
  color?: Color;
  radius?: Radius;
  className?: string;
}

export const defaultSwitchConfig: SwitchConfig = {
  size: "md",
  labelAlign: "left",
  radius: "full",
};

export const FALLBACK_SWITCH_CONFIG: Required<SwitchConfig> = {
  ...FALLBACK_FIELD_CONFIG,
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
