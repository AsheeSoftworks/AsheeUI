import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

export type MultiSelectSizeKey = FieldSizeKey;

export interface MultiSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface MultiSelectConfig extends Omit<FieldConfig, "size"> {
  size?: MultiSelectSizeKey;
  radius?: Radius;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: Radius;
  menuSize?: Size;

  // Chip Overrides
  chipVariant?: Variant;
  chipColor?: Color;
  chipRadius?: Radius;
  chipSize?: Size;
}

export const defaultMultiSelectConfig: MultiSelectConfig = {
  size: "md",
  variant: "bordered",
  labelAlign: "left",
  chipSize: "sm",
  menuSize: "sm",
};

export const FALLBACK_MULTI_SELECT_CONFIG: Required<MultiSelectConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  status: "default",
  labelAlign: "left",
  menuVariant: "solid",
  menuColor: "secondary",
  menuRadius: "md",
  menuSize: "sm",
  chipVariant: "solid",
  chipColor: "primary",
  chipRadius: "sm",
  chipSize: "sm",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    multiSelect: MultiSelectConfig;
  }
}

registerComponentDefaults("multiSelect", defaultMultiSelectConfig);
