import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldSizeKey,
} from "../field/field-config";

/** Density scale used by the autocomplete trigger and menu. */
export type AutocompleteSizeKey = FieldSizeKey;

/**
 * A single selectable autocomplete suggestion.
 */
export interface AutocompleteOption {
  /** Text displayed in the input and in the options list. */
  label: string;
  /** Stable identifier returned via `onValueChange`. */
  value: string | number;
  /** Disables the option when `true`.
   *
   * @default false
   */
  disabled?: boolean;
  /** Allows arbitrary option metadata (e.g. icons, descriptions). */
  [key: string]: unknown;
}

/**
 * Theme configuration options for the Autocomplete component.
 *
 * Inherits the shared field config (label handling) and adds trigger
 * and dropdown-menu overrides. Set under `components.autocomplete` in
 * the AsheeUI config.
 */
export interface AutocompleteConfig extends FieldConfig {
  /** Trigger density scale.
   *
   * @default "md"
   */
  size?: AutocompleteSizeKey;
  /** Trigger and menu corner rounding.
   *
   * @default "md"
   */
  radius?: Radius;

  // Trigger Overrides
  /** Visual style of the trigger input.
   *
   * @default "bordered"
   */
  variant?: Variant;
  /** Theme accent color of the trigger input.
   *
   * @default "primary"
   */
  color?: Color;

  // Menu Overrides
  /** Visual style of the dropdown menu.
   *
   * @default "solid"
   */
  menuVariant?: Variant;
  /** Theme accent color of the dropdown menu.
   *
   * @default "default"
   */
  menuColor?: Color;
  /** Corner rounding of the dropdown menu.
   *
   * @default "md"
   */
  menuRadius?: Radius;
  /** Density scale of the dropdown menu.
   *
   * @default "sm"
   */
  menuSize?: Size;
}

/**
 * Default config values registered for the Autocomplete component.
 *
 * Inherits field label defaults from `FALLBACK_FIELD_CONFIG`.
 */
export const defaultAutocompleteConfig: AutocompleteConfig = {
  size: "md",
  labelAlign: "left",
  variant: "bordered",
};

/**
 * Hard fallback values used when no config tier provides a value.
 */
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
