import type { AnimationProp } from "../../../motion/types";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";
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
