import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

export type AutocompleteSizeKey = FieldSizeKey;

export interface AutocompleteOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface AutocompleteConfig extends FieldConfig {
  size?: AutocompleteSizeKey;
  radius?: Radius;

  // Trigger Overrides
  variant?: Variant;
  color?: Color;

  // Menu Overrides
  menuVariant?: Variant;
  menuColor?: Color;
  menuRadius?: Radius;
  menuSize?: Size;
}

export const defaultAutocompleteConfig: AutocompleteConfig = {
  size: "md",
  labelAlign: "left",
  variant: "bordered",
};

export const FALLBACK_AUTOCOMPLETE_CONFIG: Required<AutocompleteConfig> = {
  ...FALLBACK_FIELD_CONFIG,
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  labelAlign: "left",
  menuVariant: "solid",
  menuColor: "default",
  menuRadius: "md",
  menuSize: "sm",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    autocomplete: AutocompleteConfig;
  }
}

registerComponentDefaults("autocomplete", defaultAutocompleteConfig);
