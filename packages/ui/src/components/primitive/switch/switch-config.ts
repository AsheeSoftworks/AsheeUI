import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../libs/motion/types";
import type {
  FieldConfig,
  FieldSizeKey,
  InputAnimationPreset,
} from "../field/field-config";

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

export interface SwitchConfig extends Omit<FieldConfig, "size" | "variant"> {
  size?: SwitchSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp<InputAnimationPreset>;
  className?: string;
}
