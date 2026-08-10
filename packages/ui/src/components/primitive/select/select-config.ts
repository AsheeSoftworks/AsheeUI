import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
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
  animation?: AnimationProp;
  className?: string;
}
