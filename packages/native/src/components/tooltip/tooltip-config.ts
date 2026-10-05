/**
 * Tooltip configuration for the native package.
 *
 * The options are the ones the framework's tooltip contract names, so `components.tooltip` is
 * configured the same way on both platforms, and the types are re-exported from `@asheeui/core`
 * rather than restated here. What stays with the renderer is the value each option defaults to
 * on the platform, and the registration that puts it in the native registry.
 *
 * `portal` and `zIndex` are the two options left out: they are about where a layer sits in a
 * document, and the platform has no document. Everything else carries its documented meaning,
 * including the delay, which is how long a reader rests on the trigger before the hint appears
 * — a long press here, and a pointer resting there.
 */

import type { TooltipConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  TooltipConfig,
  TooltipPlacement,
  TooltipSizeKey,
} from "@asheeui/core";

/**
 * Configuration options for the native Tooltip.
 */
export type NativeTooltipConfig = Omit<TooltipConfig, "portal" | "zIndex">;

/**
 * The defaults the Tooltip registers with the native registry.
 */
export const defaultNativeTooltipConfig: NativeTooltipConfig = {
  size: "md",
  placement: "top",
  delay: 200,
  offset: 8,
  showArrow: false,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    tooltip: NativeTooltipConfig;
  }
}

registerNativeComponentDefaults("tooltip", defaultNativeTooltipConfig);

/**
 * The values the hint falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_TOOLTIP_CONFIG: Required<NativeTooltipConfig> = {
  size: "md",
  placement: "top",
  variant: "solid",
  color: "secondary",
  delay: 200,
  offset: 8,
  radius: "md",
  showArrow: false,
  className: "",
};
