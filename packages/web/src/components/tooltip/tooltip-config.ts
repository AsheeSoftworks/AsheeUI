/**
 * Tooltip component configuration for AsheeUI.
 * This file registers the values the Tooltip component defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve.
 * The options themselves, and the types that name them, live in `@asheeui/core`: they
 * are the framework's tooltip contract rather than a web renderer's, and the native
 * renderer reads the same ones from the same place.
 */

import {
  ASHEE_LAYER,
  registerComponentDefaults,
  type TooltipConfig,
} from "@asheeui/core";

export type {
  TooltipConfig,
  TooltipPlacement,
  TooltipSizeKey,
} from "@asheeui/core";

/**
 * Default config values registered for the Tooltip component.
 */
export const defaultTooltipConfig: TooltipConfig = {
  size: "md",
  placement: "top",
  delay: 200,
  offset: 8,
  showArrow: false,
  portal: false,
  zIndex: ASHEE_LAYER.tooltip,
};

registerComponentDefaults("tooltip", defaultTooltipConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_TOOLTIP_CONFIG: Required<TooltipConfig> = {
  size: "md",
  placement: "top",
  variant: "solid",
  color: "secondary",
  delay: 200,
  offset: 8,
  radius: "md",
  showArrow: false,
  portal: false,
  zIndex: ASHEE_LAYER.tooltip,
  className: "",
} as const;
