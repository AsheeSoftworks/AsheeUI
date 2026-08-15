import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { Color, Variant } from "../../../shared/variant";
import type { ButtonSizeKey } from "../../primitive/button/button-config";
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
  className?: string;

  // Menu / Popover Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: keyof Radius;
  menuSize?: ButtonSizeKey;

  // Chip Overrides
  chipVariant?: Variant;
  chipColor?: Color;
  chipRadius?: keyof Radius;
  chipSize?: ButtonSizeKey;
}
