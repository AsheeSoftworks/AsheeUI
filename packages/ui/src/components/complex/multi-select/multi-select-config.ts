import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
import type {
  FieldConfig,
  FieldSizeKey,
} from "../../primitive/field/field-config";

export type MultiSelectSizeKey = FieldSizeKey;

export interface MultiSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface MultiSelectSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface MultiSelectSizeScale {
  default: MultiSelectSizeKey;
  values: Record<MultiSelectSizeKey, MultiSelectSizeValue>;
}

export interface MultiSelectConfig extends Omit<FieldConfig, "size"> {
  size?: MultiSelectSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
}
