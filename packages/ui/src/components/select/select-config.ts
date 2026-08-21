import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";
import type { ButtonSizeKey } from "../button/button-config";
import type { FieldConfig, FieldSizeKey } from "../field/field-config";

export type SelectSizeKey = FieldSizeKey;

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SelectConfig extends Omit<FieldConfig, "size"> {
  size?: SelectSizeKey;
  radius?: keyof Radius;
  className?: string;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;
}

export const defaultSelectConfig: SelectConfig = {
  size: "md",
  labelAlign: "left",
  animation: "none",
};

export const FALLBACK_SELECT_CONFIG = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  labelAlign: "left",
  menuSize: "sm",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    select: SelectConfig;
  }
}

registerComponentDefaults("select", defaultSelectConfig);
