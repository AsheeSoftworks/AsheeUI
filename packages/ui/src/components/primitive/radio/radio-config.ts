import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
import type { Color } from "../../../shared/variant";
import type { FieldConfig, FieldSizeKey } from "../field/field-config";

export type RadioSizeKey = FieldSizeKey;
export type RadioVariant = "default" | "card";

export interface RadioSizeValue {
  outerSize: ResponsiveValue<string>;
  innerSize: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
  gap: ResponsiveValue<string>;
}

export interface RadioSizeScale {
  default: RadioSizeKey;
  values: Record<RadioSizeKey, RadioSizeValue>;
}

export interface RadioConfig extends Omit<FieldConfig, "size"> {
  size?: RadioSizeScale;
  color?: Color;
  radius?: keyof Radius;
  variant?: RadioVariant;
  animation?: AnimationProp;
  className?: string;
}
