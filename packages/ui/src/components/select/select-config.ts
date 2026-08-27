import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

export type SelectSizeKey = FieldSizeKey;

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SelectConfig extends Omit<FieldConfig, "size"> {
  size?: SelectSizeKey;
  radius?: Radius;
  className?: string;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: Radius;
  menuSize?: Size;
}

export const defaultSelectConfig: SelectConfig = {
  size: "md",
  labelAlign: "left",
};

export const FALLBACK_SELECT_CONFIG: Required<SelectConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  size: "md",
  radius: "md",
  className: "",
  variant: "bordered",
  color: "primary",
  status: "default",
  labelAlign: "left",
  menuVariant: "solid",
  menuColor: "default",
  menuRadius: "md",
  menuSize: "lg",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    select: SelectConfig;
  }
}

registerComponentDefaults("select", defaultSelectConfig);
