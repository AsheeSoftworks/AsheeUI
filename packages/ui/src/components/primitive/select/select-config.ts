import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { Color, Variant } from "../../../shared/variant";
import type { ButtonSizeKey } from "../../primitive/button/button-config";
import type { FieldConfig, FieldSizeKey } from "../field/field-config";

export type SelectSizeKey = FieldSizeKey;

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SelectSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface SelectSizeScale {
  default: SelectSizeKey;
  values: Record<SelectSizeKey, SelectSizeValue>;
}

export interface SelectConfig extends Omit<FieldConfig, "size"> {
  size?: SelectSizeScale;
  radius?: keyof Radius;
  className?: string;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;
}
