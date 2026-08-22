import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";
import type { ButtonSizeKey } from "../button/button-config";
import type { FieldConfig, FieldSizeKey } from "../field/field-config";

export type MultiSelectSizeKey = FieldSizeKey;

export interface MultiSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface MultiSelectConfig extends Omit<FieldConfig, "size"> {
  size?: MultiSelectSizeKey;
  radius?: keyof Radius;
  className?: string;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;

  // Chip Overrides
  chipVariant?: Variant;
  chipColor?: Color;
  chipRadius?: keyof Radius;
  chipSize?: ButtonSizeKey;
}

export const defaultMultiSelectConfig: MultiSelectConfig = {
  size: "md",
  labelAlign: "left",
  animation: "none",
  chipSize: "sm",
  menuSize: "sm",
};

export const FALLBACK_MULTI_SELECT_CONFIG = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "md",
  labelAlign: "left",
  animation: "none",
  chipSize: "sm",
  menuSize: "sm",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    multiSelect: MultiSelectConfig;
  }
}

registerComponentDefaults("multiSelect", defaultMultiSelectConfig);
