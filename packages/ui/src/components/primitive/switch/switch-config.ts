import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
import type { Color } from "../../../shared/variant";
import type { FieldConfig, FieldSizeKey } from "../field/field-config";

export type SwitchSizeKey = FieldSizeKey;

export interface SwitchSizeValue {
  trackWidth: ResponsiveValue<string>;
  trackHeight: ResponsiveValue<string>;
  thumbSize: ResponsiveValue<string>;
  thumbTranslate: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface SwitchSizeScale {
  default: SwitchSizeKey;
  values: Record<SwitchSizeKey, SwitchSizeValue>;
}

export interface SwitchConfig extends Omit<FieldConfig, "size"> {
  size?: SwitchSizeScale;
  color?: Color;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
}
