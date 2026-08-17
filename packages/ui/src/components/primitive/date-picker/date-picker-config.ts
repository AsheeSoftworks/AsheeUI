import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../libs/motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type {
  FieldConfig,
  FieldSizeKey,
  InputAnimationPreset,
} from "../field/field-config";

export type PickerMode = "date" | "time" | "datetime";
export type DatePickerSizeKey = FieldSizeKey;

export interface DatePickerSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
  cellSize: ResponsiveValue<string>;
}

export interface DatePickerSizeScale {
  default: DatePickerSizeKey;
  values: Record<DatePickerSizeKey, DatePickerSizeValue>;
}

export interface DatePickerConfig extends Omit<FieldConfig, "size"> {
  size?: DatePickerSizeScale;
  radius?: keyof Radius;
  variant?: Variant;
  color?: Color;
  animation?: AnimationProp<InputAnimationPreset>;
  className?: string;
}
