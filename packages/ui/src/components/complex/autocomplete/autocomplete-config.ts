import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { ButtonSizeKey } from "../../primitive/button/button-config";
import type {
  FieldConfig,
  FieldSizeKey,
  InputAnimationPreset,
} from "../../primitive/field/field-config";

export type AutocompleteSizeKey = FieldSizeKey;

export interface AutocompleteOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface AutocompleteSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface AutocompleteSizeScale {
  default: AutocompleteSizeKey;
  values: Record<AutocompleteSizeKey, AutocompleteSizeValue>;
}

export interface AutocompleteConfig extends Omit<FieldConfig, "size"> {
  size?: AutocompleteSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp<InputAnimationPreset>;
  className?: string;

  // Trigger Overrides
  variant?: Variant;
  color?: Color;

  // Menu Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;
}
