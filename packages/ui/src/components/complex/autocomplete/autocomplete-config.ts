import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
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

export interface AutocompleteConfig extends Omit<FieldConfig, "size"> {
  size?: AutocompleteSizeKey;
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

export const defaultAutocompleteConfig: AutocompleteConfig = {
  size: "md",
  labelAlign: "left",
  animation: "none",
};

export const FALLBACK_AUTOCOMPLETE_CONFIG = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  labelAlign: "left",
  menuSize: "sm",
} as const;
