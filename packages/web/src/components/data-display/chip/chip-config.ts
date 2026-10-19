/**
 * Chip component configuration for AsheeUI.
 *
 * This file registers the values the Chip defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The
 * options themselves, and the types that name them, live in `@asheeui/core`: they are
 * the framework's chip contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values
 * and the registration that puts them in the web registry.
 */

import { type ChipConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  ChipConfig,
  ChipRadiusKey,
  ChipSizeKey,
  ChipVariant,
} from "@asheeui/core";

/**
 * Default config values registered for the Chip component.
 *
 * `variant` and `color` are intentionally absent so they inherit from the global
 * `defaultVariant` / `defaultColor`.
 */
export const defaultChipConfig: ChipConfig = {
  size: "md",
  radius: "full",
};

registerComponentDefaults("chip", defaultChipConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_CHIP_CONFIG: Required<ChipConfig> = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "full",
} as const;
