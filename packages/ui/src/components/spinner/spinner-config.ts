import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared/size";
import type { Color } from "../../shared/variant";

/** Pixel-size scale of the spinner. */
export type SpinnerSizeKey = Size;

/**
 * Theme configuration options for the Spinner component.
 *
 * Set under `components.spinner` in the AsheeUI config. Values feed
 * the component-level fallback tier of the theme cascade.
 */
export interface SpinnerConfig {
  /** Pixel-size scale.
   *
   * @default "md"
   */
  size?: SpinnerSizeKey;
  /** Theme accent color.
   *
   * @default "primary"
   */
  color?: Color;
  /** CSS `animation-duration` for one rotation.
   *
   * @default "0.75s"
   */
  speed?: string;
  /** Extra classes applied to every spinner instance.
   *
   * @default ""
   */
  className?: string;
}

/**
 * Default config values registered for the Spinner component.
 *
 * `color` is intentionally absent so it inherits from the global
 * `defaultColor`.
 */
export const defaultSpinnerConfig: SpinnerConfig = {
  size: "md",
  speed: "0.75s",
};

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_SPINNER_CONFIG: Required<SpinnerConfig> = {
  size: "md",
  color: "primary",
  speed: "0.75s",
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    spinner: SpinnerConfig;
  }
}

registerComponentDefaults("spinner", defaultSpinnerConfig);
